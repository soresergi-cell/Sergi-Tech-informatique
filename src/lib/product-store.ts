import { promises as fs } from "fs";
import path from "path";
import { PRODUCTS as SEED_PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { bestDiscount, daysBetween, promoState, todayIso } from "@/lib/promo";
import type { CategorySlug, Product, ProductInput } from "@/types/product";

/**
 * Dépôt de données produits (couche serveur uniquement).
 *
 * Les produits sont persistés dans `data/produits.json`, initialisé au premier
 * démarrage avec le catalogue de démonstration (`src/data/products.ts`).
 * Toutes les écritures sont sérialisées pour éviter les conflits.
 *
 * ⚠️ Hébergement : ce stockage fichier convient à un hébergement classique
 * (mutualisé/VPS, comme prévu au CDC §3.2). Sur une plateforme sans disque
 * persistant, remplacer les deux fonctions `readStore` / `writeStore`
 * par un accès base de données.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "produits.json");

/** File d'attente des écritures (sérialisation). */
let writeQueue: Promise<unknown> = Promise.resolve();

/** Lecture du catalogue (seed automatique si le fichier n'existe pas). */
export async function readStore(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Product[];
    if (Array.isArray(parsed)) return parsed;
    return [...SEED_PRODUCTS];
  } catch {
    // Premier démarrage : on initialise le fichier avec le catalogue de démo
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(SEED_PRODUCTS, null, 2), "utf-8");
    return [...SEED_PRODUCTS];
  }
}

/** Écriture atomique (fichier temporaire puis remplacement). */
async function writeStore(products: Product[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DATA_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(products, null, 2), "utf-8");
  await fs.rename(tmp, DATA_FILE);
}

/** Exécute une mutation en série. */
function enqueue<T>(operation: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(operation, operation);
  writeQueue = next.catch(() => undefined);
  return next;
}

/** Transforme un libellé en slug d'URL. */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 70);
}

/** Génère un slug unique. */
function uniqueSlug(base: string, products: Product[], ignoreId?: string): string {
  const taken = new Set(products.filter((p) => p.id !== ignoreId).map((p) => p.slug));
  const root = base || "produit";
  if (!taken.has(root)) return root;
  let i = 2;
  while (taken.has(`${root}-${i}`)) i++;
  return `${root}-${i}`;
}

