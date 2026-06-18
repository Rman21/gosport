import { notFound } from "next/navigation";
import { SecondaryPage } from "@/secondary-page";
import { isLocale } from "@/i18n";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <SecondaryPage kind="profile" locale={locale} />;
}
