export type Locale = "he" | "ru" | "en";

export type Direction = "rtl" | "ltr";

export const userRoles = [
  "resident",
  "guardian",
  "coach",
  "school_operator",
  "facility_operator",
  "city_admin",
  "system",
] as const;

export type UserRole = (typeof userRoles)[number];

export type BookingMode = "info_only" | "mirror" | "request" | "payment";

export type FacilityStatus = "bookable" | "needsConfirmation" | "infoOnly";

export type StatusTone = "success" | "warning" | "info" | "neutral" | "danger";

export type LocalizedText = Record<Locale, string>;

export type AccessibilityStatus = "yes" | "no" | "unknown";

export type FacilityKind = "court" | "hall" | "sport_center" | "program" | "public_space";

export type InventoryKind = "coach_session" | "court_rental" | "group_class" | "open_play";

export type VerificationStatus =
  | "active_contact_only"
  | "archived_closed"
  | "info_only"
  | "live_bookable"
  | "live_registration"
  | "needs_verification";

export type BookingMethod =
  | "contact_request"
  | "external_registration"
  | "free_public"
  | "info_only"
  | "instant_payment"
  | "phone_whatsapp";

export type PaymentMethod = "card_supported" | "external_payment" | "no_payment" | "unknown";

export type SourceType =
  | "directory"
  | "external_registration"
  | "manual_research"
  | "official_municipal"
  | "partner_site"
  | "social"
  | "sports_association";

export type FacilityFeature =
  | "adapted"
  | "available_today"
  | "free_public"
  | "kids"
  | "online_booking"
  | "skate_roller"
  | "swimming";

export type SportCode =
  | "adapted_sport"
  | "aquathlon"
  | "athletics"
  | "basketball"
  | "badminton"
  | "bjj"
  | "boxing"
  | "calisthenics"
  | "capoeira"
  | "climbing"
  | "crossfit"
  | "dance"
  | "figure_skating"
  | "fitness"
  | "football"
  | "futsal"
  | "gymnastics"
  | "handball"
  | "hockey"
  | "hydrotherapy"
  | "hyrox"
  | "ice_skating"
  | "judo"
  | "karate"
  | "kickboxing"
  | "krav_maga"
  | "lawn_bowls"
  | "mma"
  | "padel"
  | "pilates"
  | "roller_skating"
  | "sambo"
  | "skateboarding"
  | "spinning"
  | "swimming"
  | "table_tennis"
  | "taekwondo"
  | "tennis"
  | "trx"
  | "volleyball"
  | "weightlifting"
  | "wrestling"
  | "yoga"
  | "zumba";

export type SlotConfidence = "official_info" | "operator_confirmed" | "live_inventory" | "manual_review";

export type SyncStatus = "fresh" | "stale" | "conflicting" | "blocked";

export type FacilityImage = {
  alt: LocalizedText;
  sourceUrl: string;
  src: string;
};

export type SourceInfo = {
  checkedAt: string;
  confidence: SlotConfidence;
  name: LocalizedText;
  url: string;
};

export type FacilityCoordinates = {
  lat: number;
  lng: number;
  precision: "approximate" | "verified";
};

export type FacilitySpace = {
  capacity?: number;
  description?: LocalizedText;
  id: string;
  indoor?: boolean;
  name: LocalizedText;
  sports: SportCode[];
  surface?: LocalizedText;
};

export type FacilityOffering = {
  bookingMethod?: BookingMethod;
  capacity?: number;
  coachId?: string;
  confidenceScore?: number;
  description?: LocalizedText;
  externalRegistrationUrl?: string;
  id: string;
  inventoryKind: InventoryKind;
  maxAge?: number;
  minAge?: number;
  paymentMethod?: PaymentMethod;
  priceNis?: number;
  programId?: string;
  sourceUrl: string;
  spaceId: string;
  sportCode: SportCode;
  title: LocalizedText;
  verificationStatus?: VerificationStatus;
};

export type CoachPreview = {
  bio: LocalizedText;
  id: string;
  languages: string[];
  maxAge?: number;
  minAge?: number;
  name: LocalizedText;
  sourceUrl: string;
  sportCodes: SportCode[];
};

export type ProgramPreview = {
  bookingMethod?: BookingMethod;
  coachId?: string;
  confidenceScore?: number;
  description: LocalizedText;
  externalRegistrationUrl?: string;
  id: string;
  maxAge?: number;
  minAge?: number;
  paymentMethod?: PaymentMethod;
  recurrence: LocalizedText;
  remaining?: number;
  spaceId: string;
  sportCode: SportCode;
  title: LocalizedText;
  verificationStatus?: VerificationStatus;
};

export type OpenMatchPreview = {
  capacity: number;
  confirmedPlayers: number;
  date: string;
  id: string;
  level: LocalizedText;
  maxAge?: number;
  minAge?: number;
  safetyMode: "templates_only";
  spaceId: string;
  sportCode: SportCode;
  time: string;
  title: LocalizedText;
};