/** Génère un identifiant interne unique. */
function nextId(products: Product[]): string {
  const max = products.reduce((acc, p) => {
    const n = Number(p.id.replace(/\D/g, ""));
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 0);
  return `p${String(max + 1).padStart(2, "0")}`;
}

/** Normalise les données reçues du formulaire d'administration. */
function normalize(input: ProductInput): ProductInput {
  const images = (input.images ?? []).filter(Boolean);
  const price = Math.max(0, Math.round(Number(input.price) || 0));
  const originalPrice = input.originalPrice ? Math.round(Number(input.originalPrice)) : undefined;
  return {
    ...input,
    name: input.name.trim(),
    reference: input.reference.trim(),
    brand: input.brand.trim(),
    description: (input.description ?? "").trim(),
    shortDescription: (input.shortDescription ?? "").trim(),
    specs: (input.specs ?? []).filter((s) => s.label.trim() || s.value.trim()),
    images: images.length ? images : ["/products/placeholder-1.webp"],
    price,
    originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
    promo:
      originalPrice && originalPrice > price && input.promo?.start && input.promo?.end
        ? input.promo
        : undefined,
    stock: Math.max(0, Math.round(Number(input.stock) || 0)),
    warranty: (input.warranty ?? "").trim() || "12 mois",
  };
}

/* ------------------------------- API publique ------------------------------- */

/** Catalogue complet, trié par date de création (nouveautés d'abord). */
export async function listProducts(): Promise<Product[]> {
  const products = await readStore();
  return products.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Recherche par identifiant interne. */
export async function findProductById(id: string): Promise<Product | undefined> {
  const products = await readStore();
  return products.find((p) => p.id === id);
}

/** Recherche par slug (fiche produit). */
export async function findProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await readStore();
  return products.find((p) => p.slug === slug);
}

/** Produits mis en avant (accueil). */
export async function listFeaturedProducts(): Promise<Product[]> {
  const products = await listProducts();
  const featured = products.filter((p) => p.featured);
  return (featured.length ? featured : products).slice(0, 6);
}

/**
 * Promotions réellement applicables aujourd'hui (EF-06).
 * Une remise dont la fenêtre n'est pas encore ouverte ou est terminée est
 * exclue : la page d'accueil et la page Promotions n'affichent que des offres
 * véritables, sans intervention manuelle.
 */
export async function listPromoProducts(): Promise<Product[]> {
  const today = todayIso();
  const products = await listProducts();
  return products
    .map((product) => ({ product, state: promoState(product, today) }))
    .filter((entry) => entry.state.active)
    .sort((a, b) => (b.state.discount ?? 0) - (a.state.discount ?? 0))
    .map((entry) => entry.product);
}

/**
 * Sélection du carrousel héro : promotions en cours (les plus fortes remises
 * d'abord) puis complétée par les produits les plus populaires si le nombre
 * demandé n'est pas atteint. Un produit sans photo est écarté, l'emplacement
 * devant rester visuel.
 */
export async function listHeroShowcase(limit = 5): Promise<Product[]> {
  const [promos, popular] = await Promise.all([listPromoProducts(), listPopularProducts(20)]);
  const picked: Product[] = [];
  const seen = new Set<string>();

  for (const product of [...promos, ...popular]) {
    if (picked.length >= limit) break;
    if (seen.has(product.id) || !product.images?.[0]) continue;
    seen.add(product.id);
    picked.push(product);
  }
  return picked;
}

/**
 * Score de popularité.
 * Aucun historique de vues n'est disponible côté serveur : le classement est
 * donc une heuristique transparente, uniquement fondée sur des champs modifiables
 * depuis l'administration (mise en avant, promo, stock, fraîcheur, richesse de la fiche).
 */
function popularityScore(product: Product, today: string): number {
  const state = promoState(product, today);
  let score = 0;

  if (product.featured) score += 40; // « Mettre en avant » coché dans l'admin
  if (state.active) score += 15 + Math.min(state.discount ?? 0, 25); // remise attractive
  if (product.stock > 5) score += 10;
  else if (product.stock > 0) score += 5; // un produit en rupture n'est pas poussé

  const ageDays = Math.max(daysBetween(product.createdAt, today), 0);
  score += Math.max(0, 20 - Math.round(ageDays / 15)); // fraîcheur

  score += Math.min(10, product.specs?.length ?? 0); // fiche complète = mieux référencée
  return score;
}

/** Produits « populaires » : classement calculé, jamais codé en dur. */
export async function listPopularProducts(limit = 8): Promise<Product[]> {
  const today = todayIso();
  const products = await listProducts();
  return products
    .map((product) => ({ product, score: popularityScore(product, today) }))
    .sort((a, b) => b.score - a.score || b.product.createdAt.localeCompare(a.product.createdAt))
    .slice(0, limit)
    .map((entry) => entry.product);
}

/** Nouveautés : les derniers produits créés (date gérée par l'admin). */
export async function listNewArrivals(limit = 8): Promise<Product[]> {
  const products = await listProducts(); // déjà trié du plus récent au plus ancien
  return products.slice(0, limit);
}

/** Compteurs par catégorie, affichés sur la grille de l'accueil. */
export interface CategoryCount {
  total: number;
  promos: number;
  inStock: number;
}

export async function categoryCounts(): Promise<Record<CategorySlug, CategoryCount>> {
  const today = todayIso();
  const products = await listProducts();

  const counts = {} as Record<CategorySlug, CategoryCount>;
  for (const category of CATEGORIES) {
    counts[category.slug] = { total: 0, promos: 0, inStock: 0 };
  }

  for (const product of products) {
    const bucket = counts[product.category];
    if (!bucket) continue;
    bucket.total += 1;
    if (product.stock > 0) bucket.inStock += 1;
    if (promoState(product, today).active) bucket.promos += 1;
  }
  return counts;
}

/** Chiffres réels de la bande de statistiques du héro et du bandeau « à propos ». */
export interface HomeStats {
  products: number;
  categories: number;
  promos: number;
  bestDiscount: number;
  unitsInStock: number;
  brands: number;
}

export async function homeStats(): Promise<HomeStats> {
  const products = await listProducts();
  const today = todayIso();
  const active = products.filter((product) => promoState(product, today).active);

  return {
    products: products.length,
    categories: CATEGORIES.length,
    promos: active.length,
    bestDiscount: bestDiscount(products, today),
    unitsInStock: products.reduce((sum, product) => sum + Math.max(product.stock, 0), 0),
    brands: new Set(products.map((product) => product.brand.trim().toLowerCase())).size,
  };
}

/** Crée un produit et renvoie l'enregistrement complet. */
export async function createProduct(input: ProductInput): Promise<Product> {
  return enqueue(async () => {
    const products = await readStore();
    const data = normalize(input);
    const product: Product = {
      ...data,
      id: nextId(products),
      slug: uniqueSlug(slugify(data.name), products),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    await writeStore([product, ...products]);
    return product;
  });
}

/** Met à jour un produit existant. */
export async function updateProduct(id: string, input: ProductInput): Promise<Product | null> {
  return enqueue(async () => {
    const products = await readStore();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const data = normalize(input);
    const current = products[index];
    const updated: Product = {
      ...current,
      ...data,
      // Le slug suit le nom, sauf s'il reste exploitable
      slug: uniqueSlug(slugify(data.name), products, id),
    };
    products[index] = updated;
    await writeStore(products);
    return updated;
  });
}

/** Supprime un produit. */
export async function deleteProduct(id: string): Promise<boolean> {
  return enqueue(async () => {
    const products = await readStore();
    const remaining = products.filter((p) => p.id !== id);
    if (remaining.length === products.length) return false;
    await writeStore(remaining);
    return true;
  });
}

/** Indicateurs du tableau de bord d'administration. */
export async function storeStats() {
  const products = await readStore();
  const total = products.length;
  const promos = products.filter((p) => p.originalPrice && p.originalPrice > p.price).length;
  const outOfStock = products.filter((p) => p.stock <= 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const stockValue = products.reduce((sum, p) => sum + p.price * Math.max(p.stock, 0), 0);
  return { total, promos, outOfStock, lowStock, stockValue };
}

