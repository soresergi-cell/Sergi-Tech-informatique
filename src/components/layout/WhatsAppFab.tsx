"use client";

import { motion } from "framer-motion";
import { SITE } from "@/data/site";

/**
 * Bouton flottant WhatsApp (exigence « bouton flottant » du CDC §2.9).
 * Visible sur toutes les pages, discrète sur mobile (en bas à droite).
 */
export function WhatsAppFab() {
  const href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    `Bonjour ${SITE.name} ! J'ai une question sur vos produits.`
  )}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter SERGI-TECH sur WhatsApp"
      title="Discuter sur WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-600/30 sm:bottom-6 sm:right-6"
    >
      {/* halo pulsant */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-30"
      />
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden>
        <path d="M16 3C9.4 3 4 8.4 4 15c0 2.3.7 4.5 1.9 6.4L4 29l7.8-1.8c1.8 1 3.9 1.5 6.1 1.5 6.6 0 12-5.4 12-12S22.6 3 16 3Zm0 21.8c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.6 1.1 1.2-4.5-.3-.4A9.7 9.7 0 0 1 6.2 15C6.2 9.6 10.6 5.2 16 5.2S25.8 9.6 25.8 15 21.4 24.8 16 24.8Zm5.4-7.3c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1a8 8 0 0 1-4-3.5c-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5l-.9-2.1c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5 4.4 1.9.8 2.6.9 3.5.7.6-.1 1.8-.7 2-1.5.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.6-.3Z" />
      </svg>
    </motion.a>
  );
}
