import {
  BadgeCheck,
  CalendarClock,
  Heart,
  Home,
  MapPinned,
  MapPin,
  Navigation,
  Search,
  ShieldCheck,
  Waves,
  UsersRound,
  UserCircle,
} from "lucide-react";
import {
  BottomNav,
  LinkButton,
  Notice,
  ResultCard,
  SegmentedControl,
  ServiceHeader,
  StatusBadge,
} from "@sportil/ui";
import type { FacilityPreview } from "@sportil/types";
import {
  getAvailabilityLines,
  getAvailableSportOptions,
  formatSlotAvailability,
  formatSlotTime,
  getFacilityGoogleMapsUrl,
  getFacilitySportTags,
  getMatchingSlots,
  getNearestSearchAlternatives,
  getPrimarySlot,
  getVerificationTone,
  normalizeSearchFilters,
  searchFacilities,
} from "@/demo-data";
import { getLocaleConfig, isLocale, locales } from "@/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{
    age?: string | string[];
    date?: string | string[];
    feature?: string | string[];
    intent?: string | string[];
    online?: string | string[];
    q?: string | string[];
    sport?: string | string[];
    view?: string | string[];
  }>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const intentFilterOrder = ["all", "space_rental", "group_class", "coach_session"] as const;

function buildHomeHref(locale: string, filters: ReturnType<typeof normalizeSearchFilters>, view: "list" | "map") {
  const params = new URLSearchParams();

  if (filters.query) params.set("q", filters.query);
  if (filters.sport !== "all") params.set("sport", filters.sport);
  if (filters.intent !== "all") params.set("intent", filters.intent);
  if (filters.age !== "all") params.set("age", filters.age);
  if (filters.date) params.set("date", filters.date);
  if (filters.onlineOnly) params.set("online", "1");
  if (view === "map") params.set("view", "map");

  const query = params.toString();
  return `/${locale}${query ? `?${query}` : ""}`;
}

function getMapMarkers(facilitiesForMap: FacilityPreview[]) {
  const located = facilitiesForMap.filter((facility) => facility.coordinates);
  const lats = located.map((facility) => facility.coordinates?.lat ?? 0);
  const lngs = located.map((facility) => facility.coordinates?.lng ?? 0);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latRange = Math.max(maxLat - minLat, 0.008);
  const lngRange = Math.max(maxLng - minLng, 0.008);

  return located.map((facility, index) => {
    const coordinates = facility.coordinates!;
    const x = 8 + ((coordinates.lng - minLng) / lngRange) * 84;
    const y = 10 + (1 - (coordinates.lat - minLat) / latRange) * 78;

    return { facility, index, x, y };
  });
}

