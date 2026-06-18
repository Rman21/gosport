import { CalendarClock, Heart, Home, UserCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { BottomNav, ServiceHeader } from "@sportil/ui";
import { BookingFlow } from "@/booking-flow";
import {
  facilities,
  getAlternativeSlots,
  getFacilityById,
  getFacilitySlotById,
  getPrimarySlot,
} from "@/demo-data";
import { getLocaleConfig, isLocale, locales } from "@/i18n";

type BookingPageProps = {
  params: Promise<{ facilityId: string; locale: string }>;
  searchParams?: Promise<{ slot?: string | string[] }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    facilities.map((facility) => ({
      facilityId: facility.id,
      locale,
    })),
  );
}

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const { facilityId, locale } = await params;
  const resolvedSearchParams = await searchParams;
  const slotId = Array.isArray(resolvedSearchParams?.slot)
    ? resolvedSearchParams?.slot[0]
    : resolvedSearchParams?.slot;

  if (!isLocale(locale)) {
    notFound();
  }

  const facility = getFacilityById(facilityId);

  if (!facility) {
    notFound();
  }

  const slot = slotId ? getFacilitySlotById(facilityId, slotId) : getPrimarySlot(facility);

  if (!slot) {
    notFound();
  }

  const alternatives = getAlternativeSlots(facility, slot.id, 3);
  const config = getLocaleConfig(locale);
  const t = config.dictionary;

  return (
    <main className="app-shell">
      <ServiceHeader eyebrow={t.eyebrow} title="SportIL" subtitle={t.subtitle} />

      <section className="content-frame booking-page" aria-label={t.bookingSummary}>
        <BookingFlow
          alternatives={alternatives}
          dictionary={t}
          facility={facility}
          locale={locale}
          slot={slot}
        />
      </section>

      <BottomNav
        ariaLabel={t.bottomNavLabel}
        items={[
          { href: `/${locale}`, icon: <Home aria-hidden="true" size={20} />, label: t.nav.search },
          { href: `/${locale}/bookings`, icon: <CalendarClock aria-hidden="true" size={20} />, label: t.nav.bookings, active: true },
          { href: `/${locale}/saved`, icon: <Heart aria-hidden="true" size={20} />, label: t.nav.saved },
          { href: `/${locale}/profile`, icon: <UserCircle aria-hidden="true" size={20} />, label: t.nav.profile },
        ]}
      />
    </main>
  );
}
