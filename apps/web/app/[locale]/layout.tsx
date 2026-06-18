import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { getLocaleConfig, isLocale, locales } from "@/i18n";
import { siteOrigin } from "@/site-config";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Pick<LocaleLayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  const config = isLocale(locale) ? getLocaleConfig(locale) : getLocaleConfig("he");

  return {
    title: config.metaTitle,
    description: config.metaDescription,
    applicationName: "SportIL",
    metadataBase: new URL(siteOrigin),
    alternates: {
      canonical: `/${config.locale}`,
      languages: {
        en: "/en",
        he: "/he",
        ru: "/ru",
        "x-default": "/he",
      },
    },
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "32x32" },
        { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: ["/favicon.ico"],
    },
    appleWebApp: {
      capable: true,
      title: "SportIL",
      statusBarStyle: "default",
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const config = getLocaleConfig(locale);

  return (
    <html lang={config.locale} dir={config.dir}>
      <body>
        {children}
      </body>
    </html>
  );
}
