import type { Metadata } from "next";
import { TrustLayout } from "../trust-layout";

export const metadata: Metadata = { title: "Conditions d’utilisation — Hello!" };

export default function TermsPage() {
  return <TrustLayout eyebrow="RÈGLES DU SERVICE" title="Conditions d’utilisation" intro="Ces conditions encadrent l’accès à la bêta fondatrice de Hello! avant l’ouverture d’une offre payante.">
    <section><h2>Accès à la bêta</h2><p>L’accès actuel permet de découvrir la méthode C.L.A.I.R., 24 expressions guidées, 6 épisodes courts et les outils de pratique disponibles. Les modules supplémentaires présentés dans le programme constituent la feuille de route éditoriale et sont ajoutés progressivement.</p></section>
    <section><h2>Aucun paiement actif</h2><p>La réservation d’un accès Fondateur manifeste un intérêt et ne déclenche aucun prélèvement. Le prix, la durée de l’essai, les règles de renouvellement, d’annulation et de remboursement seront confirmés explicitement avant tout achat.</p></section>
    <section><h2>Usage responsable</h2><p>Le contenu est destiné à un apprentissage personnel. Il ne doit pas être revendu, automatisé ou redistribué. Les scores fournis sont des aides pédagogiques et ne constituent pas une certification officielle du niveau CECRL.</p></section>
    <section><h2>Évolution du produit</h2><p>La bêta peut évoluer et certaines fonctions peuvent être indisponibles temporairement. L’identité juridique de l’éditeur, la juridiction applicable et les coordonnées contractuelles devront être ajoutées avant la commercialisation payante.</p></section>
  </TrustLayout>;
}
