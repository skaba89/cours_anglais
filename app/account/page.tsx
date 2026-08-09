Exit code: 0
Wall time: 3.2 seconds
Output:
import Link from "next/link";
import { env } from "cloudflare:workers";
import { requireChatGPTUser, chatGPTSignOutPath } from "../chatgpt-auth";

export const dynamic = "force-dynamic";

type ProfileRow = { progress_json: string; selected_plan: string; billing_cycle: string; updated_at: number };
type Progress = { levelCode?: string; completed?: string[]; attempts?: unknown[]; episodeWins?: number[] };

function safeProgress(raw: string | undefined): Progress {
  try { return JSON.parse(raw ?? "{}") as Progress; } catch { return {}; }
}

export default async function AccountPage() {
  const user = await requireChatGPTUser("/account");
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS learner_profiles (user_id TEXT PRIMARY KEY, email TEXT NOT NULL, progress_json TEXT NOT NULL DEFAULT '{}', selected_plan TEXT NOT NULL DEFAULT 'free', billing_cycle TEXT NOT NULL DEFAULT 'yearly', updated_at INTEGER NOT NULL)").run();
  const createdAt = Date.now();
  await env.DB.prepare("INSERT INTO learner_profiles (user_id, email, progress_json, selected_plan, billing_cycle, updated_at) VALUES (?, ?, '{}', 'free', 'yearly', ?) ON CONFLICT(user_id) DO UPDATE SET email = excluded.email").bind(user.userId, user.email, createdAt).run();
  const profile = await env.DB.prepare("SELECT progress_json, selected_plan, billing_cycle, updated_at FROM learner_profiles WHERE user_id = ?").bind(user.userId).first<ProfileRow>();
  const progress = safeProgress(profile?.progress_json);
  const initials = user.displayName.split(/\s|@/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "H";
  const updated = profile?.updated_at ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(profile.updated_at)) : "Première connexion";

  return (
    <main className="account-page">
      <header className="account-header"><Link href="/" className="brand"><span className="brand-mark">H</span><span>Hello!</span></Link><Link className="account-back" href="/">← Retour aux cours</Link></header>
      <section className="account-hero">
        <div className="account-avatar">{initials}</div>
        <div><p className="eyebrow">COMPTE APPRENANT</p><h1>{user.fullName ? `Bonjour, ${user.fullName.split(" ")[0]}.` : "Votre espace personnel."}</h1><p>{user.email}</p></div>
        <span className="verified-account">✓ Compte vérifié</span>
      </section>
      <section className="account-grid">
        <article className="account-card membership"><p className="eyebrow">ACCÈS</p><span className="plan-badge">{profile?.selected_plan === "premium" ? "FONDATEUR" : "DÉCOUVERTE"}</span><h2>{profile?.selected_plan === "premium" ? "Accès prioritaire réservé" : "Votre accès gratuit"}</h2><p>{profile?.selected_plan === "premium" ? "Vous serez informé avant l’ouverture des paiements. Aucun débit n’a été effectué." : "Diagnostic, mission quotidienne et premier épisode inclus."}</p><Link href="/?offre=premium">Voir l’offre →</Link></article>
        <article className="account-card"><p className="eyebrow">PARCOURS</p><div className="account-level">{progress.levelCode ?? "A1"}</div><h2>Niveau actuel</h2><p>{progress.completed?.length ?? 0} expressions maîtrisées · {progress.attempts?.length ?? 0} essais vocaux · {progress.episodeWins?.length ?? 0} épisodes validés</p></article>
        <article className="account-card"><p className="eyebrow">SYNCHRONISATION</p><div className="sync-seal">✓</div><h2>Compte à jour</h2><p>Dernière sauvegarde : {updated}. Votre progression vous suit sur vos appareils connectés.</p></article>
        <article className="account-card privacy"><p className="eyebrow">CONFIDENTIALITÉ</p><h2>Des données limitées au nécessaire</h2><p>Hello! conserve l’identité du compte, la progression et les préférences utiles au service. Consultez vos droits avant de continuer.</p><div><Link href="/confidentialite">Politique de confidentialité</Link><Link href="/assistance">Demander une assistance</Link></div></article>
      </section>
      <section className="account-actions"><Link href="/">Continuer mon apprentissage</Link><a className="signout" href={chatGPTSignOutPath("/")}>Se déconnecter</a></section>
      <footer className="account-footer">Hello! · L’anglais qui fait parler les francophones.</footer>
    </main>
  );
}

