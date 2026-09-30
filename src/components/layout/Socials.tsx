import { Facebook, Instagram } from "lucide-react";
import { SITE } from "@/data/site";
import { cn } from "@/lib/utils";

/** Icône TikTok (non fournie par lucide). */
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-1.79-2.46V9.8a5.77 5.77 0 1 0 4.88 5.68V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.24-1.48Z" />
    </svg>
  );
}

/**
 * Liens réseaux sociaux (EF-13) : Facebook, Instagram, TikTok.
 * Utilisé dans le header mobile, le footer et la page Contact.
 */
export function Socials({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {SITE.socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          title={s.label}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all hover:bg-primary hover:text-white",
            iconClassName
          )}
        >
          {s.icon === "facebook" && <Facebook className="h-4 w-4" aria-hidden />}
          {s.icon === "instagram" && <Instagram className="h-4 w-4" aria-hidden />}
          {s.icon === "tiktok" && <TikTokIcon className="h-4 w-4" aria-hidden />}
        </a>
      ))}
    </div>
  );
}
