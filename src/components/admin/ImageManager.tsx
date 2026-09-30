"use client";

import * as React from "react";
import { ProductImage } from "@/components/ui/ProductImage";
import { Upload, Trash2, Star, Loader2, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

/**
 * Gestion des photos d'un produit : téléversement (JPG/PNG/WebP/AVIF, 5 Mo max),
 * ajout par URL, choix de l'image principale et suppression.
 */
export function ImageManager({ images, onChange }: ImageManagerProps) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [url, setUrl] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  /** Envoi des fichiers au serveur (enregistrés dans public/products). */
  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    const form = new FormData();
    Array.from(files).forEach((f) => form.append("files", f));

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = (await res.json()) as { urls?: string[]; error?: string };
      if (!res.ok || !data.urls) {
        setError(data.error ?? "Téléversement impossible.");
        return;
      }
      onChange([...images, ...data.urls]);
    } catch {
      setError("Erreur réseau pendant le téléversement.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (index: number) => onChange(images.filter((_, i) => i !== index));

  /** Ajoute une image référencée par son URL. */
  const addUrl = () => {
    const value = url.trim();
    if (!value) return;
    onChange([...images, value]);
    setUrl("");
  };

  /** Place l'image en première position (image principale). */
  const setMain = (index: number) => {
    const next = [...images];
    const [picked] = next.splice(index, 1);
    onChange([picked, ...next]);
  };

  return (
    <div className="space-y-4">
      {images.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((src, index) => (
            <li key={`${src}-${index}`} className="overflow-hidden rounded-xl border bg-white">
              <div className="relative aspect-square bg-white">
                <ProductImage
                  src={src}
                  alt={`Photo ${index + 1} du produit`}
                  sizes="(max-width: 640px) 45vw, 180px"
                  className="object-contain p-1"
                />
                {index === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                    Principale
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 p-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMain(index)}
                  disabled={index === 0}
                  className="h-8 px-2 text-xs"
                >
                  <Star className="h-3.5 w-3.5" aria-hidden />
                  Principale
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  aria-label={`Supprimer la photo ${index + 1}`}
                  className="h-8 px-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="flex items-center gap-2 rounded-lg border border-dashed bg-slate-50 p-4 text-sm text-muted-foreground">
          <ImagePlus className="h-4 w-4" aria-hidden />
          Aucune photo. Ajoutez au moins une image (téléversement ou URL).
        </p>
      )}
      {/* Téléversement */}
      <div className="flex flex-col gap-3 rounded-xl border bg-slate-50 p-4 sm:flex-row sm:items-center">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={(e) => upload(e.target.files)}
          className="hidden"
          id="product-images"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Upload className="h-4 w-4" aria-hidden />
          )}
          {uploading ? "Envoi en cours…" : "Téléverser des photos"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Formats acceptés : JPG, PNG, WebP, AVIF – 5 Mo maximum par image. Recommandé :
          carré 1000 × 1000 px.
        </p>
      </div>

      {/* Ajout par URL */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Ou coller une URL d'image (ex. /products/mon-image.webp)"
          aria-label="URL de l'image"
          className="h-10 flex-1 rounded-lg border border-input bg-white px-3 text-sm text-brand-navy shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="button" variant="secondary" onClick={addUrl} disabled={!url.trim()}>
          Ajouter l’URL
        </Button>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
