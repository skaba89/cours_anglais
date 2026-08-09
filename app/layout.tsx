import type { Metadata } from "next";
import { headers } from "next/headers";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ variable: "--font-sans", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-display", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "hello-anglais-quotidien.kaba-sekouna.chatgpt.site";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  const title = "Hello! — L’anglais parlé pour les francophones";
  const description = "Une méthode C.L.A.I.R. en séances courtes pour écouter, parler et progresser en anglais avec les accents britannique et américain.";

  return {
    metadataBase,
    title,
    description,
    applicationName: "Hello!",
    category: "education",
    keywords: ["cours anglais", "anglais francophone", "prononciation anglaise", "anglais britannique", "anglais américain"],
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fr_FR",
      images: [{ url: "/og-v9.png", width: 1739, height: 909, alt: "Hello! — L’anglais parlé pour les francophones" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-v9.png"] },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body className={`${dmSans.variable} ${fraunces.variable}`}>{children}</body></html>;
}
