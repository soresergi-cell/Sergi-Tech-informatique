"use client";

import { useEffect, useState } from "react";

/**
 * Évite les erreurs d'hydratation pour les composants dépendant
 * du localStorage (panier Zustand persist).
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
