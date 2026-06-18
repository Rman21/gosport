import {
  Accessibility,
  BadgeCheck,
  CalendarClock,
  Car,
  ExternalLink,
  Flag,
  Heart,
  Home,
  Lightbulb,
  MapPin,
  Navigation,
  School,
  ShieldCheck,
  UserCircle,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  BottomNav,
  LinkButton,
  Notice,
  ServiceHeader,
  StatusBadge,
  SummaryList,
} from "@sportil/ui";
import type { FacilitySlot, Locale, SportCode } from "@sportil/types";
import {
  facilities,
  formatDurationMinutes,
  formatSlotAvailability,
  formatSlotTime,
  getFacilityById,
  getFacilityGoogleMapsEmbedUrl,
  getFacilityGoogleMapsUrl,
  getFacilitySportTags,
  getPrimarySlot,
  getSlotConflicts,
  getVerificationTone,
  isSlotCapacityTracked,
  sportLabels,
} from "@/demo-data";
import { getLocaleConfig, isLocale, locales } from "@/i18n";
import { SaveFacilityButton } from "@/save-facility-button";

type FacilityPageProps = {
  params: Promise<{ facilityId: string; locale: string }>;
};

const booleanLabels: Record<Locale, Record<"no" | "unknown" | "yes", string>> = {
  en: { no: "No", unknown: "Not published", yes: "Yes" },
  he: { no: "לא", unknown: "לא פורסם", yes: "כן" },
  ru: { no: "Нет", unknown: "Не опубликовано", yes: "Да" },
};

function localeTag(locale: Locale) {
  return locale === "he" ? "he-IL" : locale === "ru" ? "ru-IL" : "en-IL";
}

function formatSlotDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(localeTag(locale), {
    day: "numeric",
    month: "short",
    weekday: "short",
  }).format(new Date(`${date}T12:00:00+03:00`));
}

