"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const HOUR_MS = 3_600_000;
const MINUTE_MS = 60_000;

/** Fin d'opération en millisecondes (à la dernière minute du jour passé). */
function endToMs(end?: string | null): number | null {
  if (!end) return null;
  const parsed = Date.parse(`${end.slice(0, 10)}T23:59:59`);
  return Number.isNaN(parsed) ? null : parsed;
}

/** Décompose un écart en jours / heures / minutes / secondes. */
function breakdown(ms: number) {
  const remaining = Math.max(0, ms);
  return {
    days: Math.floor(remaining / (24 * HOUR_MS)),
    hours: Math.floor((remaining % (24 * HOUR_MS)) / HOUR_MS),
    minutes: Math.floor((remaining % HOUR_MS) / MINUTE_MS),
    seconds: Math.floor((remaining % MINUTE_MS) / 1000),
  };
}

/**
 * Compte à rebours d'une promotion (EF-06 / AC-13).
 *
 * Il s'arrête de lui-même une fois la date de fin dépassée (« Promotion
 * terminée ») : la page ne peut pas afficher une offre périmée, et le produit
 * disparaît de toute façon du catalogue dès que la fenêtre est écoulée.
 */
export function PromoCountdown({
  end,
  daysLabel,
  compact = false,
  tone = "dark",
}: {
  /** Date de fin ISO `YYYY-MM-DD` de l'opération. */
  end?: string | null;
  /** Libellé affiché sous le bloc « jours » (ex. « restantes »). */
  daysLabel?: string;
  /** Format réduit : les jours sont basculés dans les heures. */
  compact?: boolean;
  /** `light` sur fond coloré, `dark` sur fond clair. */
  tone?: "light" | "dark";
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const endMs = endToMs(end);

  // Rendu serveur volontairement neutre : la page est mise en cache, le délai
  // ne peut être calculé que dans le navigateur du visiteur.
  if (now === null) {
    return (
      <span className="inline-flex min-h-[26px] items-center text-sm text-slate-400">
        Calcul du délai…
      </span>
    );
  }

  if (endMs === null) return null;

  const msLeft = endMs - now;

  if (msLeft <= 0) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold",
          tone === "light" ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"
        )}
      >
        Promotion terminée
      </span>
    );
  }

  const parts = breakdown(msLeft);

  return (
    <span
      className="inline-flex items-center gap-1.5"
      suppressHydrationWarning
      aria-label={`Fin de la promotion dans ${parts.days} jours, ${parts.hours} heures et ${parts.minutes} minutes`}
    >
      {!compact && parts.days > 0 && (
        <span className="flex flex-col items-center">
          <CounterBox value={parts.days} tone={tone} />
          <span
            className={cn(
              "mt-1 text-[10px] font-medium",
              tone === "light" ? "text-white/80" : "text-slate-500"
            )}
          >
            {daysLabel ?? "jours"}
          </span>
        </span>
      )}
      <CounterBox value={compact ? parts.days * 24 + parts.hours : parts.hours} tone={tone} />
      <CounterSeparator tone={tone} />
      <CounterBox value={parts.minutes} tone={tone} />
      <CounterSeparator tone={tone} />
      <CounterBox value={parts.seconds} tone={tone} />
    </span>
  );
}

function CounterBox({ value, tone }: { value: number; tone: "light" | "dark" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex min-w-[2.1rem] justify-center rounded-lg px-1.5 py-1 text-sm font-extrabold tabular-nums shadow-sm",
        tone === "light" ? "bg-white/25 text-white" : "bg-brand-navy text-white"
      )}
    >
      {String(value).padStart(2, "0")}
    </span>
  );
}

function CounterSeparator({ tone }: { tone: "light" | "dark" }) {
  return (
    <span
      aria-hidden
      className={cn("text-sm font-bold", tone === "light" ? "text-white/70" : "text-slate-400")}
    >
      :
    </span>
  );
}
