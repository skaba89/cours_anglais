import type { Metadata } from "next";
import { TrustLayout } from "../trust-layout";

export const metadata: Metadata = { title: "Confidentialité — Hello!" };

export default function PrivacyPage() {
  return <TrustLayout eyebrow="VOS DONNÉES" title="Politique de confidentialité" intro="Hello! applique un principe simple : collecter le minimum nécessaire pour faire fonctionner votre apprentissage.">
    <section><h2>Données utilisées</h2><p>Lorsque vous vous connectez, nous pouvons traiter l’identifiant du compte, l’adresse e-mail, le nom affiché, votre niveau, vos préférences, vos résultats et votre progression. Les essais vocaux sont analysés par les fonctions de reconnaissance disponibles sur votre appareil ; la bêta ne conserve pas d’enregistrement audio sur nos serveurs.</p></section>
    <section><h2>Finalités et conservation</h2><p>Ces données servent à synchroniser le parcours, personnaliser les révisions, sécuriser le compte et répondre aux demandes d’assistance. Les données de progression sont conservées tant que le compte reste actif ou jusqu’à une demande de suppression.</p></section>
    <section><h2>Vos choix</h2><p>Vous pouvez exporter votre progression depuis l’application et demander l’accès, la rectification ou la suppression des données liées à votre compte depuis la page Assistance. Cette politique devra être complétée avec l’identité juridique et les coordonnées du responsable de traitement avant l’ouverture des paiements.</p></section>
  </TrustLayout>;
}