export default async function HomePage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const config = getLocaleConfig(isLocale(locale) ? locale : "he");
  const t = config.dictionary;
  const rawAge = firstParam(resolvedSearchParams?.age);
  const rawDate = firstParam(resolvedSearchParams?.date);
  const rawFeature = firstParam(resolvedSearchParams?.feature);
  const rawIntent = firstParam(resolvedSearchParams?.intent);
  const rawOnline = firstParam(resolvedSearchParams?.online);
  const rawQuery = firstParam(resolvedSearchParams?.q);
  const rawSport = firstParam(resolvedSearchParams?.sport);
  const rawView = firstParam(resolvedSearchParams?.view);
  const requestedFilters = normalizeSearchFilters({
    ...(rawAge === undefined ? {} : { age: rawAge }),
    ...(rawDate === undefined ? {} : { date: rawDate }),
    ...(rawFeature === undefined ? {} : { feature: rawFeature }),
    ...(rawIntent === undefined ? {} : { intent: rawIntent }),
    ...(rawOnline === undefined ? {} : { online: rawOnline }),
    ...(rawQuery === undefined ? {} : { query: rawQuery }),
    ...(rawSport === undefined ? {} : { sport: rawSport }),
  });
  const sportOptions = getAvailableSportOptions(config.locale, requestedFilters);
  const availableSportValues = new Set(sportOptions.map((option) => option.value));
  const filters =
    requestedFilters.sport === "all" || availableSportValues.has(requestedFilters.sport)
      ? requestedFilters
      : { ...requestedFilters, sport: "all" as const };
  const visibleFacilities = searchFacilities(filters, config.locale);
  const nearestAlternatives =
    visibleFacilities.length === 0 ? getNearestSearchAlternatives(filters, config.locale) : [];
  const activeView = rawView === "map" ? "map" : "list";
  const mapMarkers = getMapMarkers(visibleFacilities);
  const today = "2026-06-18";
  const quickActions = [
    { href: `/${config.locale}?date=${today}&online=1`, icon: <CalendarClock aria-hidden="true" size={18} />, label: t.quickActions.today },
    { href: `/${config.locale}?age=kids&intent=group_class`, icon: <UsersRound aria-hidden="true" size={18} />, label: t.quickActions.child },
    { href: `/${config.locale}?intent=coach_session&online=1`, icon: <UserCircle aria-hidden="true" size={18} />, label: t.quickActions.coach },
    { href: `/${config.locale}?intent=group_class`, icon: <ShieldCheck aria-hidden="true" size={18} />, label: t.quickActions.section },
    { href: `/${config.locale}?sport=swimming`, icon: <Waves aria-hidden="true" size={18} />, label: sportOptions.find((option) => option.value === "swimming")?.label ?? t.featureFilters.swimming },
    { href: `/${config.locale}?intent=space_rental&q=${encodeURIComponent("partner")}`, icon: <Heart aria-hidden="true" size={18} />, label: t.quickActions.partner },
  ];

  return (
    <main className="app-shell">
      <ServiceHeader
        eyebrow={t.eyebrow}
        title="SportIL"
        subtitle={t.subtitle}
        utility={
          <nav className="language-switch" aria-label={t.languageSwitcher}>
            {locales.map((item) => (
              <a
                aria-current={item === config.locale ? "page" : undefined}
                href={`/${item}`}
                key={item}
              >
                {getLocaleConfig(item).label}
              </a>
            ))}
          </nav>
        }
      />

      <section className="service-band" aria-labelledby="search-title">
        <div className="content-frame service-band__inner">
          <div className="service-band__copy">
            <p className="service-band__kicker">{t.city}</p>
            <h1 id="search-title">{t.mainTitle}</h1>
            <p>{t.mainDescription}</p>
          </div>

          <form className="ui-search-box ui-search-box--advanced" role="search">
            <label htmlFor="sport-search">{t.searchLabel}</label>
            <div className="ui-search-box__row">
              <Search aria-hidden="true" size={20} />
              <input
                defaultValue={filters.query}
                id="sport-search"
                name="q"
                placeholder={t.searchPlaceholder}
                type="search"
              />
            </div>

            <fieldset className="filter-panel">
              <legend>{t.filtersTitle}</legend>
              <label>
                <span>{t.sportFilterLabel}</span>
                <select defaultValue={filters.sport} name="sport">
                  <option value="all">{t.allSports}</option>
                  {sportOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>{t.group}</span>
                <select defaultValue={filters.intent} name="intent">
                  {intentFilterOrder.map((value) => (
                    <option key={value} value={value}>
                      {t.intentFilters[value]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>{t.ageRange}</span>
                <select defaultValue={filters.age} name="age">
                  {Object.entries(t.ageFilters).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>{t.dateFilter}</span>
                <input defaultValue={filters.date} name="date" type="date" />
              </label>
              <label className="filter-panel__check">
                <input
                  defaultChecked={filters.onlineOnly}
                  name="online"
                  type="checkbox"
                  value="1"
                />
                <span>{t.onlineBookable}</span>
              </label>
            </fieldset>

            <div className="search-actions">
              <button className="ui-button ui-button--primary" type="submit">
                <Search aria-hidden="true" size={18} />
                <span>{t.searchAction}</span>
              </button>
              <a className="ui-button ui-button--tertiary" href={`/${config.locale}`}>
                <span>{t.resetFilters}</span>
              </a>
            </div>
          </form>
        </div>
      </section>

      <section className="content-frame status-strip" aria-label={t.statusStripLabel}>
        <Notice
          tone="info"
          title={t.noticeTitle}
          icon={<ShieldCheck aria-hidden="true" size={20} />}
        >
          {t.noticeBody}
        </Notice>

        <nav className="quick-actions" aria-label={t.filtersTitle}>
          {quickActions.map((action) => (
            <a href={action.href} key={action.label}>
              {action.icon}
              <span>{action.label}</span>
            </a>
          ))}
        </nav>
      </section>

      <section className="content-frame discovery" aria-labelledby="discovery-title">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">{t.discoveryEyebrow}</p>
            <h2 id="discovery-title">
              {t.discoveryTitle} · {visibleFacilities.length} {t.facilitiesFound}
            </h2>
          </div>
          <SegmentedControl
            ariaLabel={t.viewModeLabel}
            options={[
              { href: buildHomeHref(config.locale, filters, "list"), label: t.listView, selected: activeView === "list" },
              { href: buildHomeHref(config.locale, filters, "map"), label: t.mapView, selected: activeView === "map" },
            ]}
          />
        </div>

        {activeView === "map" ? (
          <div className="map-results" aria-label={t.mapView}>
            <div className="facility-map-panel">
              <div className="facility-map-panel__canvas" role="img" aria-label={`${t.mapView}: ${visibleFacilities.length} ${t.facilitiesFound}`}>
                <div className="facility-map-panel__axis" aria-hidden="true" />
                {mapMarkers.map(({ facility, index, x, y }) => (
                  <a
                    aria-label={`${index + 1}. ${facility.name[config.locale]}`}
                    className="facility-map-marker"
                    href={`#map-card-${facility.id}`}
                    key={facility.id}
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <MapPin aria-hidden="true" size={18} />
                    <span>{index + 1}</span>
                  </a>
                ))}
              </div>
              <p className="map-provider-note">{t.mapProviderNotice}</p>
            </div>

            <div className="map-result-list">
              {mapMarkers.map(({ facility, index }) => {
                const primarySlot = getMatchingSlots(facility, filters)[0] ?? getPrimarySlot(facility);
                const sportTags = getFacilitySportTags(facility, config.locale);

                return (
                  <article className="map-result-card" id={`map-card-${facility.id}`} key={facility.id}>
                    <p className="ui-result-card__meta">
                      {index + 1}. {sportTags.join(" · ")}
                    </p>
                    <h3>
                      <a href={`/${config.locale}/facilities/${facility.id}`}>{facility.name[config.locale]}</a>
                    </h3>
                    <p>{facility.neighborhood[config.locale]} · {facility.address[config.locale]}</p>
                    <div className="map-result-card__facts">
                      <span>{primarySlot.day[config.locale]} · {formatSlotTime(primarySlot, config.locale)}</span>
                      <strong>{formatSlotAvailability(primarySlot, config.locale)}</strong>
                    </div>
                    <div className="map-result-card__actions">
                      <LinkButton href={`/${config.locale}/facilities/${facility.id}`} icon={<MapPinned aria-hidden="true" size={18} />} variant="secondary">
                        {t.actions[facility.mode]}
                      </LinkButton>
                      <LinkButton href={getFacilityGoogleMapsUrl(facility, config.locale)} icon={<Navigation aria-hidden="true" size={18} />} rel="noreferrer" target="_blank" variant="tertiary">
                        {t.openInMaps}
                      </LinkButton>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
        <div className="result-grid">
          {visibleFacilities.map((facility) => {
            const primarySlot = getMatchingSlots(facility, filters)[0] ?? getPrimarySlot(facility);
            const image = facility.images[0];
            const sportTags = getFacilitySportTags(facility, config.locale);
            const availabilityLines = getAvailabilityLines(facility, filters, config.locale);

            return (
              <ResultCard
                action={
                  <LinkButton
                    href={`/${config.locale}/facilities/${facility.id}`}
                    icon={<CalendarClock aria-hidden="true" size={18} />}
                    variant={facility.mode === "payment" ? "primary" : "secondary"}
                  >
                    {t.actions[facility.mode]}
                  </LinkButton>
                }
                badge={
                  <StatusBadge tone={getVerificationTone(facility)}>
                    {facility.verificationStatus
                      ? t.verificationStatuses[facility.verificationStatus]
                      : t.statuses[facility.status]}
                  </StatusBadge>
                }
                details={[
                  {
                    icon: <MapPin aria-hidden="true" size={17} />,
                    text: facility.neighborhood[config.locale],
                  },
                  {
                    icon: <UsersRound aria-hidden="true" size={17} />,
                    text: `${t.ageRange}: ${primarySlot.ageRange[config.locale]}`,
                  },
                  {
                    icon: <BadgeCheck aria-hidden="true" size={17} />,
                    text: facility.bookingMethod
                      ? t.bookingMethods[facility.bookingMethod]
                      : t.paymentLabels[facility.mode],
                  },
                  {
                    icon: <ShieldCheck aria-hidden="true" size={17} />,
                    text: t.sourceConfidence[facility.source.confidence],
                  },
                ]}
                href={`/${config.locale}/facilities/${facility.id}`}
                image={image ? { alt: image.alt[config.locale], src: image.src } : undefined}
                key={facility.id}
                meta={sportTags.join(" · ")}
                stats={
                  <>
                    <span>{primarySlot.day[config.locale]}</span>
                    <span>{formatSlotTime(primarySlot, config.locale)}</span>
                    <strong>{formatSlotAvailability(primarySlot, config.locale)}</strong>
                  </>
                }
                title={facility.name[config.locale]}
              >
                <span>{facility.summary[config.locale]}</span>
                <span className="sport-chip-row" aria-label={t.sportTags}>
                  {sportTags.map((sport) => (
                    <span className="sport-chip" key={sport}>{sport}</span>
                  ))}
                </span>
                <span className="availability-lines">
                  {availabilityLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
              </ResultCard>
            );
          })}
        </div>
        )}

        {visibleFacilities.length === 0 ? (
          <div className="empty-results">
            <Notice tone="warning" title={t.searchAction}>
              {t.noResults}
            </Notice>

            {nearestAlternatives.length > 0 ? (
              <section className="alternative-section" aria-labelledby="search-alternatives-title">
                <div className="section-heading">
                  <div>
                    <p className="section-heading__eyebrow">{t.schedule}</p>
                    <h3 id="search-alternatives-title">{t.alternativeOptions}</h3>
                    <p>{t.alternativeOptionsBody}</p>
                  </div>
                </div>

                <div className="alternative-list">
                  {nearestAlternatives.map(({ facility, slot }) => (
                    <a
                      className="alternative-item"
                      href={`/${config.locale}/facilities/${facility.id}`}
                      key={`${facility.id}-${slot.id}`}
                    >
                      <span>
                        <strong>{facility.name[config.locale]}</strong>
                        <small>{slot.title[config.locale]}</small>
                      </span>
                      <span>
                        {slot.date} · {formatSlotTime(slot, config.locale)}
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        ) : null}
      </section>

      <BottomNav
        ariaLabel={t.bottomNavLabel}
        items={[
          { href: `/${config.locale}`, icon: <Home aria-hidden="true" size={20} />, label: t.nav.search, active: true },
          { href: `/${config.locale}/bookings`, icon: <CalendarClock aria-hidden="true" size={20} />, label: t.nav.bookings },
          { href: `/${config.locale}/saved`, icon: <Heart aria-hidden="true" size={20} />, label: t.nav.saved },
          { href: `/${config.locale}/profile`, icon: <UserCircle aria-hidden="true" size={20} />, label: t.nav.profile },
        ]}
      />
    </main>
  );
}