function slotTimeRank(slotItem: FacilitySlot) {
  const match = slotItem.time.match(/(\d{1,2}):(\d{2})/);
  if (!match) {
    return 24 * 60;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

function sortSlots(slots: FacilitySlot[]) {
  return [...slots].sort(
    (left, right) =>
      left.date.localeCompare(right.date) ||
      slotTimeRank(left) - slotTimeRank(right) ||
      left.title.en.localeCompare(right.title.en),
  );
}

function getSlotHref(locale: Locale, facilityId: string, slotItem: FacilitySlot) {
  return slotItem.mode === "payment" ? `/${locale}/book/${facilityId}?slot=${slotItem.id}` : slotItem.sourceUrl;
}

function getSlotRel(slotItem: FacilitySlot) {
  return slotItem.mode === "payment" ? undefined : "noreferrer";
}

function getSlotTarget(slotItem: FacilitySlot) {
  return slotItem.mode === "payment" ? undefined : "_blank";
}

function featureValue(value: boolean | "unknown", locale: Locale) {
  if (value === "unknown") {
    return booleanLabels[locale].unknown;
  }

  return value ? booleanLabels[locale].yes : booleanLabels[locale].no;
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    facilities.map((facility) => ({
      facilityId: facility.id,
      locale,
    })),
  );
}

export default async function FacilityPage({ params }: FacilityPageProps) {
  const { facilityId, locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const facility = getFacilityById(facilityId);

  if (!facility) {
    notFound();
  }

  const config = getLocaleConfig(locale);
  const t = config.dictionary;
  const primarySlot = getPrimarySlot(facility);
  const image = facility.images[0];
  const isGeneratedImage = image?.src.startsWith("/images/sportil/generated/");
  const sportTags = getFacilitySportTags(facility, locale);
  const sortedFacilitySlots = sortSlots(facility.slots);
  const calendarDates = [...new Set(sortedFacilitySlots.map((slotItem) => slotItem.date))];
  const calendarSports = [
    ...new Set(sortedFacilitySlots.map((slotItem) => slotItem.sportCode).filter((code): code is SportCode => Boolean(code))),
  ];

  return (
    <main className="app-shell">
      <ServiceHeader eyebrow={t.eyebrow} title="SportIL" subtitle={t.subtitle} />

      <section className="content-frame facility-page" aria-labelledby="facility-title">
        <div className="facility-page__hero">
          <div className="facility-page__heading">
            <p className="section-heading__eyebrow">{sportTags.join(" · ")}</p>
            <h1 id="facility-title">{facility.name[locale]}</h1>
            <p>{facility.summary[locale]}</p>
            <div className="facility-page__badges">
              <StatusBadge tone={facility.tone}>{t.statuses[facility.status]}</StatusBadge>
              {facility.verificationStatus ? (
                <StatusBadge tone={getVerificationTone(facility)}>
                  {t.verificationStatuses[facility.verificationStatus]}
                </StatusBadge>
              ) : null}
              <StatusBadge tone="neutral">{t.sourceConfidence[facility.source.confidence]}</StatusBadge>
            </div>
            <div className="sport-chip-row" aria-label={t.sportTags}>
              {sportTags.map((sport) => (
                <span className="sport-chip" key={sport}>{sport}</span>
              ))}
            </div>
          </div>

          {image ? (
            <figure className="facility-page__media">
              <Image
                alt={image.alt[locale]}
                height={506}
                priority
                sizes="(max-width: 900px) 100vw, 52vw"
                src={image.src}
                width={900}
              />
              <figcaption>
                {isGeneratedImage ? (
                  t.generatedImageNotice
                ) : (
                  <>
                    {t.source}:{" "}
                    <a href={image.sourceUrl} rel="noreferrer" target="_blank">
                      {facility.source.name[locale]}
                    </a>
                  </>
                )}
              </figcaption>
            </figure>
          ) : null}
        </div>

        <Notice title={t.noticeTitle}>{t.noticeBody}</Notice>

        <div className="facility-action-strip" aria-label={t.dataVerification.title}>
          <SaveFacilityButton facilityId={facility.id} locale={locale} />
          <LinkButton
            href={`/${locale}/verification?facility=${facility.id}&action=report`}
            icon={<Flag aria-hidden="true" size={18} />}
            variant="secondary"
          >
            {t.reportWrongInfo}
          </LinkButton>
          <LinkButton
            href={`/${locale}/verification?facility=${facility.id}&action=claim`}
            icon={<UserCircle aria-hidden="true" size={18} />}
            variant="secondary"
          >
            {t.claimFacility}
          </LinkButton>
          <LinkButton
            href={`/${locale}/verification?facility=${facility.id}&action=online-booking`}
            icon={<CalendarClock aria-hidden="true" size={18} />}
            variant="secondary"
          >
            {t.requestOnlineBooking}
          </LinkButton>
        </div>

        <nav className="facility-tabs" aria-label={facility.name[locale]}>
          <a href="#overview">{t.facilityTabs.overview}</a>
          <a href="#map">{t.facilityTabs.map}</a>
          <a href="#schedule">{t.facilityTabs.schedule}</a>
          <a href="#coaches">{t.facilityTabs.coaches}</a>
          <a href="#sections">{t.facilityTabs.sections}</a>
          <a href="#open-games">{t.facilityTabs.openGames}</a>
          <a href="#info">{t.facilityTabs.info}</a>
        </nav>

        <section id="overview" className="facility-section" aria-labelledby="facility-overview-title">
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">{t.facilityTabs.overview}</p>
              <h2 id="facility-overview-title">{facility.name[locale]}</h2>
            </div>
          </div>

          <SummaryList
            items={[
              { label: t.address, value: facility.address[locale] },
              { label: t.ageRange, value: primarySlot.ageRange[locale] },
              {
                label: t.capacity,
                value: isSlotCapacityTracked(primarySlot)
                  ? formatSlotAvailability(primarySlot, locale)
                  : t.capacityNotTracked,
              },
              {
                label: t.dataVerification.confidence,
                value: t.sourceConfidence[facility.source.confidence],
              },
              {
                label: t.paymentMethod,
                value: facility.bookingMethod ? t.bookingMethods[facility.bookingMethod] : t.paymentLabels[facility.mode],
              },
              { label: t.lastChecked, value: facility.source.checkedAt },
            ]}
          />

          {facility.spaces?.length ? (
            <div className="space-grid" aria-label={t.spaces}>
              {facility.spaces.map((space) => (
                <article className="mini-card" key={space.id}>
                  <h3>{space.name[locale]}</h3>
                  <p>{space.description?.[locale]}</p>
                  <div className="sport-chip-row">
                    {space.sports.map((code) => (
                      <span className="sport-chip" key={code}>{sportLabels[code][locale]}</span>
                    ))}
                  </div>
                  <p className="mini-card__meta">
                    {space.capacity ? `${t.capacity}: ${space.capacity}` : t.capacity}
                    {space.surface ? ` · ${space.surface[locale]}` : ""}
                  </p>
                </article>
              ))}
            </div>
          ) : null}
        </section>

        <section id="map" className="facility-section" aria-labelledby="facility-map-title">
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">{t.facilityTabs.map}</p>
              <h2 id="facility-map-title">{facility.name[locale]}</h2>
              <p>{t.mapProviderNotice}</p>
            </div>
            <LinkButton
              href={getFacilityGoogleMapsUrl(facility, locale)}
              icon={<Navigation aria-hidden="true" size={18} />}
              rel="noreferrer"
              target="_blank"
              variant="secondary"
            >
              {t.openInMaps}
            </LinkButton>
          </div>

          <div className="google-map-panel">
            <iframe
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={getFacilityGoogleMapsEmbedUrl(facility, locale)}
              title={`${t.facilityTabs.map}: ${facility.name[locale]}`}
            />
          </div>
        </section>

        <div id="info" className="facility-page__details" aria-label={t.facilityTabs.info}>
          <p>
            <MapPin aria-hidden="true" size={18} />
            <span>{facility.neighborhood[locale]} · {facility.address[locale]}</span>
          </p>
          <p>
            <Accessibility aria-hidden="true" size={18} />
            <span>{t.accessibility}: {booleanLabels[locale][facility.accessibility]}</span>
          </p>
          <p>
            <Car aria-hidden="true" size={18} />
            <span>{t.parking}: {featureValue(facility.parking, locale)}</span>
          </p>
          <p>
            <Lightbulb aria-hidden="true" size={18} />
            <span>{t.lighting}: {featureValue(facility.lighting, locale)}</span>
          </p>
          <p>
            <UsersRound aria-hidden="true" size={18} />
            <span>{facility.audience[locale]}</span>
          </p>
          <p>
            <ExternalLink aria-hidden="true" size={18} />
            <a href={facility.source.url} rel="noreferrer" target="_blank">
              {t.source}: {facility.source.name[locale]}
            </a>
          </p>
          {facility.sourceType ? (
            <p>
              <ShieldCheck aria-hidden="true" size={18} />
              <span>{t.sourceTypes[facility.sourceType]}</span>
            </p>
          ) : null}
          {facility.sourceNotes ? (
            <p>
              <Flag aria-hidden="true" size={18} />
              <span>{t.dataVerification.sourceNotes}: {facility.sourceNotes[locale]}</span>
            </p>
          ) : null}
        </div>

        <section id="schedule" className="facility-page__schedule" aria-labelledby="facility-schedule-title">
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">{t.facilityTabs.schedule}</p>
              <h2 id="facility-schedule-title">{t.slotCalendarTitle}</h2>
              <p>{t.slotCalendarSubtitle}</p>
            </div>
          </div>

          <div className="slot-calendar" aria-label={t.slotCalendarTitle}>
            {calendarSports.map((sportCode) => (
              <section className="slot-calendar__sport" key={sportCode} aria-labelledby={`calendar-${facility.id}-${sportCode}`}>
                <div className="slot-calendar__sport-heading">
                  <h3 id={`calendar-${facility.id}-${sportCode}`}>{sportLabels[sportCode][locale]}</h3>
                  <span>{sortedFacilitySlots.filter((slotItem) => slotItem.sportCode === sportCode && slotItem.remaining > 0).length} {t.todayOptions}</span>
                </div>
                <div className="slot-calendar__days">
                  {calendarDates.map((date) => {
                    const daySlots = sortedFacilitySlots.filter((slotItem) => slotItem.date === date && slotItem.sportCode === sportCode);

                    return (
                      <div className="slot-calendar__day" key={`${sportCode}-${date}`}>
                        <h4>{formatSlotDate(date, locale)}</h4>
                        {daySlots.length > 0 ? (
                          <div className="slot-calendar__times">
                            {daySlots.map((slotItem) => (
                              <a
                                className="slot-calendar__time"
                                href={getSlotHref(locale, facility.id, slotItem)}
                                key={slotItem.id}
                                rel={getSlotRel(slotItem)}
                                target={getSlotTarget(slotItem)}
                              >
                                <span>{formatSlotTime(slotItem, locale)}</span>
                                <strong>{formatSlotAvailability(slotItem, locale)}</strong>
                                <small>{slotItem.title[locale]}</small>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="slot-calendar__empty">{t.noSlotsOnDate}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <div className="slot-grid">
            {sortedFacilitySlots.map((slotItem) => (
              <article className="slot-card" key={slotItem.id}>
                <div className="slot-card__top">
                  <div>
                    <p className="ui-result-card__meta">
                      {slotItem.sportCode ? `${sportLabels[slotItem.sportCode][locale]} · ` : ""}
                      {slotItem.day[locale]} · {formatSlotTime(slotItem, locale)}
                    </p>
                    <h3>{slotItem.title[locale]}</h3>
                  </div>
                  <StatusBadge tone={slotItem.mode === "payment" ? "success" : "neutral"}>
                    {t.sourceConfidence[slotItem.confidence]}
                  </StatusBadge>
                </div>

                <div className="slot-card__facts">
                  <span>
                    <UsersRound aria-hidden="true" size={17} />
                    {t.ageRange}: {slotItem.ageRange[locale]}
                  </span>
                  <span>
                    <CalendarClock aria-hidden="true" size={17} />
                    {formatDurationMinutes(slotItem.durationMinutes, locale)}
                  </span>
                  <span>
                    <BadgeCheck aria-hidden="true" size={17} />
                    {typeof slotItem.priceNis === "number" ? `₪${slotItem.priceNis}` : t.paymentLabels[slotItem.mode]}
                  </span>
                  <span>
                    <School aria-hidden="true" size={17} />
                    {slotItem.school?.[locale] ?? slotItem.group[locale]}
                  </span>
                </div>

                <p className="slot-card__note">{slotItem.participantNote[locale]}</p>

                {getSlotConflicts(facility, slotItem).length > 0 ? (
                  <Notice tone="warning" title={t.sameSpaceConflict}>
                    {t.alternativeOptionsBody}
                  </Notice>
                ) : null}

                {isSlotCapacityTracked(slotItem) ? (
                  <div
                    className="slot-card__capacity"
                    aria-label={formatSlotAvailability(slotItem, locale)}
                  >
                    <span>{formatSlotAvailability(slotItem, locale)}</span>
                    <meter min={0} max={slotItem.capacity} value={slotItem.remaining} />
                  </div>
                ) : (
                  <div className="slot-card__capacity slot-card__capacity--untracked">
                    <span>{t.publicAccess}</span>
                    <small>{t.capacityNotTracked}</small>
                  </div>
                )}

                {slotItem.mode === "payment" ? (
                  <LinkButton
                    href={`/${locale}/book/${facility.id}?slot=${slotItem.id}`}
                    icon={<CalendarClock aria-hidden="true" size={18} />}
                  >
                    {t.actions.payment}
                  </LinkButton>
                ) : (
                  <LinkButton
                    href={slotItem.sourceUrl}
                    icon={<ExternalLink aria-hidden="true" size={18} />}
                    rel="noreferrer"
                    target="_blank"
                    variant="secondary"
                  >
                    {t.actions[slotItem.mode]}
                  </LinkButton>
                )}
              </article>
            ))}
          </div>
        </section>

        <section id="coaches" className="facility-section" aria-labelledby="facility-coaches-title">
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">{t.facilityTabs.coaches}</p>
              <h2 id="facility-coaches-title">{t.coach}</h2>
            </div>
          </div>
          <div className="mini-card-grid">
            {(facility.coaches ?? []).map((coach) => (
              <article className="mini-card" key={coach.id}>
                <h3>{coach.name[locale]}</h3>
                <p>{coach.bio[locale]}</p>
                <p className="mini-card__meta">
                  {t.ageRange}: {coach.minAge ?? 0}-{coach.maxAge ?? 99} · {coach.languages.join(", ")}
                </p>
                <div className="sport-chip-row">
                  {coach.sportCodes.map((code) => (
                    <span className="sport-chip" key={code}>{sportLabels[code][locale]}</span>
                  ))}
                </div>
              </article>
            ))}
            {(facility.coaches ?? []).length === 0 ? (
              <Notice tone="info" title={t.facilityTabs.coaches}>{t.noResults}</Notice>
            ) : null}
          </div>
        </section>

        <section id="sections" className="facility-section" aria-labelledby="facility-sections-title">
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">{t.facilityTabs.sections}</p>
              <h2 id="facility-sections-title">{t.intentFilters.group_class}</h2>
            </div>
          </div>
          <div className="mini-card-grid">
            {(facility.programs ?? []).map((program) => (
              <article className="mini-card" key={program.id}>
                <p className="ui-result-card__meta">{sportLabels[program.sportCode][locale]}</p>
                <h3>{program.title[locale]}</h3>
                <p>{program.description[locale]}</p>
                <p className="mini-card__meta">
                  {program.recurrence[locale]} · {t.ageRange}: {program.minAge ?? 0}-{program.maxAge ?? 99}
                  {typeof program.remaining === "number" ? ` · ${program.remaining} ${t.seatsLeft}` : ""}
                </p>
                <LinkButton href={facility.source.url} variant="secondary" icon={<ExternalLink aria-hidden="true" size={18} />} rel="noreferrer" target="_blank">
                  {t.programWaitlist}
                </LinkButton>
              </article>
            ))}
            {(facility.programs ?? []).length === 0 ? (
              <Notice tone="info" title={t.facilityTabs.sections}>{t.noResults}</Notice>
            ) : null}
          </div>
        </section>

        <section id="open-games" className="facility-section" aria-labelledby="facility-open-games-title">
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">{t.findPartner}</p>
              <h2 id="facility-open-games-title">{t.facilityTabs.openGames}</h2>
              <p>{t.openMatchSafety}</p>
            </div>
          </div>
          <div className="mini-card-grid">
            {(facility.openMatches ?? []).map((match) => (
              <article className="mini-card" key={match.id}>
                <p className="ui-result-card__meta">
                  {sportLabels[match.sportCode][locale]} · {match.date} · {match.time}
                </p>
                <h3>{match.title[locale]}</h3>
                <p>{match.level[locale]}</p>
                <div className="slot-card__capacity">
                  <span>{match.capacity - match.confirmedPlayers} {t.seatsLeft}</span>
                  <meter min={0} max={match.capacity} value={match.capacity - match.confirmedPlayers} />
                </div>
                <LinkButton href={facility.source.url} variant="secondary" icon={<UsersRound aria-hidden="true" size={18} />} rel="noreferrer" target="_blank">
                  {t.findPartner}
                </LinkButton>
              </article>
            ))}
            {(facility.openMatches ?? []).length === 0 ? (
              <Notice tone="info" title={t.facilityTabs.openGames}>{t.noResults}</Notice>
            ) : null}
          </div>
        </section>

        <LinkButton href={`/${locale}`} variant="tertiary">
          {t.nav.search}
        </LinkButton>
      </section>

      <BottomNav
        ariaLabel={t.bottomNavLabel}
        items={[
          { href: `/${locale}`, icon: <Home aria-hidden="true" size={20} />, label: t.nav.search, active: true },
          { href: `/${locale}/bookings`, icon: <CalendarClock aria-hidden="true" size={20} />, label: t.nav.bookings },
          { href: `/${locale}/saved`, icon: <Heart aria-hidden="true" size={20} />, label: t.nav.saved },
          { href: `/${locale}/profile`, icon: <UserCircle aria-hidden="true" size={20} />, label: t.nav.profile },
        ]}
      />
    </main>
  );
}
