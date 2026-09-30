import {
  ArrowRight,
  Backpack,
  Clock,
  Cpu,
  FileText,
  HardDrive,
  Laptop,
  MessageCircle,
  Mouse,
  Percent,
  Printer,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  Wallet,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import type { HomeIconKey } from "@/data/home";
import type { CategorySlug } from "@/types/product";

/**
 * Registre d'icônes de la page d'accueil.
 * `src/data/home.ts` reste des données pures : il référence des clés de chaînes,
 * et ce fichier fait le lien avec Lucide.
 */
export const HOME_ICONS: Record<HomeIconKey, LucideIcon> = {
  truck: Truck,
  shield: ShieldCheck,
  wallet: Wallet,
  chat: MessageCircle,
  store: Store,
  sparkles: Sparkles,
  percent: Percent,
  clock: Clock,
  file: FileText,
};

/** Icônes des catégories du catalogue. */
export const CATEGORY_ICONS: Record<CategorySlug, LucideIcon> = {
  ordinateurs: Laptop,
  composants: Cpu,
  stockage: HardDrive,
  peripheriques: Mouse,
  reseau: Wifi,
  impression: Printer,
  accessoires: Backpack,
};

export { ArrowRight };
