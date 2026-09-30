import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Badge du design system : promo, stock, nouveauté, catégories. */
const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        promo: "border-transparent bg-brand-orange text-white",
        success: "border-transparent bg-emerald-600 text-white",
        warning: "border-transparent bg-amber-500 text-white",
        outline: "text-brand-navy border-slate-300 bg-white",
        cyan: "border-transparent bg-cyan-600 text-white",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Rendu en <span> (et non <div>) : un Badge est souvent placé dans un
 * contexte phrasé (<p>, <h1>, <button>...). Un <div> dans un <p> est invalide
 * et provoque une erreur d'hydratation React/Next.
 * La classe utilitaire `inline-flex` conserve exactement le même rendu.
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
