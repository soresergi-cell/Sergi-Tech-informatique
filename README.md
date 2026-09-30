# SERGI-TECH – Site e-commerce

Site e-commerce moderne et responsive pour **SERGI-TECH**, boutique de produits
informatiques au Burkina Faso (ordinateurs, composants, stockage, périphériques,
réseau, impression, accessoires).

Réalisé conformément au **cahier des charges fonctionnel v1.0** (28/09/2026) et au
**rapport de modélisation UML** (cas d'utilisation, séquence, classes, activité, Gantt).

---

## 1. Stack technique

| Élément | Technologie |
|---|---|
| Framework | **Next.js 15** (App Router) + **TypeScript** |
| Styles | **Tailwind CSS 3.4** + design system type **shadcn/ui** (CVA, Radix) |
| Animations | **Framer Motion** (apparitions subtiles, micro-interactions) |
| État panier | **Zustand** (+ persistance `localStorage`) |
| Typographie | **Inter** (next/font) |
| Images | **WebP**, lazy loading, `next/image` (AVIF/WebP) |
| SEO | Metadata API, Open Graph, **JSON-LD produits**, sitemap.xml, robots.txt |

---

## 2. Installation

```bash
# 1. Dépendances
npm install

# 2. (Optionnel) Régénérer les visuels produits de démonstration
python scripts/generate-images.py     # requiert Pillow : pip install pillow

# 3. Serveur de développement
npm run dev
# → http://localhost:3000

# 4. Build de production
npm run build && npm start

# 5. Lint (ESLint – next/core-web-vitals)
npm run lint
```

**Prérequis** : Node.js ≥ 20, npm ≥ 10.

---

## 3. Structure du projet

```
sergi-tech/
├── public/
│   └── products/               # 38 images WebP (19 produits × 2 vues)
├── scripts/
│   └── generate-images.py      # Génération des visuels de démonstration
└── src/
    ├── app/                    # Pages (App Router)
    │   ├── layout.tsx          # Layout racine, metadata globales, JSON-LD
    │   ├── page.tsx            # Accueil
    │   ├── boutique/           # Catalogue + filtres + tri
    │   ├── produit/[slug]/     # Fiche produit (SSG + JSON-LD)
    │   ├── panier/             # Panier
    │   ├── promotions/         # Promotions en cours
    │   ├── devis/              # Formulaire de devis pro
    │   ├── a-propos/           # À propos
    │   ├── contact/            # Contact + Google Maps + horaires
    │   ├── faq/                # FAQ
    │   ├── mentions-legales/   # Mentions légales
    │   ├── cgv/                # Conditions générales de vente
    │   ├── confidentialite/    # Politique de confidentialité
    │   ├── sitemap.ts          # Sitemap automatique
    │   ├── robots.ts           # Robots.txt
    │   └── not-found.tsx       # Page 404
    ├── components/
    │   ├── layout/             # Header, Footer, MobileNav, WhatsAppFab, Logo, Socials
    │   ├── home/               # Hero, CategoryGrid, FeaturedProducts, PromoSection…
    │   ├── product/            # ProductCard, ProductDetail
    │   ├── shop/               # Catalog, Filters, catalog-utils
    │   ├── cart/               # CartView, CartItems, CartSummary
    │   ├── forms/              # QuoteForm, ContactForm
    │   ├── legal/              # LegalContainer
    │   └── ui/                 # Button, Badge, Card, Input, Sheet, Reveal…
    ├── data/                   # site.ts (config), categories.ts, products.ts (19 produits)
    ├── hooks/                  # use-mounted (hydratation)
    ├── lib/                    # utils (cn), format, whatsapp, seo
    ├── store/                  # cart.ts (Zustand + persist)
    └── types/                  # product.ts (modèle issu du MCD)
```

## 4. Fonctionnalités

### Must-have (priorité haute)
- ✅ Catalogue 7 catégories – **19 produits** mock réalistes (specs, stock, garantie)
- ✅ Recherche globale (header + boutique), **filtres** (catégorie, marque, prix,
  disponibilité, promo) et **tri** (nouveautés, prix, nom) – état synchronisé dans l'URL
- ✅ Fiche produit riche : galerie multi-photos, caractéristiques, prix barré + promo,
  badge « Promo », stock, garantie, suggestions
- ✅ **Bouton « Commander sur WhatsApp »** avec message prérempli (nom, référence,
  quantité, prix, lien de la fiche) – fiche, carte produit, panier
- ✅ **Bouton flottant WhatsApp** (toutes pages)
- ✅ **Panier fonctionnel** (Zustand persistant : quantités, suppression, total,
  mode de livraison retrait/livraison, coordonnées client)
- ✅ Formulaire de **demande de devis** (validation client, envoi WhatsApp/e-mail)
- ✅ **Google Maps** intégré (iframe sans clé) + itinéraire + horaires
- ✅ Réseaux sociaux Facebook / Instagram / TikTok (header mobile, footer, contact)
- ✅ SEO technique : titles, meta descriptions, Open Graph, **JSON-LD produits**,
  sitemap.xml, robots.txt, URLs canoniques
- ✅ Performance : images WebP légères (~9 Ko), lazy loading, code splitting,
  composants serveur par défaut (client uniquement si nécessaire)

### Important
- ✅ Promotions périodiques (prix barré + dates d'effet + badge automatique)
- ✅ Modes de livraison (retrait boutique / livraison locale 2 000 FCFA) et
  **paiement à la livraison (COD)**
- ✅ Responsive de 320 px à 1920 px, mobile first (menu tiroir, tiroir filtres)
- ✅ Accessibilité : contrastes AA, textes alternatifs, focus visible, lien d'évitement,
  navigation clavier, ARIA

---

## 5. Données & configuration

- **Coordonnées** (téléphone, e-mail, adresse, réseaux sociaux, horaires) : centralisées
  dans `src/data/site.ts` – **un seul fichier à modifier**, tout le site (en-tête, pied
  de page, Contact, mentions légales, carte Google Maps, liens WhatsApp, JSON-LD) en
  hérite.
  - Téléphone / WhatsApp : **+226 77 85 27 79** (`phone`, `phoneHref`, `whatsapp`).
  - Boutique : **Kalgodin, non loin d'Aube Nouvelle, Ouagadougou, Burkina Faso**
    (`address`) ; l'emplacement de la carte utilise le repère `mapsQuery`
    « Aube Nouvelle, Ouagadougou », mieux reconnu par Google Maps.
- **Catalogue** : `src/data/products.ts` (structure conforme au §2.3 du CDC).
- **Images** : `public/products/*.webp` sont des visuels de **démonstration** générés par
  `scripts/generate-images.py` – à remplacer par les photos réelles (mêmes noms de
  fichiers, ou mettre à jour les champs `images` des produits).
  Les photos téléversées depuis l'espace de gestion sont écrites dans le même
  répertoire, avec l'extension déduite de leur contenu réel (un JPEG renommé
  `.png` est rangé en `.jpg`). Elles sont servies immédiatement par la route
  dynamique `/api/images/[...file]` (réécriture `afterFiles` de
  `next.config.ts`) : **aucun redémarrage du serveur n'est nécessaire**,
  `next start` ne publiant que les fichiers présents dans `public/` au lancement.

---

## 6. Parcours de commande (fidèle aux diagrammes UML)

```
Visiteur → Catalogue (recherche/filtres) → Fiche produit
    ├─→ « Commander WhatsApp » (message prérempli) ─→ Échange avec la boutique
    └─→ Panier → Mode de livraison → Coordonnées → « Commander WhatsApp » (récapitulatif)
Professionnel → /devis → Formulaire → WhatsApp / e-mail (réponse < 24 h ouvrées)
```

Paiement à la livraison ou en boutique ; Mobile Money / CB prévus en évolution
(hors périmètre MVP du CDC).

---

## 7. Évolutions prévues (hors périmètre actuel)

- Back-office d'administration (EF-05 à EF-09, US-08 à US-10)
- Compte client, liste de souhaits, avis (EF-15, EF-16)
- Passerelle Mobile Money / carte (US-06)
- Multilingue fr/en et multi-devises (EF-18)

---

## 8. Conformité CDC (extraits)

| Exigence | Implémentation |
|---|---|
| EF-01/02/03 | Galerie, fiche détaillée, navigation par catégories |
| EF-04 | Recherche + filtres (prix, marque, catégorie, dispo) + tri |
| EF-06 | Prix barré, période de promo, badge « Promo » |
| EF-07 | Bouton WhatsApp message prérempli |
| EF-08/09 | Panier, livraison/retrait, paiement à la livraison |
| EF-10 | Formulaire de devis |
| EF-11/12/13 | Google Maps, horaires, réseaux sociaux |
| EF-19 | Responsive 320 → 1920 px |
| §5 | Perf < 3 s, accessibilité, HTTPS, sauvegardes (hébergeur) |

---

## 9. Espace de gestion (Ajouter / Modifier / Supprimer des produits)

Le site dispose d'un **back-office** accessible depuis le pied de page
(« Espace de gestion ») ou directement sur `/admin` :

- **URL** : `/admin/connexion` (mot de passe, variable `ADMIN_PASSWORD`).
  Les alias `/admin/login` et `/admin/signin` y redirigent automatiquement.
- **Tableau de bord** (`/admin`) : indicateurs (total, promos, ruptures, valeur du
  stock), recherche et liste des produits avec boutons **Modifier** et **Supprimer**.
- **Ajouter** (`/admin/produits/nouveau`) : formulaire complet (infos, prix, stock,
  promotion avec dates, garantie, description courte + détaillée, caractéristiques
  techniques dynamiques, photos par **téléversement** ou URL, mise en avant).
- **Modifier** (`/admin/produits/[id]`) : même formulaire prérempli + lien « Voir la
  fiche » + bouton **Supprimer** (avec confirmation).
- Les modifications sont **publiées immédiatement** sur le site public
  (accueil, boutique, promotions, fiches, sitemap).

**Sécurité** : middleware Next.js (vérification HMAC avant tout rendu : aucune
donnée catalogue n'est envoyée à un visiteur non connecté), session en cookie
`httpOnly` de 8 h, comparaisons à temps constant, API protégées par garde 401,
pages `noindex`.

**Persistance** : les produits sont stockés dans `data/produits.json` (initialisé
avec le catalogue de démo). Cela convient à un hébergement classique avec disque
persistant (VPS / mutualisé, comme prévu au CDC §3.2).

**Mot de passe** : définissez `ADMIN_PASSWORD` dans `.env.local` (voir
`.env.local.example`), puis reconstruisez le projet (`npm run build` + `npm start`).

---

## 10. Documentation de référence

Les documents d'analyse ayant guidé la réalisation sont conservés dans `docs/` :

- `docs/cahier-des-charges-extrait.txt` – texte extrait du CDC fonctionnel v1.0
- `docs/rapport-diagrammes-uml-extrait.txt` – texte extrait du rapport UML
  (cas d'utilisation, séquence, classes, activité, Gantt)

> **Écart assumé par rapport au CDC** : la section 3.1 du cahier des charges
> recommandait WordPress + WooCommerce. La commande de réalisation impose une
> stack **Next.js 15 / TypeScript / Tailwind / shadcn-ui / Framer Motion / Zustand**,
> retenue ici pour ses performances (charge utile JS réduite, HTML pré-rendu,
> images optimisées) et sa maintenabilité.