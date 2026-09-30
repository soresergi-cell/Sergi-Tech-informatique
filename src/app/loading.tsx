/** Indicateur de chargement entre les navigations. */
export default function Loading() {
  return (
    <div className="container flex min-h-[50vh] items-center justify-center py-16">
      <div
        className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-primary"
        role="status"
        aria-label="Chargement"
      />
    </div>
  );
}