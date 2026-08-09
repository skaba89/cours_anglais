import type { Metadata } from "next";
import Link from "next/link";
import { TrustLayout } from "../trust-layout";

export const metadata: Metadata = { title: "Assistance — Hello!" };

export default function SupportPage() {
  return <TrustLayout eyebrow="NOUS SOMMES LÀ" title="Centre d’assistance" intro="Retrouvez les réponses essentielles et les démarches disponibles pendant la bêta.">
    <section className="support-grid"><article><span>01</span><h2>Compte et connexion</h2><p>La connexion sécurisée utilise votre compte ChatGPT. Depuis votre espace personnel, vous pouvez vérifier la synchronisation ou vous déconnecter.</p><Link href="/account">Ouvrir mon compte →</Link></article><article><span>02</span><h2>Audio et microphone</h2><p>Autorisez le microphone dans votre navigateur, choisissez l’accent britannique ou américain puis relancez l’exercice. Les fonctions vocales varient selon l’appareil.</p></article><article><span>03</span><h2>Données personnelles</h2><p>Pour préparer une demande d’accès ou de suppression, exportez d’abord votre progression. Une adresse d’assistance officielle sera publiée avant l’ouverture commerciale.</p><Link href="/confidentialite">Voir mes droits →</Link></article></section>
  </TrustLayout>;
}
