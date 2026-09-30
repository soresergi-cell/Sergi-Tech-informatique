"use client";

import * as React from "react";
import { CheckCircle2, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { waLink } from "@/lib/whatsapp";
import { SITE } from "@/data/site";

interface ContactState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Formulaire de contact (EF – formulaire de contact).
 * Transmission via WhatsApp ou e-mail (aucun backend requis).
 */
export function ContactForm() {
  const [form, setForm] = React.useState<ContactState>({
    name: "",
    email: "",
    subject: "Question sur un produit",
    message: "",
  });
  const [errors, setErrors] = React.useState<Partial<Record<keyof ContactState, string>>>({});
  const [sent, setSent] = React.useState(false);

  const set =
    (key: keyof ContactState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next: Partial<Record<keyof ContactState, string>> = {};
    if (form.name.trim().length < 2) next.name = "Veuillez indiquer votre nom.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "E-mail invalide.";
    if (form.message.trim().length < 10) next.message = "Message trop court (10 caractères min.).";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setSent(true);
  };

  const text = `Bonjour ${SITE.name} !\n— Message depuis le site —\nNom : ${form.name}\nE-mail : ${form.email}\nObjet : ${form.subject}\n\n${form.message}`;
  const mailtoHref = `mailto:${SITE.email}?subject=${encodeURIComponent(
    `[Site] ${form.subject}`
  )}&body=${encodeURIComponent(text)}`;

  if (sent) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-10 text-center">
        <CheckCircle2 className="mb-3 h-10 w-10 text-emerald-600" aria-hidden />
        <h3 className="text-lg font-bold text-brand-navy">Message prêt à être envoyé</h3>
        <p className="mt-1 max-w-sm text-sm text-slate-600">
          Choisissez votre canal – nous vous répondrons au plus vite.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="whatsapp">
            <a href={waLink(text)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={mailtoHref}>
              <Mail className="h-4 w-4" aria-hidden /> E-mail
            </a>
          </Button>
        </div>
        <button
          onClick={() => setSent(false)}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Modifier mon message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="c-name">Nom complet *</Label>
          <Input id="c-name" value={form.name} onChange={set("name")} className="mt-1.5" />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="c-email">E-mail *</Label>
          <Input id="c-email" type="email" value={form.email} onChange={set("email")} className="mt-1.5" />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="c-subject">Objet</Label>
        <select
          id="c-subject"
          value={form.subject}
          onChange={set("subject")}
          className="mt-1.5 h-10 w-full rounded-lg border border-input bg-white px-3 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {[
            "Question sur un produit",
            "Suivi de commande",
            "SAV / Garantie",
            "Devis professionnel",
            "Autre",
          ].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="c-message">Message *</Label>
        <Textarea
          id="c-message"
          value={form.message}
          onChange={set("message")}
          className="mt-1.5"
          placeholder="Comment pouvons-nous vous aider ?"
        />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
      </div>

      <Button type="submit" className="w-full sm:w-auto">
        Envoyer le message
      </Button>
    </form>
  );
}
