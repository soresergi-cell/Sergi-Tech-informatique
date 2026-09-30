"use client";

import * as React from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  /** Chemin de la photo : `/products/…`, URL absolue ou donnée vide. */
  src?: string | null;
  alt: string;
  /** Attribution responsive de `next/image` (obligatoire avec `fill`). */
  sizes: string;
  /** À réserver aux visuels visibles au premier écran. */
  priority?: boolean;
  /** Classes de la balise image. */
  className?: string;
  /** Classes du conteneur de repli (l'image doit être dans un parent `relative`). */
  wrapperClassName?: string;
  /** Message affiché quand la photo est absente ou illisible (vide = icône seule). */
  fallbackLabel?: string;
}

/**
 * Visuel produit tolérant aux pannes.
 *
 * Un `next/image` dont la source renvoie 404 laisse apparaître le texte
 * alternatif, ce qui casse la mise en page de la grille. Ce composant :
 *  - ignore les sources vides et bascule sur un habillage discret,
 *  - affiche le même habillage si le fichier devient introuvable,
 *  - fait apparaître la photo en fondu une fois décodée (sans jamais la
 *    masquer durablement : les images déjà en cache sont détectées à
 *    l'hydratation via `complete`).
 */
export function ProductImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
  wrapperClassName,
  fallbackLabel = "Photo indisponible",
}: ProductImageProps) {
  const url = typeof src === "string" ? src.trim() : "";
  // URL absolue (`https://…`) : aucune origine distante n'est déclarée dans
  // `next.config.ts`, et `next/image` lèverait une erreur de rendu. On bascule
  // sur une balise `img` nativa, qui affiche l'image sans l'optimiser.
  const isExternal = /^[a-z][a-z\d+.-]*:\/\//i.test(url);
  const [failed, setFailed] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const imageRef = React.useRef<HTMLImageElement>(null);

  // Nouvelle source : on repart d'un état vierge
  React.useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [url]);

  // Le navigateur a déjà décodé l'image : `onLoad` ne se déclenchera pas
  React.useEffect(() => {
    const node = imageRef.current;
    if (node?.complete && node.naturalWidth > 0) setLoaded(true);
  }, [url]);

  if (!url || failed) {
    return (
      <span
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-slate-100 via-white to-slate-100 px-1 text-center text-slate-400",
          wrapperClassName
        )}
      >
        <ImageOff className="h-5 w-5" aria-hidden />
        {fallbackLabel && (
          <span className="line-clamp-2 text-[10px] font-medium leading-tight">
            {fallbackLabel}
          </span>
        )}
      </span>
    );
  }

  return (
    <>
      {!loaded && (
        <span
          aria-hidden
          className="absolute inset-0 block animate-pulse bg-gradient-to-br from-slate-100 via-white to-slate-100"
        />
      )}
      {isExternal ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imageRef as React.RefObject<HTMLImageElement>}
          src={url}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "h-full w-full transition-opacity duration-500 ease-out",
            loaded ? "opacity-100" : "opacity-0",
            className
          )}
        />
      ) : (
        <Image
          ref={imageRef}
          src={url}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "transition-opacity duration-500 ease-out",
            loaded ? "opacity-100" : "opacity-0",
            className
          )}
        />
      )}
    </>
  );
}
