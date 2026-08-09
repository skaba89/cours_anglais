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
  const title = "Hello! — La méthode C.L.A.I.R.";
  const description = "Une méthode contextuelle en cinq leviers pour faire parler les francophones : contextualiser, lier, activer, interagir et réviser.";

  return {
    metadataBase,
    title,
    description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fr_FR",
      images: [{ url: "/og-v9.png", width: 1739, height: 909, alt: "Hello! La méthode C.L.A.I.R. : contextualiser, lier, activer, interagir et réviser." }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-v9.png"] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body className={`${dmSans.variable} ${fraunces.variable}`}>{children}</body></html>;
}
