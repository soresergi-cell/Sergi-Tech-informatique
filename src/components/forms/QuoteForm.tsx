"use client";

import * as React from "react";
import { FileText, CheckCircle2, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { quoteMessage, waLink } from "@/lib/whatsapp";
import { SITE } from "@/data/site";

interface FormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  quantity: string;
  budget: string;
  details: string;
}

const EMPTY: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  subject: "Équipement de bureau",
  quantity: "",
  budget: "",
  details: "",
};

/** Sujets de devis proposés. */
const SUBJECTS = [
  "Équipement de bureau",
  "Parc informatique (plusieurs postes)",
  "Matériel réseau / infrastructure",
  "Impression et fournitures",
  "Matériel pour école / institution",
  "Autre demande",
];

/**
 * Formulaire de demande de devis (EF-10 / US-07).
 * Sans backend : la demande est transmise via WhatsApp ou e-mail,
 * les deux liens étant préremplis avec l'ensemble des champs.
 */
export function QuoteForm() {
  const [form, setForm] = React.useState<FormState>(EMPTY);
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({});
  const [sent, setSent] = React.useState(false);

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  /** Validation côté client (champs obligatoires + e-mail). */
  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) next.name = "Veuillez indiquer votre nom.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "E-mail invalide.";
    if (form.phone.replace(/\D/g, "").length < 8) next.phone = "Numéro de téléphone invalide.";
    if (form.details.trim().length < 10)
      next.details = "Décrivez votre besoin (10 caractères min.).";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const message = quoteMessage({
    name: form.name,
    company: form.company,
    email: form.email,
    phone: form.phone,
    subject: `${form.subject}${form.quantity ? ` (quantité : ${form.quantity})` : ""}${
      form.budget ? ` – budget : ${form.budget}` : ""
    }`,
    details: form.details,
  });

  const mailtoHref = `mailto:${SITE.email}?subject=${encodeURIComponent(
    `Demande de devis – ${form.subject}`
  )}&body=${encodeURIComponent(message)}`;

  if (sent) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-12 text-center">
        <CheckCircle2 className="mb-4 h-12 w-12 text-emerald-600" aria-hidden />
        <h2 className="text-xl font-bold text-brand-navy">Demande prête à être envoyée</h2>
        <p className="mt-2 max-w-md text-sm text-slate-600">
          Merci <strong>{form.name}</strong> ! Choisissez le canal d’envoi : nous répondons
          sous <strong>24 h ouvrées</strong>.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" variant="whatsapp">
            <a href={waLink(message)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" aria-hidden />
              Envoyer sur WhatsApp
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={mailtoHref}>
              <Mail className="h-5 w-5" aria-hidden />
              Envoyer par e-mail
            </a>
          </Button>
        </div>
        <button
          onClick={() => {
            setSent(false);
            setForm(EMPTY);
          }}
          className="mt-5 text-sm font-medium text-primary hover:underline"
        >
          Modifier ma demande
        </button>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border bg-white p-5 sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-lg font-bold text-brand-navy">Formulaire de devis</h2>
          <p className="text-xs text-muted-foreground">
            Réponse sous 24 h ouvrées – champs marqués * obligatoires.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="q-name">Nom complet *</Label>
          <Input id="q-name" value={form.name} onChange={set("name")} className="mt-1.5" aria-invalid={!!errors.name} />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="q-company">Société / Institution</Label>
          <Input id="q-company" value={form.company} onChange={set("company")} className="mt-1.5" placeholder="Ex. : ONG, SARL, école…" />
        </div>

        <div>
          <Label htmlFor="q-email">E-mail *</Label>
          <Input id="q-email" type="email" value={form.email} onChange={set("email")} className="mt-1.5" aria-invalid={!!errors.email} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="q-phone">Téléphone / WhatsApp *</Label>
          <Input id="q-phone" type="tel" value={form.phone} onChange={set("phone")} className="mt-1.5" placeholder="Ex. : 70 00 00 00" aria-invalid={!!errors.phone} />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <Label htmlFor="q-subject">Objet de la demande</Label>
          <select
            id="q-subject"
            value={form.subject}
            onChange={set("subject")}
            className="mt-1.5 h-10 w-full rounded-lg border border-input bg-white px-3 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="q-quantity">Quantité estimée</Label>
          <Input id="q-quantity" type="number" min={1} value={form.quantity} onChange={set("quantity")} className="mt-1.5" placeholder="Ex. : 10" />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="q-budget">Budget indicatif (FCFA)</Label>
          <Input id="q-budget" value={form.budget} onChange={set("budget")} className="mt-1.5" placeholder="Ex. : 2 000 000 FCFA" />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="q-details">Détails de votre besoin *</Label>
          <Textarea
            id="q-details"
            value={form.details}
            onChange={set("details")}
            className="mt-1.5"
            placeholder="Décrivez le matériel souhaité, les délais, le lieu de livraison…"
            aria-invalid={!!errors.details}
          />
          {errors.details && <p className="mt-1 text-xs text-red-600">{errors.details}</p>}
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto">
        Envoyer ma demande de devis
      </Button>

      <p className="mt-3 text-xs text-muted-foreground">
        En envoyant ce formulaire, vous acceptez que vos coordonnées soient utilisées
        uniquement pour traiter votre demande (voir{" "}
        <a href="/confidentialite" className="text-primary hover:underline">
          politique de confidentialité
        </a>
        ).
      </p>
    </form>
  );
}
