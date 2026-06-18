import { notFound } from "next/navigation";
import { SecondaryPage } from "@/secondary-page";
import { isLocale } from "@/i18n";

export default async function BookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <SecondaryPage kind="bookings" locale={locale} />;
}
