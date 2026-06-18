import { notFound } from "next/navigation";
import { CalendarClock, Heart, Home, ShieldCheck, UserCircle } from "lucide-react";
import { BottomNav, LinkButton, ServiceHeader } from "@sportil/ui";
import { AdminVerificationDashboard } from "@/admin-verification-dashboard";
import { getLocaleConfig, isLocale, locales } from "@/i18n";

type AdminVerificationPageProps = {
  params: Promise<{ locale: string }>;
};

const titles = {
  en: "Admin verification",
  he: "ניהול אימות מידע",
  ru: "Проверка заявок",
} as const;

const subtitles = {
  en: "Resident requests, correction reports, and facility claims.",
  he: "פניות תושבים, דיווחי תיקון ובקשות ניהול מתקנים.",
  ru: "Обращения жителей, сообщения об ошибках и заявки на управление объектами.",
} as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function AdminVerificationPage({ params }: AdminVerificationPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const config = getLocaleConfig(locale);
  const t = config.dictionary;

  return (
    <main className="app-shell">
      <ServiceHeader eyebrow={t.eyebrow} title="SportIL" subtitle={t.subtitle} />
      <section className="content-frame secondary-page" aria-labelledby="admin-verification-page-title">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">{t.dataVerification.openQueue}</p>
            <h1 id="admin-verification-page-title">{titles[locale]}</h1>
            <p>{subtitles[locale]}</p>
          </div>
          <LinkButton href={`/${locale}/verification`} icon={<ShieldCheck aria-hidden="true" size={18} />} variant="secondary">
            {t.dataVerification.title}
          </LinkButton>
        </div>
        <AdminVerificationDashboard locale={locale} />
      </section>
      <BottomNav
        ariaLabel={t.bottomNavLabel}
        items={[
          { href: `/${locale}`, icon: <Home aria-hidden="true" size={20} />, label: t.nav.search },
          { href: `/${locale}/bookings`, icon: <CalendarClock aria-hidden="true" size={20} />, label: t.nav.bookings },
          { href: `/${locale}/saved`, icon: <Heart aria-hidden="true" size={20} />, label: t.nav.saved },
          { href: `/${locale}/profile`, icon: <UserCircle aria-hidden="true" size={20} />, label: t.nav.profile },
        ]}
      />
    </main>
  );
}
