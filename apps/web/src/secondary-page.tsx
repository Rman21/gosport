import { CalendarClock, Heart, Home, UserCircle } from "lucide-react";
import { BottomNav, Notice, ServiceHeader } from "@sportil/ui";
import type { Locale } from "@sportil/types";
import { BookingsDashboard } from "@/bookings-dashboard";
import { ProfileDashboard } from "@/profile-dashboard";
import { SavedDashboard } from "@/saved-dashboard";
import { getLocaleConfig } from "@/i18n";

type SecondaryPageKind = "bookings" | "saved" | "profile";

const titles: Record<SecondaryPageKind, Record<Locale, string>> = {
  bookings: {
    he: "ההזמנות שלי",
    ru: "Мои брони",
    en: "My bookings",
  },
  saved: {
    he: "שמורים",
    ru: "Сохранено",
    en: "Saved",
  },
  profile: {
    he: "אזור אישי",
    ru: "Профиль",
    en: "Profile",
  },
};

const descriptions: Record<SecondaryPageKind, Record<Locale, string>> = {
  bookings: {
    he: "כאן יוצגו ההזמנות והאישורים שלכם כאשר חשבון המשתמש יופעל.",
    ru: "Здесь будут ваши брони, удержанные места и номера подтверждений.",
    en: "Your bookings, held places, and confirmation numbers will appear here.",
  },
  saved: {
    he: "כאן יוצגו מתקנים וחוגים שמורים לאחר חיבור חשבון משתמש.",
    ru: "Здесь появятся сохраненные площадки и секции после подключения пользовательского аккаунта.",
    en: "Saved facilities and programs will appear here after user accounts are connected.",
  },
  profile: {
    he: "כאן תוכלו לנהל שפה, בני משפחה ופרטי קשר לאחר הפעלת חשבון אישי.",
    ru: "Здесь можно будет управлять языком, членами семьи и контактными данными.",
    en: "You will be able to manage language, family members, and contact details here.",
  },
};

export function SecondaryPage({ kind, locale }: { kind: SecondaryPageKind; locale: Locale }) {
  const config = getLocaleConfig(locale);
  const t = config.dictionary;

  return (
    <main className="app-shell">
      <ServiceHeader eyebrow={t.eyebrow} title="SportIL" subtitle={t.subtitle} />
      <section className="content-frame secondary-page" aria-labelledby={`${kind}-title`}>
        <p className="section-heading__eyebrow">{t.city}</p>
        <h1 id={`${kind}-title`}>{titles[kind][locale]}</h1>
        {kind === "bookings" ? (
          <BookingsDashboard locale={locale} />
        ) : kind === "saved" ? (
          <SavedDashboard locale={locale} />
        ) : kind === "profile" ? (
          <ProfileDashboard locale={locale} />
        ) : (
          <Notice title={titles[kind][locale]}>{descriptions[kind][locale]}</Notice>
        )}
      </section>
      <BottomNav
        ariaLabel={t.bottomNavLabel}
        items={[
          { href: `/${locale}`, icon: <Home aria-hidden="true" size={20} />, label: t.nav.search },
          { href: `/${locale}/bookings`, icon: <CalendarClock aria-hidden="true" size={20} />, label: t.nav.bookings, active: kind === "bookings" },
          { href: `/${locale}/saved`, icon: <Heart aria-hidden="true" size={20} />, label: t.nav.saved, active: kind === "saved" },
          { href: `/${locale}/profile`, icon: <UserCircle aria-hidden="true" size={20} />, label: t.nav.profile, active: kind === "profile" },
        ]}
      />
    </main>
  );
}
