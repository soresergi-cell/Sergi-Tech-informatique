import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Primitives de tableau (pattern shadcn/ui) adaptées à l'administration :
 * - un seul conteneur défilant (`TableScroll`) : c'est le corps du tableau qui scrolle, pas la page ;
 * - en-têtes collants (`TableHead`) qui restent visibles pendant le défilement vertical ;
 * - défilement fluide (`scroll-smooth`) et barre de défilement discrète (`scrollbar-slim`).
 *
 * Note technique : `border-separate` + ombres internes. Avec `border-collapse`,
 * la bordure basse des `th` en `position: sticky` disparaît pendant le défilement.
 */

type TableProps = React.HTMLAttributes<HTMLTableElement> & {
  /** Classe du conteneur défilant (hauteur maximale, ex. `max-h-[62vh]`). */
  containerClassName?: string;
  /** Libellé d'accessibilité du panneau défilant. */
  scrollLabel?: string;
};

/** Panneau défilable (vertical + horizontal). `tabIndex` permet le défilement au clavier. */
const TableScroll = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { ariaLabel?: string }
>(({ className, ariaLabel, children, ...props }, ref) => (
  <div
    ref={ref}
    role="region"
    aria-label={ariaLabel ?? "Tableau de données"}
    tabIndex={0}
    className={cn(
      "scrollbar-slim relative w-full scroll-smooth overflow-auto overscroll-contain",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
TableScroll.displayName = "TableScroll";

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, scrollLabel, ...props }, ref) => (
    <TableScroll ariaLabel={scrollLabel} className={containerClassName}>
      <table
        ref={ref}
        className={cn("w-full caption-bottom border-separate border-spacing-0 text-sm", className)}
        {...props}
      />
    </TableScroll>
  )
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("z-20", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child>td]:shadow-none", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "group h-14 bg-white transition-colors hover:bg-slate-50 focus-within:bg-slate-50",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

/** En-tête de colonne : collant, typographie discrète, séparateur persistant. */
const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      scope="col"
      className={cn(
        "sticky top-0 z-20 whitespace-nowrap bg-slate-50 px-4 py-3 text-left align-middle",
        "text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500",
        "shadow-[inset_0_-1px_0_#e2e8f0] [&:first-child]:pl-5 [&:last-child]:pr-5",
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        "px-4 py-3 align-middle shadow-[inset_0_-1px_0_#f1f5f9] [&:first-child]:pl-5 [&:last-child]:pr-5",
        className
      )}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 px-5 text-xs text-slate-500", className)} {...props} />
));
TableCaption.displayName = "TableCaption";

export { Table, TableScroll, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption };
