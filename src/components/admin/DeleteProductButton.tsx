"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
  /** Redirige vers le tableau de bord après suppression (fiche d'édition). */
  redirectTo?: string;
  /** Version compacte (icône seule) pour les listes mobiles. */
  compact?: boolean;
}

/** Bouton de suppression d'un produit, avec confirmation explicite. */
export function DeleteProductButton({
  productId,
  productName,
  redirectTo,
  compact = false,
}: DeleteProductButtonProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const remove = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/produits/${productId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Suppression impossible.");
        return;
      }
      setOpen(false);
      if (redirectTo) router.replace(redirectTo);
      router.refresh();
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={compact ? "icon" : "sm"}
          aria-label={`Supprimer ${productName}`}
          className="text-red-600 hover:border-red-200 hover:bg-red-50"
        >
          <Trash2 className={compact ? "h-4 w-4" : "h-4 w-4"} aria-hidden />
          {!compact && "Supprimer"}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <DialogTitle>Supprimer ce produit ?</DialogTitle>
            <DialogDescription>
              « {productName} » sera définitivement retiré du catalogue et de ses fiches. Cette
              action est irréversible.
            </DialogDescription>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button variant="ghost" disabled={loading}>
              Annuler
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={remove} disabled={loading}>
            <Trash2 className="h-4 w-4" aria-hidden />
            {loading ? "Suppression…" : "Supprimer définitivement"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
