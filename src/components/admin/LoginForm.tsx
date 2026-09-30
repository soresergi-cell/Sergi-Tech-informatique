"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, AlertCircle, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Logo } from "@/components/layout/Logo";

/** Formulaire de connexion à l'espace de gestion (cookie httpOnly). */
export function LoginForm({ next = "/admin" }: { next?: string }) {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [connected, setConnected] = React.useState(false);

  // Un administrateur déjà identifié n'a pas à ressaisir son mot de passe
  React.useEffect(() => {
    let active = true;
    fetch("/api/admin/session", { credentials: "same-origin" })
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as { authenticated?: boolean };
        if (active && data.authenticated) {
          setConnected(true);
          router.replace(next);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [next, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Connexion impossible.");
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion et réessayez.");
    } finally {
      setLoading(false);
    }
  };

  // Si la session existe déjà, une redirection client est en cours
  if (connected) {
    return (
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border bg-white p-8 text-center shadow-xl">
        <ShieldCheck className="mb-3 h-8 w-8 text-emerald-600" aria-hidden />
        <p className="font-semibold text-brand-navy">Session déjà active</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Redirection vers le tableau de bord…
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-xl sm:p-8"
    >
      <div className="mb-6 flex flex-col items-center text-center">
        <Logo />
        <h1 className="mt-5 flex items-center gap-2 text-xl font-extrabold text-brand-navy">
          <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />
          Espace de gestion
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Connectez-vous pour ajouter, modifier ou supprimer des produits.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="admin-password">Mot de passe administrateur</Label>
          <div className="relative mt-1.5">
            <Lock
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <Input
              id="admin-password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="pl-9 pr-10"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading || !password}>
          {loading ? "Connexion…" : "Se connecter"}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        Accès réservé à l’équipe SERGI-TECH. Le mot de passe se configure via la variable
        d’environnement <code className="rounded bg-slate-100 px-1">ADMIN_PASSWORD</code>.
      </p>
    </motion.div>
  );
}
