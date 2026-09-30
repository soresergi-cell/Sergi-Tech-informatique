"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SpecsEditorProps {
  specs: { label: string; value: string }[];
  onChange: (specs: { label: string; value: string }[]) => void;
}

/**
 * Éditeur des caractéristiques techniques (lignes libellé / valeur).
 * Ex. : « Mémoire vive » → « 16 Go DDR4 ».
 */
export function SpecsEditor({ specs, onChange }: SpecsEditorProps) {
  const update = (index: number, patch: Partial<{ label: string; value: string }>) =>
    onChange(specs.map((s, i) => (i === index ? { ...s, ...patch } : s)));

  const addRow = () => onChange([...specs, { label: "", value: "" }]);

  const removeRow = (index: number) => onChange(specs.filter((_, i) => i !== index));

  return (
    <div className="space-y-2.5">
      {specs.length === 0 && (
        <p className="rounded-lg bg-slate-50 p-3 text-sm text-muted-foreground">
          Aucune caractéristique. Ajoutez par exemple « Processeur », « Mémoire vive »,
          « Stockage »…
        </p>
      )}

      {specs.map((spec, index) => (
        <div key={index} className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={spec.label}
            onChange={(e) => update(index, { label: e.target.value })}
            placeholder="Caractéristique (ex. Mémoire vive)"
            aria-label={`Libellé de la caractéristique ${index + 1}`}
            className="sm:w-2/5"
          />
          <Input
            value={spec.value}
            onChange={(e) => update(index, { value: e.target.value })}
            placeholder="Valeur (ex. 16 Go DDR4)"
            aria-label={`Valeur de la caractéristique ${index + 1}`}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => removeRow(index)}
            aria-label={`Supprimer la caractéristique ${index + 1}`}
            className="shrink-0 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      ))}

      <Button type="button" variant="secondary" size="sm" onClick={addRow}>
        <Plus className="h-4 w-4" aria-hidden />
        Ajouter une caractéristique
      </Button>
    </div>
  );
}
