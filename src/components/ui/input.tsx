import * as React from "react";
import { cn } from "@/lib/utils";

/** Champ de saisie (formulaire devis, contact, filtres). */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm text-brand-navy shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

/** Zone de texte multi-lignes. */
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[110px] w-full rounded-lg border border-input bg-white px-3 py-2 text-sm text-brand-navy shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

/** Étiquette de champ de formulaire. */
const Label = React.forwardRef<HTMLLabelElement, React.ComponentProps<"label">>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-sm font-medium text-brand-navy", className)}
      {...props}
    />
  )
);
Label.displayName = "Label";

/** Séparateur visuel. */
function Separator({ className }: { className?: string }) {
  return <div aria-hidden className={cn("h-px w-full bg-border", className)} />;
}

export { Input, Textarea, Label, Separator };