export type FacilitySlot = {
  ageRange: LocalizedText;
  capacity: number;
  confidence: SlotConfidence;
  date: string;
  day: LocalizedText;
  durationMinutes: number;
  group: LocalizedText;
  id: string;
  instructor?: LocalizedText;
  inventoryKind: InventoryKind;
  level?: LocalizedText;
  maxAge?: number;
  minAge?: number;
  mode: BookingMode;
  offeringId?: string;
  participantNote: LocalizedText;
  priceNis?: number;
  remaining: number;
  school?: LocalizedText;
  sourceUrl: string;
  spaceId?: string;
  sportCode?: SportCode;
  syncStatus: SyncStatus;
  time: string;
  title: LocalizedText;
};

export type SportilDictionary = {
  actions: Record<BookingMode, string>;
  dataVerification: {
    checked: string;
    confidence: string;
    empty: string;
    filters: string;
    openQueue: string;
    priority: string;
    sourceNotes: string;
    subtitle: string;
    title: string;
  };
  averagePrice: string;
  accessibility: string;
  address: string;
  allSports: string;
  alternativeOptions: string;
  alternativeOptionsBody: string;
  ageRange: string;
  bottomNavLabel: string;
  capacity: string;
  capacityNotTracked: string;
  catalogChecked: string;
  city: string;
  coach: string;
  courtsLeft: string;
  dateFilter: string;
  discoveryEyebrow: string;
  discoveryTitle: string;
  facilitiesFound: string;
  freeEntry: string;
  generatedImageNotice: string;
  group: string;
  eyebrow: string;
  languageSwitcher: string;
  lastChecked: string;
  lighting: string;
  listView: string;
  mainDescription: string;
  mainTitle: string;
  mapView: string;
  metaDescription: string;
  metaTitle: string;
  nav: {
    bookings: string;
    profile: string;
    saved: string;
    search: string;
  };
  noResults: string;
  noticeBody: string;
  noticeTitle: string;
  parking: string;
  paymentLabels: Record<BookingMode, string>;
  bookingMethods: Record<BookingMethod, string>;
  bookingConfirmed: string;
  bookingReference: string;
  bookingSummary: string;
  cannotBookOnline: string;
  confirmMockPayment: string;
  holdExpires: string;
  holdSlot: string;
  mockCard: string;
  mockPaymentBody: string;
  mockPaymentTitle: string;
  paymentMethod: string;
  releaseHold: string;
  schedule: string;
  school: string;
  searchAction: string;
  searchLabel: string;
  searchPlaceholder: string;
  seatsLeft: string;
  source: string;
  confidenceScore: string;
  claimFacility: string;
  reportWrongInfo: string;
  requestOnlineBooking: string;
  sportFilterLabel: string;
  sourceTypes: Record<SourceType, string>;
  sourceConfidence: Record<SlotConfidence, string>;
  ageFilters: {
    adults: string;
    all: string;
    kids: string;
    teens: string;
  };
  filtersTitle: string;
  facilityTabs: {
    coaches: string;
    info: string;
    map: string;
    openGames: string;
    overview: string;
    schedule: string;
    sections: string;
  };
  findPartner: string;
  featureFilterLabel: string;
  featureFilters: Record<"adapted" | "all" | FacilityFeature, string>;
  intentFilters: Record<"all" | "coach_session" | "group_class" | "space_rental", string>;
  mapProviderNotice: string;
  noSlotsOnDate: string;
  onlineBookable: string;
  openInMaps: string;
  openMatchSafety: string;
  programWaitlist: string;
  quickActions: {
    child: string;
    coach: string;
    nearby: string;
    partner: string;
    section: string;
    today: string;
  };
  resetFilters: string;
  slotCalendarSubtitle: string;
  slotCalendarTitle: string;
  spaces: string;
  sportTags: string;
  statusStripLabel: string;
  statuses: Record<FacilityStatus, string>;
  publicAccess: string;
  sameSpaceConflict: string;
  verificationStatuses: Record<VerificationStatus, string>;
  subtitle: string;
  todayOptions: string;
  verifiedSlots: string;
  viewModeLabel: string;
};

export type LocaleConfig = {
  dir: Direction;
  dictionary: SportilDictionary;
  label: string;
  locale: Locale;
  metaDescription: string;
  metaTitle: string;
};

export type FacilityPreview = {
  accessibility: AccessibilityStatus;
  address: LocalizedText;
  audience: LocalizedText;
  bookingMethod?: BookingMethod;
  coaches?: CoachPreview[];
  confidenceScore?: number;
  coordinates?: FacilityCoordinates;
  id: string;
  externalRegistrationUrl?: string;
  features?: FacilityFeature[];
  images: FacilityImage[];
  kind: FacilityKind;
  lighting: boolean | "unknown";
  mode: BookingMode;
  name: LocalizedText;
  neighborhood: LocalizedText;
  parking: boolean | "unknown";
  primarySlotId?: string;
  offerings?: FacilityOffering[];
  openMatches?: OpenMatchPreview[];
  searchTerms: string[];
  slots: FacilitySlot[];
  source: SourceInfo;
  sourceNotes?: LocalizedText;
  sourceType?: SourceType;
  sport: LocalizedText;
  spaces?: FacilitySpace[];
  programs?: ProgramPreview[];
  sports: LocalizedText[];
  status: FacilityStatus;
  summary: LocalizedText;
  tone: StatusTone;
  verificationStatus?: VerificationStatus;
};
