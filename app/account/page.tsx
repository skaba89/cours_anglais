import { env } from "cloudflare:workers";
import { requireChatGPTUser, chatGPTSignOutPath } from "../chatgpt-auth";

export const dynamic = "force-dynamic";

type ProfileRow = { progress_json: string; selected_plan: string; billing_cycle: string; updated_at: number };

export default async function AccountPage() {
  const user = await requireChatGPTUser("/account");
  const now = Date.now();
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS learner_profiles (user_id TEXT PRIMARY KEY, email TEXT NOT NULL, progress_json TEXT NOT NULL DEFAULT '{}', selected_plan TEXT NOT NULL DEFAULT 'free', billing_cycle TEXT NOT NULL DEFAULT 'yearly', updated_at INTEGER NOT NULL)").run();
  await env.DB.prepare("INSERT INTO learner_profiles (user_id, email, progress_json, selected_plan, billing_cycle, updated_at) VALUES (?, ?, '{}', 'free', 'yearly', ?) ON CONFLICT(user_id) DO UPDATE SET email = excluded.email").bind(user.userId, user.email, now).run();
  const profile = await env.DB.prepare("SELECT progress_json, selected_plan, billing_cycle, updated_at FROM learner_profiles WHERE user_id = ?").bind(user.userId).first<ProfileRow>();
  const progress = JSON.parse(profile?.progress_json ?? "{}") as { levelCode?: string; completed?: string[]; attempts?: unknown[]; episodeWins?: number[] };
  const initials = user.displayName.split(/\s|@/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "H";
  const updated = profile?.updated_at ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(profile.updated_at)) : "Première connexion";

  return (
    <main className="account-page">
      <header className="account-header"><a href="/" className="brand"><span className="brand-mark">H</span><span>Hello!</span></a><a className="account-back" href="/">← Retour aux cours</a></header>
      <section className="account-hero">
        <div className="account-avatar">{initials}</div>
        <div><p className="eyebrow">COMPTE APPRENANT</p><h1>{user.fullName ? `Bonjour, ${user.fullName.split(" ")[0]}.` : "Votre espace personnel."}</h1><p>{user.email}</p></div>
        <span className="verified-account">✓ Identité vérifiée</span>
      </section>
      <section className="account-grid">
        <article className="account-card membership"><p className="eyebrow">ABONNEMENT</p><span className="plan-badge">{profile?.selected_plan === "premium" ? "PREMIUM" : "DÉCOUVERTE"}</span><h2>{profile?.selected_plan === "premium" ? "Votre réservation Premium" : "Votre accès gratuit"}</h2><p>{profile?.selected_plan === "premium" ? `Formule ${profile.billing_cycle === "yearly" ? "annuelle" : "mensuelle"} réservée. Aucun débit tant que le paiement marchand n'est pas activé.` : "Diagnostic, mission quotidienne et premier épisode inclus."}</p><a href="/?offre=premium">Voir les offres →</a></article>
        <article className="account-card"><p className="eyebrow">PARCOURS</p><div className="account-level">{progress.levelCode ?? "A1"}</div><h2>Niveau actuel</h2><p>{progress.completed?.length ?? 0} phrases maîtrisées · {progress.attempts?.length ?? 0} essais vocaux · {progress.episodeWins?.length ?? 0} épisodes validés</p></article>
        <article className="account-card"><p className="eyebrow">SYNCHRONISATION</p><div className="sync-seal">✓</div><h2>Compte à jour</h2><p>Dernière sauvegarde : {updated}. Votre progression vous suit sur chaque appareil connecté au même compte.</p></article>
        <article className="account-card privacy"><p className="eyebrow">SÉCURITÉ</p><h2>Aucun mot de passe stocké</h2><p>L'identité est vérifiée par ChatGPT. Hello! conserve uniquement l'adresse du compte, la progression et les préférences nécessaires au service.</p><div><span>Export disponible</span><span>Accès protégé</span><span>Données minimales</span></div></article>
      </section>
      <section className="account-actions"><a href="/">Continuer mon apprentissage</a><a className="signout" href={chatGPTSignOutPath("/")}>Se déconnecter</a></section>
      <footer className="account-footer">Hello! · L'anglais qui fait parler les francophones.</footer>
    </main>
  );
}
