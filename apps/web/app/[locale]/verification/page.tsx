import {
  CalendarClock,
  ExternalLink,
  Flag,
  Home,
  ListChecks,
  UserCircle,
} from "lucide-react";
import { notFound } from "next/navigation";
import {
  BottomNav,
  LinkButton,
  Notice,
  ServiceHeader,
  StatusBadge,
} from "@sportil/ui";
import {
  dataVerificationTasks,
  facilities,
  getFacilityById,
  getVerificationTone,
} from "@/demo-data";
import { getLocaleConfig, isLocale, locales } from "@/i18n";
import { VerificationRequestForm } from "@/verification-request-form";

type VerificationPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{
    action?: string | string[];
    facility?: string | string[];
  }>;
};

const priorityTone = {
  critical: "danger",
  high: "warning",
  medium: "info",
} as const;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function VerificationPage({ params, searchParams }: VerificationPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const facilityId = firstParam(resolvedSearchParams?.facility);
  const action = firstParam(resolvedSearchParams?.action);
  const config = getLocaleConfig(locale);
  const t = config.dictionary;
  const selectedFacility = facilityId ? getFacilityById(facilityId) : undefined;
  const tasks = dataVerificationTasks.filter((task) => !facilityId || task.facilityId === facilityId);

  return (
    <main className="app-shell">
      <ServiceHeader eyebrow={t.eyebrow} title="SportIL" subtitle={t.subtitle} />

      <section className="content-frame verification-page" aria-labelledby="verification-title">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">{t.dataVerification.openQueue}</p>
            <h1 id="verification-title">{t.dataVerification.title}</h1>
            <p>{t.dataVerification.subtitle}</p>
          </div>
          <LinkButton href={`/${locale}`} variant="tertiary">
            {t.nav.search}
          </LinkButton>
          <LinkButton href={`/${locale}/admin/verification`} variant="secondary">
            {t.dataVerification.openQueue}
          </LinkButton>
        </div>

        {selectedFacility ? (
          <div className="verification-action-stack">
            <Notice
              tone={action === "report" ? "warning" : "info"}
              title={selectedFacility.name[locale]}
              icon={<Flag aria-hidden="true" size={20} />}
            >
              {action === "claim"
                ? t.claimFacility
                : action === "online-booking"
                  ? t.requestOnlineBooking
                  : action === "report"
                    ? t.reportWrongInfo
                    : selectedFacility.sourceNotes?.[locale] ?? t.dataVerification.subtitle}
            </Notice>
            <VerificationRequestForm action={action} facility={selectedFacility} locale={locale} />
          </div>
        ) : null}

        <div className="verification-summary-grid">
          {facilities
            .filter((facility) => !facilityId || facility.id === facilityId)
            .slice(0, facilityId ? 1 : 6)
            .map((facility) => (
              <article className="verification-summary" key={facility.id}>
                <div>
                  <p className="ui-result-card__meta">{facility.neighborhood[locale]}</p>
                  <h2>{facility.name[locale]}</h2>
                </div>
                <StatusBadge tone={getVerificationTone(facility)}>
                  {facility.verificationStatus
                    ? t.verificationStatuses[facility.verificationStatus]
                    : t.statuses[facility.status]}
                </StatusBadge>
                <dl>
                  <div>
                    <dt>{t.dataVerification.confidence}</dt>
                    <dd>{t.sourceConfidence[facility.source.confidence]}</dd>
                  </div>
                  <div>
                    <dt>{t.paymentMethod}</dt>
                    <dd>{facility.bookingMethod ? t.bookingMethods[facility.bookingMethod] : t.paymentLabels[facility.mode]}</dd>
                  </div>
                  <div>
                    <dt>{t.source}</dt>
                    <dd>{facility.sourceType ? t.sourceTypes[facility.sourceType] : facility.source.name[locale]}</dd>
                  </div>
                </dl>
                <LinkButton href={`/${locale}/facilities/${facility.id}`} variant="secondary">
                  {t.actions.info_only}
                </LinkButton>
              </article>
            ))}
        </div>

        <section className="verification-queue" aria-labelledby="verification-queue-title">
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">{t.dataVerification.filters}</p>
              <h2 id="verification-queue-title">{t.dataVerification.openQueue}</h2>
            </div>
          </div>

          {tasks.length > 0 ? (
            <div className="verification-task-list">
              {tasks.map((task) => {
                const facility = task.facilityId ? getFacilityById(task.facilityId) : undefined;
                const targetLabel = facility?.name[locale] ?? task.organizationLabel?.[locale] ?? "SportIL";

                return (
                  <article className="verification-task" key={task.id}>
                    <div className="verification-task__top">
                      <div>
                        <p className="ui-result-card__meta">{targetLabel}</p>
                        <h3>{task.title[locale]}</h3>
                      </div>
                      <StatusBadge tone={priorityTone[task.priority]}>
                        {t.dataVerification.priority}: {task.priority}
                      </StatusBadge>
                    </div>
                    <p>{task.notes[locale]}</p>
                    <div className="verification-task__actions">
                      {facility ? (
                        <LinkButton href={`/${locale}/facilities/${facility.id}`} variant="secondary">
                          {facility.name[locale]}
                        </LinkButton>
                      ) : null}
                      <LinkButton
                        href={task.sourceUrl}
                        icon={<ExternalLink aria-hidden="true" size={18} />}
                        rel="noreferrer"
                        target="_blank"
                        variant="secondary"
                      >
                        {t.source}
                      </LinkButton>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <Notice tone="info" title={t.dataVerification.openQueue}>
              {t.dataVerification.empty}
            </Notice>
          )}
        </section>
      </section>

      <BottomNav
        ariaLabel={t.bottomNavLabel}
        items={[
          { href: `/${locale}`, icon: <Home aria-hidden="true" size={20} />, label: t.nav.search },
          { href: `/${locale}/bookings`, icon: <CalendarClock aria-hidden="true" size={20} />, label: t.nav.bookings },
          { href: `/${locale}/saved`, icon: <ListChecks aria-hidden="true" size={20} />, label: t.nav.saved, active: true },
          { href: `/${locale}/profile`, icon: <UserCircle aria-hidden="true" size={20} />, label: t.nav.profile },
        ]}
      />
    </main>
  );
}
