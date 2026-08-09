import Link from "next/link";

export function TrustLayout({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <main className="trust-page">
      <header className="trust-header"><Link href="/" className="brand"><span className="brand-mark">H</span><span>Hello!</span></Link><Link href="/">← Retour</Link></header>
      <article className="trust-document">
        <p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="trust-intro">{intro}</p>
        <aside><strong>Version bêta fondatrice</strong><span>Dernière mise à jour : 9 août 2026</span></aside>
        {children}
      </article>
      <footer className="trust-footer"><Link href="/confidentialite">Confidentialité</Link><Link href="/conditions">Conditions</Link><Link href="/assistance">Assistance</Link></footer>
    </main>
  );
}
