import type {
  FacilityCoordinates,
  FacilityFeature,
  FacilityPreview,
  FacilitySlot,
  Locale,
  LocalizedText,
  SportCode,
} from "@sportil/types";
import { netanyaCatalogFacilities } from "@/netanya-catalog";
import { sportLabels } from "@/sport-taxonomy";

export { sportLabels };

export type AgeFilter = "adults" | "all" | "kids" | "teens";
export type FeatureFilter = "all" | FacilityFeature;
export type IntentFilter = "all" | "coach_session" | "group_class" | "space_rental";
export type SportFilter = "all" | SportCode;

export type FacilitySearchFilters = {
  age?: AgeFilter | string;
  date?: string;
  feature?: FeatureFilter | string;
  intent?: IntentFilter | string;
  online?: string;
  query?: string;
  sport?: SportFilter | string;
};

export type NormalizedFacilitySearchFilters = {
  age: AgeFilter;
  date: string;
  feature: FeatureFilter;
  intent: IntentFilter;
  onlineOnly: boolean;
  query: string;
  sport: SportFilter;
};

const checkedAt = "2026-06-18";

function text(he: string, ru: string, en: string): LocalizedText {
  return { en, he, ru };
}

const netanyaMunicipality = text("עיריית נתניה", "Муниципалитет Нетании", "Netanya Municipality");

const images = {
  adaptedSport: "/images/sportil/generated/adapted-sport-hall.jpg",
  basketballFutsal: "/images/sportil/generated/basketball-futsal-court.jpg",
  communityMultisport: "/images/sportil/generated/community-multisport.jpg",
  footballField: "/images/sportil/generated/football-field.jpg",
  functionalFitness: "/images/sportil/generated/functional-fitness.jpg",
  martialArts: "/images/sportil/generated/martial-arts-hall.jpg",
  padel: "/images/sportil/generated/padel-courts.jpg",
  skateRoller: "/images/sportil/generated/skate-roller-park.jpg",
  swimming: "/images/sportil/generated/swimming-pool.jpg",
  tennis: "/images/sportil/generated/tennis-courts.jpg",
};

const sourceUrls = {
  bialik: "https://www.netanya.muni.il/City/SportsAndSociety/Centers/Pages/Bialik.aspx",
  collegym: "https://collegym.co.il/",
  crossfitGreenBeach: "https://www.crossfitgreenbeach.com/en",
  countryPoleg: "https://www.poleg.org.il/",
  galiYam: "https://www.netanya.muni.il/City/SportsAndSociety/Centers/Pages/galyyam.aspx",
  girlsBasketball:
    "https://www.netanya.muni.il/City/SportsAndSociety/Classes/Pages/ID/GirlsBaketball20.aspx",
  netanyaMunicipality: "https://www.netanya.muni.il/",
  olimp: "https://www.olimp-swim.com/",
  ovadia:
    "https://www.netanya.muni.il/City/SportsAndSociety/facilities/Pages/id/Ovadiahtennis.aspx",
  regaim: "https://www.netanya.muni.il/en/Pages/Regaim.aspx",
  specialNeeds:
    "https://www.netanya.muni.il/City/SportsAndSociety/PWD/Pages/SpecialNeeds.aspx",
  sportekCourt:
    "https://www.netanya.muni.il/City/SportsAndSociety/facilities/Pages/id/sportekiryamimcourt.aspx",
  stakelis: "https://www.netanya.muni.il/City/SportsAndSociety/Centers/Pages/stakelis.aspx",
  tennisClass: "https://www.netanya.muni.il/City/SportsAndSociety/Classes/Pages/ID/Tennis1.aspx",
  topPadel: "https://toppadel.co.il/",
  yeshurun: "https://www.netanya.muni.il/City/SportsAndSociety/Centers/Pages/Yeshurun.aspx",
  yeshurunHall:
    "https://www.netanya.muni.il/City/SportsAndSociety/facilities/Pages/id/Yeshurunvenue.aspx",
};

const facilityCoordinates = {
  adaptedSportTamarAriel: { lat: 32.3046, lng: 34.8629, precision: "approximate" },
  bialikJudo: { lat: 32.3317, lng: 34.8577, precision: "approximate" },
  collegymNetanya: { lat: 32.3082, lng: 34.8798, precision: "approximate" },
  countryClubPoleg: { lat: 32.2768, lng: 34.8438, precision: "approximate" },
  crossfitGreenBeach: { lat: 32.2784, lng: 34.8427, precision: "approximate" },
  galiYamTennis: { lat: 32.2843, lng: 34.8467, precision: "approximate" },
  maccabiNetanyaFootballSchool: { lat: 32.294, lng: 34.8647, precision: "approximate" },
  olimpSwimmingNetanya: { lat: 32.3046, lng: 34.8664, precision: "approximate" },
  ovadiaTennisCourts: { lat: 32.3293, lng: 34.8611, precision: "approximate" },
  sportekIrYamimCourt: { lat: 32.2848, lng: 34.8472, precision: "approximate" },
  sportekYahalom: { lat: 32.3088, lng: 34.878, precision: "approximate" },
  stakelisSportsCenter: { lat: 32.3375, lng: 34.8674, precision: "approximate" },
  topPadelIrYamim: { lat: 32.2838, lng: 34.8464, precision: "approximate" },
  topPadelPoleg: { lat: 32.2784, lng: 34.8427, precision: "approximate" },
  winterLakeSportsPark: { lat: 32.295, lng: 34.851, precision: "approximate" },
  yeshurunBasketball: { lat: 32.3308, lng: 34.8589, precision: "approximate" },
} satisfies Record<string, FacilityCoordinates>;

function slot(overrides: FacilitySlot): FacilitySlot {
  return overrides;
}

const curatedFacilities: FacilityPreview[] = [
  {
    accessibility: "yes",
    address: text("בני בנימין 1", "Бней Биньямин 1", "Bnei Binyamin 1"),
    audience: text(
      "ילדים, נוער, מבוגרים ומתחילים",
      "Дети, подростки, взрослые и начинающие",
      "Children, youth, adults, and beginners",
    ),
    id: "gali-yam-tennis",
    bookingMethod: "instant_payment",
    confidenceScore: 82,
    coordinates: facilityCoordinates.galiYamTennis,
    features: ["available_today", "kids", "online_booking"],
    sourceNotes: text(
      "חלון ההזמנה נבדק עבור הזמן שנבחר; חלונות נוספים צריכים אישור מהמרכז.",
      "Онлайн-бронь проверена для выбранного времени; остальные окна нужно подтвердить у центра.",
      "Online booking is verified for the selected time; other windows need center confirmation.",
    ),
    sourceType: "official_municipal",
    verificationStatus: "live_bookable",
    images: [
      {
        alt: text("מגרשי טניס גלי ים", "Теннисные корты Гали-Ям", "Gali Yam tennis courts"),
        sourceUrl: sourceUrls.galiYam,
        src: images.tennis,
      },
      {
        alt: text("חוג טניס עירוני", "Городская секция тенниса", "Municipal tennis class"),
        sourceUrl: sourceUrls.tennisClass,
        src: images.tennis,
      },
    ],
    kind: "sport_center",
    lighting: true,
    mode: "payment",
    name: text("מרכז הטניס גלי ים", "Теннисный центр Гали-Ям", "Gali Yam Tennis Center"),
    neighborhood: text("עיר ימים / גלי ים", "Ир-Ямим / Гали-Ям", "Ir Yamim / Gali Yam"),
    parking: false,
    primarySlotId: "gali-yam-demo-adult-court",
    searchTerms: [
      "tennis",
      "теннис",
      "טניס",
      "gali yam",
      "yael beckman",
      "adult tennis",
      "children tennis",
      "площадка теннис",
    ],
    spaces: [
      {
        capacity: 4,
        description: text("מגרש חיצוני עם תאורה", "Открытый корт с освещением", "Outdoor lit court"),
        id: "gali-yam-court-01-space",
        indoor: false,
        name: text("מגרש 1", "Корт 1", "Court 1"),
        sports: ["tennis"],
        surface: text("משטח קשיח", "Хард", "Hard court"),
      },
      {
        capacity: 12,
        description: text("אזור אימון לילדים", "Зона занятий для детей", "Children training area"),
        id: "gali-yam-training-courts",
        indoor: false,
        name: text("אזור אימון", "Тренировочная зона", "Training area"),
        sports: ["tennis"],
        surface: text("משטח קשיח", "Хард", "Hard court"),
      },
    ],
    coaches: [
      {
        bio: text("מאמנת טניס עירונית לילדים, מתחילים ואימונים פרטיים.", "Городской тренер по теннису для детей, начинающих и индивидуальных занятий.", "Municipal tennis coach for children, beginners, and private sessions."),
        id: "coach-yael-beckman",
        languages: ["עברית", "Русский", "English"],
        maxAge: 99,
        minAge: 7,
        name: text("יעל בקמן", "Яэль Бекман", "Yael Beckman"),
        sourceUrl: sourceUrls.tennisClass,
        sportCodes: ["tennis"],
      },
    ],
    programs: [
      {
        coachId: "coach-yael-beckman",
        description: text("קבוצה קטנה לילדים שמתחילים טניס.", "Небольшая группа для детей, начинающих теннис.", "Small group for children starting tennis."),
        id: "program-gali-yam-kids-tennis",
        maxAge: 12,
        minAge: 7,
        recurrence: text("שלישי וחמישי", "Вторник и четверг", "Tuesday and Thursday"),
        remaining: 4,
        spaceId: "gali-yam-training-courts",
        sportCode: "tennis",
        title: text("חוג טניס מתחילים", "Секция тенниса для начинающих", "Beginner tennis class"),
      },
    ],
    openMatches: [
      {
        capacity: 4,
        confirmedPlayers: 2,
        date: "2026-06-19",
        id: "open-match-gali-yam-tennis-1930",
        level: text("מתחילים+", "Начальный+", "Beginner+"),
        maxAge: 99,
        minAge: 18,
        safetyMode: "templates_only",
        spaceId: "gali-yam-court-01-space",
        sportCode: "tennis",
        time: "19:30",
        title: text("מחפשים זוג לטניס", "Ищем пару для тенниса", "Looking for tennis partners"),
      },
    ],
    slots: [
      slot({
        ageRange: text("18+", "18+", "18+"),
        capacity: 1,
        confidence: "manual_review",
        date: "2026-06-18",
        day: text("היום", "Сегодня", "Today"),
        durationMinutes: 60,
        group: text("מגרש פתוח", "Открытый корт", "Open court"),
        id: "gali-yam-demo-adult-court",
        instructor: text("ללא מאמן", "Без тренера", "No coach"),
        inventoryKind: "court_rental",
        maxAge: 99,
        minAge: 18,
        mode: "payment",
        participantNote: text(
          "ההשכרה שומרת מגרש אחד; מספר המשתתפים הוא לתכנון בלבד.",
          "Бронь закрепляет за вами один корт; число участников нужно только для планирования.",
          "Rental holds one court; participant count is planning context only.",
        ),
        priceNis: 45,
        remaining: 1,
        offeringId: "gali-yam-court-rental",
        sourceUrl: sourceUrls.galiYam,
        spaceId: "gali-yam-court-01-space",
        sportCode: "tennis",
        syncStatus: "fresh",
        time: "18:30",
        title: text("מגרש טניס 60 דקות", "Теннисный корт на 60 минут", "60-minute tennis court"),
      }),
      slot({
        ageRange: text("12+", "12+", "12+"),
        capacity: 1,
        confidence: "manual_review",
        date: "2026-06-18",
        day: text("היום", "Сегодня", "Today"),
        durationMinutes: 60,
        group: text("אימון פרטי", "Индивидуально", "Private coaching"),
        id: "gali-yam-private-coach-overlap",
        instructor: text("יעל בקמן", "Яэль Бекман", "Yael Beckman"),
        inventoryKind: "coach_session",
        maxAge: 99,
        minAge: 12,
        mode: "request",
        participantNote: text(
          "האימון תופס את אותו מגרש פיזי כמו השכרת המגרש.",
          "Тренировка занимает тот же физический корт, что и аренда.",
          "The session holds the same physical court as court rental.",
        ),
        priceNis: 90,
        remaining: 1,
        offeringId: "gali-yam-private-coach",
        sourceUrl: sourceUrls.tennisClass,
        spaceId: "gali-yam-court-01-space",
        sportCode: "tennis",
        syncStatus: "conflicting",
        time: "18:30",
        title: text("אימון טניס פרטי", "Индивидуальная тренировка по теннису", "Private tennis coaching"),
      }),
      slot({
        ageRange: text("18+", "18+", "18+"),
        capacity: 1,
        confidence: "live_inventory",
        date: "2026-06-18",
        day: text("היום", "Сегодня", "Today"),
        durationMinutes: 60,
        group: text("מגרש פתוח", "Открытый корт", "Open court"),
        id: "gali-yam-demo-adult-court-1930",
        instructor: text("ללא מאמן", "Без тренера", "No coach"),
        inventoryKind: "court_rental",
        maxAge: 99,
        minAge: 18,
        mode: "payment",
        participantNote: text(
          "אותו מגרש, שעה אחת מאוחר יותר.",
          "Тот же корт, на час позже.",
          "Same court, one hour later.",
        ),
        priceNis: 45,
        remaining: 1,
        offeringId: "gali-yam-court-rental",
        sourceUrl: sourceUrls.galiYam,
        spaceId: "gali-yam-court-01-space",
        sportCode: "tennis",
        syncStatus: "fresh",
        time: "19:30",
        title: text("מגרש טניס 60 דקות", "Теннисный корт на 60 минут", "60-minute tennis court"),
      }),
      slot({
        ageRange: text("18+", "18+", "18+"),
        capacity: 1,
        confidence: "live_inventory",
        date: "2026-06-19",
        day: text("מחר", "Завтра", "Tomorrow"),
        durationMinutes: 60,
        group: text("מגרש פתוח", "Открытый корт", "Open court"),
        id: "gali-yam-demo-adult-court-next-day",
        instructor: text("ללא מאמן", "Без тренера", "No coach"),
        inventoryKind: "court_rental",
        maxAge: 99,
        minAge: 18,
        mode: "payment",
        participantNote: text(
          "אותו מגרש ביום הקרוב הבא.",
          "Тот же корт в ближайший следующий день.",
          "Same court on the next available day.",
        ),
        priceNis: 45,
        remaining: 1,
        offeringId: "gali-yam-court-rental",
        sourceUrl: sourceUrls.galiYam,
        spaceId: "gali-yam-court-01-space",
        sportCode: "tennis",
        syncStatus: "fresh",
        time: "18:30",
        title: text("מגרש טניס 60 דקות", "Теннисный корт на 60 минут", "60-minute tennis court"),
      }),
      slot({
        ageRange: text("7-12, לאמת מול המרכז", "7-12, уточнить у центра", "7-12, confirm with center"),
        capacity: 12,
        confidence: "operator_confirmed",
        date: "2026-06-23",
        day: text("פעמיים בשבוע", "Два раза в неделю", "Twice per week"),
        durationMinutes: 45,
        group: text("מתחילים", "Начинающие", "Beginners"),
        id: "gali-yam-beginner-kids",
        instructor: text("יעל בקמן", "Яэль Бекман", "Yael Beckman"),
        inventoryKind: "group_class",
        maxAge: 12,
        minAge: 7,
        mode: "request",
        participantNote: text(
          "הרשמה תופסת מקום ילד/ה בקבוצה.",
          "Место резервируется для одного ребенка в группе.",
          "Enrollment claims one child seat in the group.",
        ),
        priceNis: 220,
        remaining: 4,
        offeringId: "gali-yam-kids-tennis",
        sourceUrl: sourceUrls.tennisClass,
        spaceId: "gali-yam-training-courts",
        sportCode: "tennis",
        syncStatus: "fresh",
        time: "17:00",
        title: text("חוג טניס מתחילים", "Секция тенниса для начинающих", "Beginner tennis class"),
      }),
      slot({
        ageRange: text("7-12, לאמת מול המרכז", "7-12, уточнить у центра", "7-12, confirm with center"),
        capacity: 12,
        confidence: "operator_confirmed",
        date: "2026-06-25",
        day: text("חמישי", "Четверг", "Thursday"),
        durationMinutes: 45,
        group: text("מתחילים", "Начинающие", "Beginners"),
        id: "gali-yam-beginner-kids-thu",
        instructor: text("יעל בקמן", "Яэль Бекман", "Yael Beckman"),
        inventoryKind: "group_class",
        maxAge: 12,
        minAge: 7,
        mode: "request",
        participantNote: text(
          "אותה מדריכה וקבוצת גיל, ביום הקרוב הבא.",
          "Тот же тренер и возрастная группа в ближайший следующий день.",
          "Same coach and age group on the next available day.",
        ),
        priceNis: 220,
        remaining: 6,
        offeringId: "gali-yam-kids-tennis",
        sourceUrl: sourceUrls.tennisClass,
        spaceId: "gali-yam-training-courts",
        sportCode: "tennis",
        syncStatus: "fresh",
        time: "17:00",
        title: text("חוג טניס מתחילים", "Секция тенниса для начинающих", "Beginner tennis class"),
      }),
    ],
    source: {
      checkedAt,
      confidence: "official_info",
      name: netanyaMunicipality,
      url: sourceUrls.galiYam,
    },
    sport: text("טניס", "Теннис", "Tennis"),
    sports: [text("טניס", "Теннис", "Tennis")],
    status: "bookable",
    summary: text(
      "מרכז עירוני עם חוגים לילדים, אימונים מתקדמים, מבוגרים ושימוש ציבורי. הזמנה אונליין זמינה רק לזמנים שנבדקו.",
      "Городской центр с детскими секциями, тренировками для взрослых и возможностью арендовать корт. Часть времени доступна для онлайн-брони.",
      "Municipal center with children classes, advanced training, adult groups, and public use. Online booking is available only for verified times.",
    ),
    tone: "success",
  },
  {
    accessibility: "no",
    address: text("רחוב עובדיה, ליד המרכז הקהילתי", "ул. Овадия, рядом с общинным центром", "Ovadia Street, near the community center"),
    audience: text("שימוש ציבורי חופשי", "Свободное общественное использование", "Free public use"),
    id: "ovadia-tennis-courts",
    bookingMethod: "free_public",
    confidenceScore: 73,
    coordinates: facilityCoordinates.ovadiaTennisCourts,
    features: ["available_today", "free_public"],
    sourceNotes: text(
      "שימוש ציבורי חופשי; כללי הזמנה מוקדמת דורשים בדיקה.",
      "Публичное использование; правила предварительной брони требуют проверки.",
      "Public use; advance booking rules need verification.",
    ),
    sourceType: "official_municipal",
    verificationStatus: "active_contact_only",
    images: [
      {
        alt: text("מגרש טניס ציבורי", "Публичный теннисный корт", "Public tennis court"),
        sourceUrl: sourceUrls.ovadia,
        src: images.tennis,
      },
    ],
    kind: "court",
    lighting: true,
    mode: "mirror",
    name: text("מגרשי טניס עובדיה", "Теннисные корты Овадия", "Ovadia Tennis Courts"),
    neighborhood: text("נאות גנים", "Неот-Ганим", "Neot Ganim"),
    parking: false,
    primarySlotId: "ovadia-free-public",
    searchTerms: ["tennis", "теннис", "public court", "free", "бесплатно", "ovadia", "עובדיה"],
    slots: [
      slot({
        ageRange: text("כל הגילאים באחריות המשתמש", "Все возрасты под ответственность пользователя", "All ages under user responsibility"),
        capacity: 2,
        confidence: "official_info",
        date: "2026-06-18",
        day: text("פתוח לציבור", "Открыто для публики", "Open to public"),
        durationMinutes: 60,
        group: text("שימוש עצמי", "Самостоятельно", "Self-service"),
        id: "ovadia-free-public",
        inventoryKind: "court_rental",
        maxAge: 99,
        minAge: 0,
        mode: "mirror",
        participantNote: text(
          "זהו שימוש ציבורי במגרש, לא ספירת משתתפים.",
          "Это публичное использование корта, не подсчет мест в группе.",
          "This is public court use, not group seat inventory.",
        ),
        priceNis: 0,
        remaining: 2,
        sourceUrl: sourceUrls.ovadia,
        sportCode: "tennis",
        syncStatus: "fresh",
        time: "ללא שעה קבועה",
        title: text("שימוש ציבורי חינם", "Бесплатное публичное использование", "Free public use"),
      }),
    ],
    source: {
      checkedAt,
      confidence: "official_info",
      name: netanyaMunicipality,
      url: sourceUrls.ovadia,
    },
    sport: text("טניס", "Теннис", "Tennis"),
    sports: [text("טניס", "Теннис", "Tennis")],
    status: "needsConfirmation",
    summary: text(
      "מגרשי טניס פתוחים לציבור ללא עלות. אין חניה ואין נגישות לפי מקור העירייה.",
      "Публичные теннисные корты с бесплатным доступом. На муниципальной странице парковка и доступность не указаны.",
      "Public tennis courts with no fee. The city source lists no parking and no accessibility.",
    ),
    tone: "warning",
  },
  {
    accessibility: "yes",
    address: text("שדרות בן גוריון 170", "проспект Бен-Гурион 170", "Sderot Ben Gurion 170"),
    audience: text("משפחות, נוער ומשחקים חופשיים", "Семьи, подростки и свободная игра", "Families, youth, and open play"),
    id: "sportek-ir-yamim-court",
    bookingMethod: "free_public",
    confidenceScore: 78,
    coordinates: facilityCoordinates.sportekIrYamimCourt,
    features: ["available_today", "free_public"],
    sourceNotes: text(
      "מגרש ציבורי חינם עם תאורה וחניה לפי מקור עירוני.",
      "Бесплатная общественная площадка с освещением и парковкой по данным муниципалитета.",
      "Free public court with lighting and parking per municipal source.",
    ),
    sourceType: "official_municipal",
    verificationStatus: "info_only",
    images: [
      {
        alt: text("ספורטק עיר ימים", "Спортек Ир-Ямим", "Sportek Ir Yamim"),
        sourceUrl: sourceUrls.sportekCourt,
        src: images.basketballFutsal,
      },
    ],
    kind: "public_space",
    lighting: true,
    mode: "mirror",
    name: text("ספורטק עיר ימים - מגרש משולב", "Спортек Ир-Ямим - комбинированная площадка", "Sportek Ir Yamim Combined Court"),
    neighborhood: text("עיר ימים", "Ир-Ямим", "Ir Yamim"),
    parking: true,
    primarySlotId: "sportek-open-play",
    searchTerms: ["basketball", "futsal", "football", "баскетбол", "футзал", "ир ямим", "free", "ספורטק"],
    spaces: [
      {
        capacity: 20,
        description: text("מגרש ציבורי משולב לכדורסל וקטרגל", "Общественная площадка для баскетбола и футзала", "Public combined court for basketball and futsal"),
        id: "sportek-combined-court-space",
        indoor: false,
        name: text("מגרש משולב", "Комбинированная площадка", "Combined court"),
        sports: ["basketball", "futsal"],
        surface: text("אספלט ספורט", "Спортивный асфальт", "Sport asphalt"),
      },
    ],
    openMatches: [
      {
        capacity: 10,
        confirmedPlayers: 6,
        date: "2026-06-18",
        id: "open-match-sportek-basketball",
        level: text("חובבים", "Любители", "Casual"),
        maxAge: 99,
        minAge: 16,
        safetyMode: "templates_only",
        spaceId: "sportek-combined-court-space",
        sportCode: "basketball",
        time: "21:00",
        title: text("משחק כדורסל פתוח", "Открытая игра в баскетбол", "Open basketball run"),
      },
    ],
    slots: [
      slot({
        ageRange: text("כל הגילאים", "Все возрасты", "All ages"),
        capacity: 20,
        confidence: "official_info",
        date: "2026-06-18",
        day: text("פתוח לציבור", "Открыто для публики", "Open to public"),
        durationMinutes: 60,
        group: text("משחק חופשי", "Свободная игра", "Open play"),
        id: "sportek-open-play",
        inventoryKind: "open_play",
        maxAge: 99,
        minAge: 0,
        mode: "mirror",
        participantNote: text(
          "מספר המקומות הוא עומס משוער לשטח ציבורי.",
          "Количество мест означает ориентировочную загруженность публичной площадки.",
          "Remaining places represent estimated public-space occupancy.",
        ),
        priceNis: 0,
        remaining: 9,
        offeringId: "sportek-open-play-offering",
        sourceUrl: sourceUrls.sportekCourt,
        spaceId: "sportek-combined-court-space",
        sportCode: "basketball",
        syncStatus: "fresh",
        time: "ללא שעה קבועה",
        title: text("כדורסל / קטרגל", "Баскетбол / футзал", "Basketball / futsal"),
      }),
    ],
    source: {
      checkedAt,
      confidence: "official_info",
      name: netanyaMunicipality,
      url: sourceUrls.sportekCourt,
    },
    sport: text("כדורסל וקטרגל", "Баскетбол и футзал", "Basketball and futsal"),
    sports: [text("כדורסל", "Баскетбол", "Basketball"), text("קטרגל", "Футзал", "Futsal")],
    status: "needsConfirmation",
    summary: text(
      "מגרש משולב נגיש עם תאורה וחניה, פתוח לציבור ללא עלות.",
      "Доступная комбинированная площадка с освещением и парковкой, открыта бесплатно.",
      "Accessible combined court with lighting and parking, open to the public for free.",
    ),
    tone: "warning",
  },
  {
    accessibility: "yes",
    address: text("שמואל הנציב 45", "Шмуэль ха-Нацив 45", "Shmuel Hanatziv 45"),
    audience: text("בנים, בנות ומבוגרים", "Мальчики, девочки и взрослые", "Boys, girls, and adults"),
    id: "yeshurun-basketball",
    bookingMethod: "contact_request",
    confidenceScore: 77,
    coordinates: facilityCoordinates.yeshurunBasketball,
    features: ["kids"],
    sourceNotes: text(
      "מרכז בית ספרי; הזמנת אולם וחוגים צריכים אישור.",
      "Школьный центр; аренда зала и секции требуют подтверждения.",
      "School center; hall use and classes need confirmation.",
    ),
    sourceType: "official_municipal",
    verificationStatus: "active_contact_only",
    images: [
      {
        alt: text("מרכז ספורט ישורון", "Спортивный центр Ешурун", "Yeshurun sports center"),
        sourceUrl: sourceUrls.yeshurun,
        src: images.basketballFutsal,
      },
    ],
    kind: "sport_center",
    lighting: true,
    mode: "request",
    name: text("מרכז ספורט ישורון", "Спортивный центр Ешурун", "Yeshurun Sports Center"),
    neighborhood: text("מרכז העיר", "Центр города", "City center"),
    parking: true,
    primarySlotId: "yeshurun-girls-basketball",
    searchTerms: [
      "basketball",
      "баскетбол",
      "basketball hall",
      "баскетбольный зал",
      "girls basketball",
      "amateur",
      "yeshurun",
      "shahar frank",
      "hagar shimoni",
      "carmit gigi",
      "ישורון",
    ],
    spaces: [
      {
        capacity: 24,
        description: text("אולם בית ספרי רב שימושי", "Школьный многоцелевой зал", "School multi-use hall"),
        id: "yeshurun-main-hall",
        indoor: true,
        name: text("אולם מרכזי", "Главный зал", "Main hall"),
        sports: ["basketball", "futsal"],
        surface: text("פרקט / PVC", "Паркет / PVC", "Wood / PVC"),
      },
    ],
    coaches: [
      {
        bio: text("מאמן כדורסל בנות במרכז ישורון.", "Тренер секции баскетбола для девочек в Ешурун.", "Girls basketball coach at Yeshurun."),
        id: "coach-shahar-frank",
        languages: ["עברית"],
        maxAge: 12,
        minAge: 7,
        name: text("שחר פרנק", "Шахар Франк", "Shahar Frank"),
        sourceUrl: sourceUrls.girlsBasketball,
        sportCodes: ["basketball"],
      },
    ],
    programs: [
      {
        coachId: "coach-shahar-frank",
        description: text("קבוצת כדורסל בנות לכיתות ד-ו.", "Группа баскетбола для девочек 4-6 классов.", "Girls basketball group for grades 4-6."),
        id: "program-yeshurun-girls-basketball",
        maxAge: 12,
        minAge: 7,
        recurrence: text("שלישי וחמישי", "Вторник и четверг", "Tuesday and Thursday"),
        remaining: 5,
        spaceId: "yeshurun-main-hall",
        sportCode: "basketball",
        title: text("כדורסל בנות", "Баскетбол для девочек", "Girls basketball"),
      },
      {
        description: text("ליגת כדורסל למבוגרים בשעות הערב.", "Баскетбольная лига для взрослых по вечерам.", "Adult basketball league in evening hours."),
        id: "program-yeshurun-adult-basketball",
        maxAge: 99,
        minAge: 18,
        recurrence: text("א-ה בערב", "Вс-Чт вечером", "Sun-Thu evenings"),
        remaining: 2,
        spaceId: "yeshurun-main-hall",
        sportCode: "basketball",
        title: text("כדורסל מבוגרים", "Баскетбол для взрослых", "Adult basketball"),
      },
    ],
    slots: [
      slot({
        ageRange: text("כיתות ד-ו / 7-12", "4-6 классы / 7-12", "Grades 4-6 / ages 7-12"),
        capacity: 18,
        confidence: "official_info",
        date: "2026-06-23",
        day: text("שלישי וחמישי", "Вторник и четверг", "Tuesday and Thursday"),
        durationMinutes: 45,
        group: text("כדורסל בנות", "Баскетбол для девочек", "Girls basketball"),
        id: "yeshurun-girls-basketball",
        instructor: text("שחר פרנק", "Шахар Франк", "Shahar Frank"),
        inventoryKind: "group_class",
        maxAge: 12,
        minAge: 7,
        mode: "request",
        participantNote: text(
          "הרשמה תופסת מקום אחד בקבוצת הבנות.",
          "Место резервируется для одной участницы группы.",
          "Enrollment claims one seat in the girls group.",
        ),
        priceNis: 225,
        remaining: 5,
        school: text("ישורון", "Ешурун", "Yeshurun"),
        offeringId: "yeshurun-girls-basketball-offering",
        sourceUrl: sourceUrls.girlsBasketball,
        spaceId: "yeshurun-main-hall",
        sportCode: "basketball",
        syncStatus: "fresh",
        time: "16:00 / 16:30",
        title: text("חוג כדורסל בנות", "Секция баскетбола для девочек", "Girls basketball class"),
      }),
      slot({
        ageRange: text("כיתות ד-ו / 7-12", "4-6 классы / 7-12", "Grades 4-6 / ages 7-12"),
        capacity: 18,
        confidence: "operator_confirmed",
        date: "2026-06-25",
        day: text("חמישי", "Четверг", "Thursday"),
        durationMinutes: 45,
        group: text("כדורסל בנות", "Баскетбол для девочек", "Girls basketball"),
        id: "yeshurun-girls-basketball-thu",
        instructor: text("שחר פרנק", "Шахар Франк", "Shahar Frank"),
        inventoryKind: "group_class",
        maxAge: 12,
        minAge: 7,
        mode: "request",
        participantNote: text(
          "אותה קבוצה ומדריך ביום הקרוב הבא.",
          "Та же группа и тренер в ближайший следующий день.",
          "Same group and coach on the next available day.",
        ),
        priceNis: 225,
        remaining: 6,
        school: text("ישורון", "Ешурун", "Yeshurun"),
        offeringId: "yeshurun-girls-basketball-offering",
        sourceUrl: sourceUrls.girlsBasketball,
        spaceId: "yeshurun-main-hall",
        sportCode: "basketball",
        syncStatus: "fresh",
        time: "16:00 / 16:30",
        title: text("חוג כדורסל בנות", "Секция баскетбола для девочек", "Girls basketball class"),
      }),
      slot({
        ageRange: text("מבוגרים", "Взрослые", "Adults"),
        capacity: 16,
        confidence: "official_info",
        date: "2026-06-21",
        day: text("א-ה", "Вс-Чт", "Sun-Thu"),
        durationMinutes: 120,
        group: text("ליגת מבוגרים", "Взрослая лига", "Adult league"),
        id: "yeshurun-adult-basketball",
        inventoryKind: "group_class",
        maxAge: 99,
        minAge: 18,
        mode: "request",
        participantNote: text(
          "הרשמה תופסת מקום שחקן בקבוצה.",
          "Место резервируется для одного игрока в группе.",
          "Enrollment claims one player seat in the group.",
        ),
        remaining: 2,
        school: text("ישורון", "Ешурун", "Yeshurun"),
        offeringId: "yeshurun-adult-basketball-offering",
        sourceUrl: sourceUrls.yeshurun,
        spaceId: "yeshurun-main-hall",
        sportCode: "basketball",
        syncStatus: "fresh",
        time: "16:00-21:00",
        title: text("כדורסל מבוגרים", "Баскетбол для взрослых", "Adult basketball"),
      }),
      slot({
        ageRange: text("16+", "16+", "16+"),
        capacity: 1,
        confidence: "official_info",
        date: "2026-06-21",
        day: text("לפי זמינות", "По наличию", "By availability"),
        durationMinutes: 90,
        group: text("ללא מדריך", "Без инструктора", "No instructor"),
        id: "yeshurun-hall-request",
        inventoryKind: "court_rental",
        maxAge: 99,
        minAge: 16,
        mode: "request",
        offeringId: "yeshurun-hall-basketball-rental",
        participantNote: text(
          "הבקשה היא לאולם/מגרש אחד; מספר המשתתפים לא מקטין מלאי.",
          "Заявка удерживает один зал/корт; число участников не списывает места.",
          "The request is for one hall/court; participants do not reduce inventory.",
        ),
        remaining: 1,
        sourceUrl: sourceUrls.yeshurunHall,
        spaceId: "yeshurun-main-hall",
        sportCode: "basketball",
        syncStatus: "fresh",
        time: "בתיאום",
        title: text("שימוש חובבים באולם", "Любительская аренда зала", "Amateur hall use"),
      }),
    ],
    source: {
      checkedAt,
      confidence: "official_info",
      name: netanyaMunicipality,
      url: sourceUrls.yeshurun,
    },
    sport: text("כדורסל וקטרגל", "Баскетбол и футзал", "Basketball and futsal"),
    sports: [text("כדורסל", "Баскетбол", "Basketball"), text("קטרגל", "Футзал", "Futsal")],
    status: "needsConfirmation",
    summary: text(
      "מרכז בבית ספר ישורון עם אולם אחד לפעילות כדורסל, קבוצות, ליגת מבוגרים ותיאום שימוש חובבים.",
      "Центр при школе Ешурун с одним физическим залом: секции, взрослая лига и заявка на любительскую аренду.",
      "School sports center with one physical hall for basketball classes, adult league, and amateur hall requests.",
    ),
    tone: "warning",
  },
  {
    accessibility: "unknown",
    address: text("יהודה פרח 11", "Йехуда Перах 11", "Yehuda Perach 11"),
    audience: text("ילדים ונוער", "Дети и подростки", "Children and youth"),
    id: "stakelis-sports-center",
    bookingMethod: "contact_request",
    confidenceScore: 72,
    coordinates: facilityCoordinates.stakelisSportsCenter,
    features: ["kids"],
    sourceNotes: text(
      "מרכז עירוני פעיל; דורש אישור מפעיל ללוחות קבוצות.",
      "Активный городской центр; расписание групп требует подтверждения оператора.",
      "Active municipal center; group schedules need operator confirmation.",
    ),
    sourceType: "official_municipal",
    verificationStatus: "active_contact_only",
    images: [
      {
        alt: text("מרכז ספורט בבית ספר", "Спортивный центр при школе", "School sports center"),
        sourceUrl: sourceUrls.stakelis,
        src: images.martialArts,
      },
    ],
    kind: "sport_center",
    lighting: true,
    mode: "request",
    name: text("מרכז ספורט סטקליס", "Спортивный центр Стакелис", "Stakelis Sports Center"),
    neighborhood: text("צפון העיר", "Север города", "North Netanya"),
    parking: "unknown",
    primarySlotId: "stakelis-taekwondo",
    searchTerms: ["basketball", "taekwondo", "баскетбол", "тхэквондо", "stakelis", "סטקליס"],
    slots: [
      slot({
        ageRange: text("ילדים ונוער", "Дети и подростки", "Children and youth"),
        capacity: 16,
        confidence: "official_info",
        date: "2026-06-21",
        day: text("א-ה", "Вс-Чт", "Sun-Thu"),
        durationMinutes: 60,
        group: text("טאקוונדו", "Тхэквондо", "Taekwondo"),
        id: "stakelis-taekwondo",
        inventoryKind: "group_class",
        maxAge: 17,
        minAge: 7,
        mode: "request",
        participantNote: text(
          "הרשמה תופסת מקום ילד/ה בקבוצה.",
          "Место резервируется для одного ребенка в группе.",
          "Enrollment claims one child seat in the group.",
        ),
        remaining: 6,
        school: text("סטקליס", "Стакелис", "Stakelis"),
        sourceUrl: sourceUrls.stakelis,
        sportCode: "taekwondo",
        syncStatus: "fresh",
        time: "16:00-21:00",
        title: text("טאקוונדו", "Тхэквондо", "Taekwondo"),
      }),
      slot({
        ageRange: text("ילדים ונוער", "Дети и подростки", "Children and youth"),
        capacity: 20,
        confidence: "official_info",
        date: "2026-06-22",
        day: text("א-ה", "Вс-Чт", "Sun-Thu"),
        durationMinutes: 60,
        group: text("כדורסל תחרותי", "Соревновательный баскетбол", "Competitive basketball"),
        id: "stakelis-competitive-basketball",
        inventoryKind: "group_class",
        maxAge: 17,
        minAge: 8,
        mode: "request",
        participantNote: text(
          "הרשמה תופסת מקום שחקן בקבוצה.",
          "Место резервируется для одного игрока в группе.",
          "Enrollment claims one player seat in the group.",
        ),
        remaining: 3,
        school: text("סטקליס", "Стакелис", "Stakelis"),
        sourceUrl: sourceUrls.stakelis,
        sportCode: "basketball",
        syncStatus: "fresh",
        time: "16:00-21:00",
        title: text("כדורסל תחרותי", "Соревновательный баскетбол", "Competitive basketball"),
      }),
    ],
    source: {
      checkedAt,
      confidence: "official_info",
      name: netanyaMunicipality,
      url: sourceUrls.stakelis,
    },
    sport: text("כדורסל וטאקוונדו", "Баскетбол и тхэквондо", "Basketball and taekwondo"),
    sports: [text("כדורסל", "Баскетбол", "Basketball"), text("טאקוונדו", "Тхэквондо", "Taekwondo")],
    status: "needsConfirmation",
    summary: text(
      "מרכז ספורט בית ספרי עם כדורסל, טאקוונדו וכדורסל תחרותי בימי א-ה.",
      "Школьный спортивный центр с баскетболом, тхэквондо и соревновательным баскетболом по вс-чт.",
      "School sports center with basketball, taekwondo, and competitive basketball Sunday-Thursday.",
    ),
    tone: "warning",
  },
  {
    accessibility: "unknown",
    address: text("ביאליק 17", "Бялик 17", "Bialik 17"),
    audience: text("ילדים בגיל בית ספר", "Дети школьного возраста", "School-age children"),
    id: "bialik-judo",
    bookingMethod: "contact_request",
    confidenceScore: 74,
    coordinates: facilityCoordinates.bialikJudo,
    features: ["kids"],
    sourceNotes: text(
      "מרכז עירוני פעיל; זמינות צריכה אישור מהמרכז.",
      "Активный городской центр; свободное время нужно уточнять у центра.",
      "Active municipal center without live slots.",
    ),
    sourceType: "official_municipal",
    verificationStatus: "active_contact_only",
    images: [
      {
        alt: text("מרכז ספורט ביאליק", "Спортивный центр Бялик", "Bialik sports center"),
        sourceUrl: sourceUrls.bialik,
        src: images.martialArts,
      },
    ],
    kind: "program",
    lighting: "unknown",
    mode: "request",
    name: text("מרכז ספורט ביאליק - ג'ודו", "Спортивный центр Бялик - дзюдо", "Bialik Sports Center - Judo"),
    neighborhood: text("מרכז העיר", "Центр города", "City center"),
    parking: "unknown",
    primarySlotId: "bialik-judo-mon-wed",
    searchTerms: ["judo", "дзюдо", "martial arts", "bialik", "גודו", "ביאליק"],
    slots: [
      slot({
        ageRange: text("ילדים, לאמת גיל מדויק", "Дети, уточнить точный возраст", "Children, confirm exact age"),
        capacity: 14,
        confidence: "official_info",
        date: "2026-06-22",
        day: text("שני ורביעי", "Понедельник и среда", "Monday and Wednesday"),
        durationMinutes: 90,
        group: text("ג'ודו", "Дзюдо", "Judo"),
        id: "bialik-judo-mon-wed",
        inventoryKind: "group_class",
        maxAge: 12,
        minAge: 6,
        mode: "request",
        participantNote: text(
          "הרשמה תופסת מקום ילד/ה בקבוצה.",
          "Место резервируется для одного ребенка в группе.",
          "Enrollment claims one child seat in the group.",
        ),
        remaining: 4,
        school: text("ביאליק", "Бялик", "Bialik"),
        sourceUrl: sourceUrls.bialik,
        sportCode: "judo",
        syncStatus: "fresh",
        time: "16:45-18:15",
        title: text("ג'ודו", "Дзюдо", "Judo"),
      }),
    ],
    source: {
      checkedAt,
      confidence: "official_info",
      name: netanyaMunicipality,
      url: sourceUrls.bialik,
    },
    sport: text("ג'ודו", "Дзюдо", "Judo"),
    sports: [text("ג'ודו", "Дзюдо", "Judo")],
    status: "needsConfirmation",
    summary: text(
      "חוג ג'ודו בבית ספר ביאליק בימים שני ורביעי אחר הצהריים.",
      "Секция дзюдо в школе Бялик по понедельникам и средам во второй половине дня.",
      "Judo program at Bialik school on Monday and Wednesday afternoons.",
    ),
    tone: "warning",
  },
  {
    accessibility: "yes",
    address: text("בית ספר תמר אריאל / שפירא", "Школа Тамар Ариэль / Шапира", "Tamar Ariel / Shapira School"),
    audience: text(
      "ילדים, נוער ומבוגרים עם צרכים מיוחדים",
      "Дети, подростки и взрослые с особыми потребностями",
      "Children, youth, and adults with special needs",
    ),
    id: "adapted-sport-tamar-ariel",
    bookingMethod: "contact_request",
    confidenceScore: 76,
    coordinates: facilityCoordinates.adaptedSportTamarAriel,
    features: ["adapted", "kids"],
    sourceNotes: text(
      "מקור עירוני; נדרש תיאום מקדים רגיש.",
      "Муниципальные сведения; перед бронью нужно согласовать доступность.",
      "Municipal source; needs careful prior coordination.",
    ),
    sourceType: "official_municipal",
    verificationStatus: "active_contact_only",
    images: [
      {
        alt: text("פעילות ספורט מותאמת", "Адаптированная спортивная активность", "Adapted sport activity"),
        sourceUrl: sourceUrls.specialNeeds,
        src: images.adaptedSport,
      },
    ],
    kind: "program",
    lighting: "unknown",
    mode: "request",
    name: text("ספורט מותאם - תמר אריאל", "Адаптированный спорт - Тамар Ариэль", "Adapted Sport - Tamar Ariel"),
    neighborhood: text("נתניה", "Нетания", "Netanya"),
    parking: "unknown",
    primarySlotId: "adapted-youth-sunday",
    searchTerms: [
      "adapted sport",
      "special needs",
      "баскетбол",
      "футбол",
      "зумба",
      "капоэйра",
      "צרכים מיוחדים",
    ],
    slots: [
      slot({
        ageRange: text("14-21", "14-21", "14-21"),
        capacity: 10,
        confidence: "official_info",
        date: "2026-06-21",
        day: text("ראשון ורביעי", "Воскресенье и среда", "Sunday and Wednesday"),
        durationMinutes: 45,
        group: text("נוער", "Подростки", "Youth"),
        id: "adapted-youth-sunday",
        inventoryKind: "group_class",
        maxAge: 21,
        minAge: 14,
        mode: "request",
        participantNote: text(
          "הרשמה תופסת מקום אחד בקבוצה מותאמת.",
          "Место резервируется для одного участника адаптированной группы.",
          "Enrollment claims one seat in the adapted group.",
        ),
        remaining: 3,
        school: text("תמר אריאל / שפירא", "Тамар Ариэль / Шапира", "Tamar Ariel / Shapira"),
        sourceUrl: sourceUrls.specialNeeds,
        sportCode: "adapted_sport",
        syncStatus: "fresh",
        time: "17:15-18:00",
        title: text("כדורסל, הגנה עצמית, כדורגל וזומבה", "Баскетбол, самооборона, футбол и зумба", "Basketball, self-defense, football, and zumba"),
      }),
      slot({
        ageRange: text("21+", "21+", "21+"),
        capacity: 10,
        confidence: "official_info",
        date: "2026-06-21",
        day: text("ראשון ורביעי", "Воскресенье и среда", "Sunday and Wednesday"),
        durationMinutes: 45,
        group: text("מבוגרים", "Взрослые", "Adults"),
        id: "adapted-adults-sunday",
        inventoryKind: "group_class",
        maxAge: 99,
        minAge: 21,
        mode: "request",
        participantNote: text(
          "הרשמה תופסת מקום אחד בקבוצת המבוגרים.",
          "Место резервируется для одного участника взрослой группы.",
          "Enrollment claims one seat in the adult group.",
        ),
        remaining: 2,
        school: text("תמר אריאל / שפירא", "Тамар Ариэль / Шапира", "Tamar Ariel / Shapira"),
        sourceUrl: sourceUrls.specialNeeds,
        sportCode: "adapted_sport",
        syncStatus: "fresh",
        time: "18:00-18:45",
        title: text("כדורסל, הגנה עצמית, כדורגל וזומבה", "Баскетбол, самооборона, футбол и зумба", "Basketball, self-defense, football, and zumba"),
      }),
      slot({
        ageRange: text("4-12", "4-12", "4-12"),
        capacity: 8,
        confidence: "official_info",
        date: "2026-06-23",
        day: text("שלישי", "Вторник", "Tuesday"),
        durationMinutes: 45,
        group: text("קפוארה בקבוצות קטנות", "Капоэйра в малых группах", "Capoeira in small groups"),
        id: "adapted-capoeira-kids",
        inventoryKind: "group_class",
        maxAge: 12,
        minAge: 4,
        mode: "request",
        participantNote: text(
          "הרשמה תופסת מקום ילד/ה בקבוצה קטנה.",
          "Место резервируется для одного ребенка в малой группе.",
          "Enrollment claims one child seat in a small group.",
        ),
        remaining: 2,
        school: text("תמר אריאל / שפירא", "Тамар Ариэль / Шапира", "Tamar Ariel / Shapira"),
        sourceUrl: sourceUrls.specialNeeds,
        sportCode: "capoeira",
        syncStatus: "fresh",
        time: "לפי גיל",
        title: text("קפוארה לילדים", "Капоэйра для детей", "Children's capoeira"),
      }),
    ],
    source: {
      checkedAt,
      confidence: "official_info",
      name: netanyaMunicipality,
      url: sourceUrls.specialNeeds,
    },
    sport: text("ספורט מותאם", "Адаптированный спорт", "Adapted sport"),
    sports: [
      text("כדורסל", "Баскетбол", "Basketball"),
      text("כדורגל", "Футбол", "Football"),
      text("זומבה", "Зумба", "Zumba"),
      text("קפוארה", "Капоэйра", "Capoeira"),
    ],
    status: "needsConfirmation",
    summary: text(
      "מרכז ספורט מותאם עם קבוצות גיל ברורות לנוער, מבוגרים וילדים בקבוצות קטנות.",
      "Адаптированный спорт с понятными возрастными группами для подростков, взрослых и детей в малых группах.",
      "Adapted sport with clear youth, adult, and small children's groups.",
    ),
    tone: "warning",
  },
  {
    accessibility: "yes",
    address: text("שדרות בן גוריון 170", "проспект Бен-Гурион 170", "Sderot Ben Gurion 170"),
    audience: text("מבוגרים ונוער 16+, זוגות ומשחקים פתוחים", "Взрослые и подростки 16+, пары и открытые игры", "Adults and teens 16+, doubles and open games"),
    id: "top-padel-ir-yamim",
    bookingMethod: "external_registration",
    confidenceScore: 88,
    coordinates: facilityCoordinates.topPadelIrYamim,
    externalRegistrationUrl: sourceUrls.topPadel,
    features: ["available_today", "online_booking"],
    sourceNotes: text(
      "4 מגרשים בעיר ימים. זמינות והזמנה צריכות אישור באתר המרכז.",
      "4 корта в Ир-Ямим. Бронирование пока нужно уточнять на странице клуба.",
      "4 courts in Ir Yamim. Availability and booking should be confirmed on the club page.",
    ),
    sourceType: "partner_site",
    verificationStatus: "live_registration",
    images: [
      {
        alt: text("מגרש פאדל", "Корт падела", "Padel court"),
        sourceUrl: sourceUrls.topPadel,
        src: images.padel,
      },
      {
        alt: text("אזור ספורט עיר ימים", "Спортивная зона Ир-Ямим", "Ir Yamim sports area"),
        sourceUrl: sourceUrls.sportekCourt,
        src: images.padel,
      },
    ],
    kind: "court",
    lighting: true,
    mode: "request",
    name: text("Top Padel עיר ימים", "Top Padel Ир-Ямим", "Top Padel Ir Yamim"),
    neighborhood: text("עיר ימים", "Ир-Ямим", "Ir Yamim"),
    parking: true,
    primarySlotId: "top-padel-ir-yamim-evening-court",
    searchTerms: ["padel", "падел", "top padel", "ir yamim", "partner", "app booking", "פאדל"],
    spaces: [
      {
        capacity: 4,
        description: text("מגרש פאדל חיצוני לזוגות", "Открытый корт падела для парной игры", "Outdoor padel court for doubles"),
        id: "top-padel-ir-yamim-court-01",
        indoor: false,
        name: text("מגרש פאדל", "Корт падела", "Padel court"),
        sports: ["padel"],
        surface: text("דשא סינתטי", "Искусственная трава", "Artificial turf"),
      },
    ],
    openMatches: [
      {
        capacity: 4,
        confirmedPlayers: 2,
        date: "2026-06-19",
        id: "open-match-top-padel-ir-yamim-evening",
        level: text("מתחילים עד בינוני", "Начальный-средний", "Beginner to intermediate"),
        maxAge: 99,
        minAge: 16,
        safetyMode: "templates_only",
        spaceId: "top-padel-ir-yamim-court-01",
        sportCode: "padel",
        time: "19:30",
        title: text("מחפשים זוג לפאדל", "Ищем пару для падела", "Looking for padel partners"),
      },
    ],
    slots: [
      slot({
        ageRange: text("16+", "16+", "16+"),
        capacity: 1,
        confidence: "manual_review",
        date: "2026-06-18",
        day: text("היום", "Сегодня", "Today"),
        durationMinutes: 90,
        group: text("השכרת מגרש", "Аренда корта", "Court rental"),
        id: "top-padel-ir-yamim-evening-court",
        inventoryKind: "court_rental",
        maxAge: 99,
        minAge: 16,
        mode: "request",
        participantNote: text(
          "ההשכרה שומרת מגרש אחד; שחקנים נוספים הם תכנון בלבד.",
          "Аренда удерживает один корт; остальные игроки нужны только для планирования.",
          "Rental holds one court; extra players are planning context only.",
        ),
        remaining: 1,
        offeringId: "top-padel-ir-yamim-court-rental",
        sourceUrl: sourceUrls.topPadel,
        spaceId: "top-padel-ir-yamim-court-01",
        sportCode: "padel",
        syncStatus: "stale",
        time: "20:30",
        title: text("מגרש פאדל - בדיקת זמינות", "Корт падела - проверить доступность", "Padel court - check availability"),
      }),
      slot({
        ageRange: text("16+", "16+", "16+"),
        capacity: 4,
        confidence: "manual_review",
        date: "2026-06-19",
        day: text("מחר", "Завтра", "Tomorrow"),
        durationMinutes: 90,
        group: text("משחק פתוח", "Открытая игра", "Open match"),
        id: "top-padel-ir-yamim-open-match-slot",
        inventoryKind: "open_play",
        maxAge: 99,
        minAge: 16,
        mode: "request",
        participantNote: text(
          "הצטרפות למשחק פתוח תופסת מקום שחקן, לא מגרש שלם.",
          "Присоединение к открытой игре занимает место игрока, не весь корт.",
          "Joining open play claims a player seat, not the whole court.",
        ),
        remaining: 2,
        offeringId: "top-padel-ir-yamim-open-match",
        sourceUrl: sourceUrls.topPadel,
        spaceId: "top-padel-ir-yamim-court-01",
        sportCode: "padel",
        syncStatus: "stale",
        time: "19:30",
        title: text("משחק פאדל פתוח", "Открытая игра в падел", "Open padel match"),
      }),
    ],
    source: {
      checkedAt,
      confidence: "manual_review",
      name: text("Top Padel", "Top Padel", "Top Padel"),
      url: sourceUrls.topPadel,
    },
    sport: text("פאדל", "Падел", "Padel"),
    sports: [text("פאדל", "Падел", "Padel")],
    status: "needsConfirmation",
    summary: text(
      "מועדון פאדל פעיל. ב-SportIL מוצגת בקשת זמינות עד חיבור הרשמה מקומית.",
      "Действующий клуб падела. В SportIL пока можно отправить заявку и перейти на страницу клуба.",
      "Active padel club. SportIL shows an availability request until local registration is connected.",
    ),
    tone: "info",
  },
  {
    accessibility: "unknown",
    address: text("שולמית 3 / מתחם גרין ביץ'", "Шуламит 3 / Green Beach complex", "Shulamit 3 / Green Beach complex"),
    audience: text("מבוגרים ונוער 16+", "Взрослые и подростки 16+", "Adults and teens 16+"),
    id: "top-padel-poleg",
    bookingMethod: "external_registration",
    confidenceScore: 86,
    coordinates: facilityCoordinates.topPadelPoleg,
    externalRegistrationUrl: sourceUrls.topPadel,
    features: ["online_booking"],
    sourceNotes: text(
      "מיקום פולג / גרין ביץ'. זמינות והזמנה צריכות אישור באתר המרכז.",
      "Локация Poleg / Green Beach. Свободное время нужно уточнять на странице клуба.",
      "Poleg / Green Beach location. Availability and booking should be confirmed on the club page.",
    ),
    sourceType: "partner_site",
    verificationStatus: "live_registration",
    images: [
      {
        alt: text("מגרש פאדל פולג", "Корт падела Полег", "Poleg padel court"),
        sourceUrl: sourceUrls.topPadel,
        src: images.padel,
      },
    ],
    kind: "court",
    lighting: true,
    mode: "request",
    name: text("Top Padel פולג", "Top Padel Полег", "Top Padel Poleg"),
    neighborhood: text("פולג / גרין ביץ'", "Полег / Green Beach", "Poleg / Green Beach"),
    parking: "unknown",
    primarySlotId: "top-padel-poleg-court-slot",
    searchTerms: ["padel", "падел", "top padel", "poleg", "green beach", "פאדל"],
    spaces: [
      {
        capacity: 4,
        description: text("מגרש פאדל במתחם גרין ביץ'", "Корт падела в Green Beach complex", "Padel court at Green Beach complex"),
        id: "top-padel-poleg-court-01",
        indoor: false,
        name: text("מגרש פאדל פולג", "Корт падела Полег", "Poleg padel court"),
        sports: ["padel"],
        surface: text("דשא סינתטי", "Искусственная трава", "Artificial turf"),
      },
    ],
    slots: [
      slot({
        ageRange: text("16+", "16+", "16+"),
        capacity: 1,
        confidence: "manual_review",
        date: "2026-06-19",
        day: text("מחר", "Завтра", "Tomorrow"),
        durationMinutes: 90,
        group: text("השכרת מגרש", "Аренда корта", "Court rental"),
        id: "top-padel-poleg-court-slot",
        inventoryKind: "court_rental",
        maxAge: 99,
        minAge: 16,
        mode: "request",
        participantNote: text(
          "בקשה למגרש אחד; מספר המשתתפים אינו מלאי.",
          "Заявка на один корт; число участников не является вместимостью.",
          "Request is for one court; participant count is not inventory.",
        ),
        remaining: 1,
        sourceUrl: sourceUrls.topPadel,
        spaceId: "top-padel-poleg-court-01",
        sportCode: "padel",
        syncStatus: "stale",
        time: "20:00",
        title: text("מגרש פאדל פולג - בדיקת זמינות", "Корт падела Полег - проверить доступность", "Poleg padel court - check availability"),
      }),
    ],
    source: {
      checkedAt,
      confidence: "manual_review",
      name: text("Top Padel", "Top Padel", "Top Padel"),
      url: sourceUrls.topPadel,
    },
    sport: text("פאדל", "Падел", "Padel"),
    sports: [text("פאדל", "Падел", "Padel")],
    status: "needsConfirmation",
    summary: text(
      "לוקיישן פאדל בפולג עם פוטנציאל חזק למציאת שותף ותיאום משחקים.",
      "Локация падела в Полег с сильным потенциалом для поиска партнера и координации игр.",
      "Poleg padel location with strong partner matching and game coordination potential.",
    ),
    tone: "info",
  },
  {
    accessibility: "yes",
    address: text("האוניברסיטה 1", "HaUniversita 1", "HaUniversita 1"),
    audience: text("ילדים, סטודנטים, מבוגרים ומשפחות", "Дети, студенты, взрослые и семьи", "Children, students, adults, and families"),
    id: "collegym-netanya",
    bookingMethod: "external_registration",
    confidenceScore: 87,
    coordinates: facilityCoordinates.collegymNetanya,
    externalRegistrationUrl: sourceUrls.collegym,
    features: ["kids", "swimming", "online_booking"],
    sourceNotes: text(
      "לאחד עם Sports Center at Netanya Academic College; לא ליצור כפילות.",
      "Объединять со Sports Center at Netanya Academic College; не дублировать.",
      "Merge with Netanya Academic College Sports Center; avoid duplicates.",
    ),
    sourceType: "partner_site",
    verificationStatus: "live_registration",
    images: [
      {
        alt: text("מרכז ספורט ובריכה", "Спортцентр и бассейн", "Sports center and pool"),
        sourceUrl: sourceUrls.collegym,
        src: images.communityMultisport,
      },
    ],
    kind: "sport_center",
    lighting: true,
    mode: "request",
    name: text("קולג'ים - מרכז הספורט במכללת נתניה", "Collegym - спортцентр академического колледжа Нетании", "Collegym - Netanya Academic College Sports Center"),
    neighborhood: text("קריית השרון / המכללה", "Кирьят ха-Шарон / колледж", "Kiryat HaSharon / College"),
    parking: true,
    primarySlotId: "collegym-kids-multisport-slot",
    searchTerms: ["collegym", "swimming", "pool", "tennis", "basketball", "dance", "gymnastics", "spinning", "дети", "плавание"],
    spaces: [
      {
        capacity: 20,
        description: text("בריכה מחוממת חצי אולימפית", "Крытый подогреваемый полуолимпийский бассейн", "Heated half-Olympic indoor pool"),
        id: "collegym-pool",
        indoor: true,
        name: text("בריכה חצי אולימפית", "Полуолимпийский бассейн", "Half-Olympic pool"),
        sports: ["swimming"],
        surface: text("מים", "Вода", "Water"),
      },
      {
        capacity: 18,
        description: text("חוגי ילדים וסטודיו", "Детские секции и студия", "Children classes and studio"),
        id: "collegym-studios",
        indoor: true,
        name: text("סטודיו חוגים", "Студия секций", "Classes studio"),
        sports: ["judo", "capoeira", "gymnastics", "dance", "basketball", "football", "spinning", "fitness"],
        surface: text("סטודיו", "Студия", "Studio"),
      },
    ],
    programs: [
      {
        bookingMethod: "external_registration",
        confidenceScore: 87,
        description: text("ילדים - ג'ודו, קפוארה, התעמלות, מחול ועוד.", "Дети - дзюдо, капоэйра, гимнастика, танцы и другое.", "Kids - judo, capoeira, gymnastics, dance, and more."),
        externalRegistrationUrl: sourceUrls.collegym,
        id: "program-collegym-kids-multisport",
        maxAge: 12,
        minAge: 5,
        paymentMethod: "external_payment",
        recurrence: text("עונת 2025-2026", "Сезон 2025-2026", "2025-2026 season"),
        remaining: 6,
        spaceId: "collegym-studios",
        sportCode: "gymnastics",
        title: text("חוגי ילדים רב-תחומיים", "Мультиспорт для детей", "Children multi-sport classes"),
        verificationStatus: "live_registration",
      },
    ],
    slots: [
      slot({
        ageRange: text("5-12", "5-12", "5-12"),
        capacity: 12,
        confidence: "manual_review",
        date: "2026-06-22",
        day: text("עונתי", "Сезонно", "Seasonal"),
        durationMinutes: 45,
        group: text("ילדים", "Дети", "Kids"),
        id: "collegym-kids-multisport-slot",
        inventoryKind: "group_class",
        maxAge: 12,
        minAge: 5,
        mode: "request",
        participantNote: text(
          "הרשמה חיצונית לקבוצה; SportIL מציג מקום משוער עד סנכרון.",
          "Регистрация проходит на сайте центра; количество мест пока ориентировочное.",
          "External group registration; SportIL shows estimated seats until sync.",
        ),
        remaining: 6,
        sourceUrl: sourceUrls.collegym,
        spaceId: "collegym-studios",
        sportCode: "gymnastics",
        syncStatus: "stale",
        time: "אחה\"צ",
        title: text("חוגי ילדים בקולג'ים", "Детские секции Collegym", "Collegym kids classes"),
      }),
      slot({
        ageRange: text("לפי מערכת המועדון", "Уточнить в центре", "Confirm with center"),
        capacity: 1,
        confidence: "manual_review",
        date: "2026-06-19",
        day: text("לוח זמנים לבדיקה", "Расписание уточнить", "Schedule to confirm"),
        durationMinutes: 45,
        group: text("סטודיו", "Студия", "Studio"),
        id: "collegym-spinning-catalog-slot",
        inventoryKind: "group_class",
        maxAge: 99,
        minAge: 16,
        mode: "mirror",
        participantNote: text(
          "נוסף מקטלוג Netanya 2026; נדרש אימות לפני הרשמה.",
          "Добавлено из каталога Netanya 2026; перед записью нужно подтвердить расписание.",
          "Added from the 2026 Netanya catalog; timetable must be confirmed before registration.",
        ),
        priceNis: 0,
        remaining: 1,
        sourceUrl: sourceUrls.collegym,
        spaceId: "collegym-studios",
        sportCode: "spinning",
        syncStatus: "stale",
        time: "ללא שעה קבועה",
        title: text("ספינינג", "Spinning — уточнить", "Spinning — confirm"),
      }),
    ],
    source: {
      checkedAt,
      confidence: "manual_review",
      name: text("קולג'ים", "Collegym", "Collegym"),
      url: sourceUrls.collegym,
    },
    sport: text("שחייה, טניס, כדורסל וחוגים", "Плавание, теннис, баскетбол и секции", "Swimming, tennis, basketball, and classes"),
    sports: [
      text("שחייה", "Плавание", "Swimming"),
      text("טניס", "Теннис", "Tennis"),
      text("כדורסל", "Баскетбол", "Basketball"),
      text("התעמלות", "Гимнастика", "Gymnastics"),
    ],
    status: "needsConfirmation",
    summary: text(
      "מרכז רב-תחומי חזק עם בריכה, מגרשים וחוגי ילדים. מוצג כהרשמה חיצונית עד חיבור נתונים.",
      "Мультиспорт-центр с бассейном, кортами и детскими секциями. Регистрация пока проходит на сайте центра.",
      "Strong multi-sport center with pool, courts, and children classes. Shown as external registration until data sync.",
    ),
    tone: "info",
  },
  {
    accessibility: "yes",
    address: text("רמת פולג", "Рамат Полег", "Ramat Poleg"),
    audience: text("משפחות, ילדים, מבוגרים ושחייה", "Семьи, дети, взрослые и плавание", "Families, children, adults, and swimming"),
    id: "country-club-poleg",
    bookingMethod: "external_registration",
    confidenceScore: 86,
    coordinates: facilityCoordinates.countryClubPoleg,
    externalRegistrationUrl: sourceUrls.countryPoleg,
    features: ["kids", "swimming", "online_booking"],
    sourceNotes: text(
      "מועדון רב-תחומי חי; צריך API/יצוא לזמינות אמיתית.",
      "Действующий мультиспорт-клуб; свободное время нужно подтвердить у центра.",
      "Live multi-sport club; needs API/export for real availability.",
    ),
    sourceType: "partner_site",
    verificationStatus: "live_registration",
    images: [
      {
        alt: text("קאנטרי קלאב ובריכה", "Кантри-клуб и бассейн", "Country club and pool"),
        sourceUrl: sourceUrls.countryPoleg,
        src: images.swimming,
      },
    ],
    kind: "sport_center",
    lighting: true,
    mode: "request",
    name: text("קאנטרי קלאב פולג", "Country Club Poleg", "Country Club Poleg"),
    neighborhood: text("פולג", "Полег", "Poleg"),
    parking: true,
    primarySlotId: "country-poleg-swimming-slot",
    searchTerms: ["country poleg", "swimming", "pool", "tennis", "futsal", "basketball", "плавание", "полег"],
    spaces: [
      {
        capacity: 16,
        description: text("בריכות וחוגי שחייה", "Бассейны и уроки плавания", "Pools and swimming classes"),
        id: "country-poleg-pool",
        indoor: true,
        name: text("בריכות שחייה", "Бассейны", "Swimming pools"),
        sports: ["swimming"],
        surface: text("מים", "Вода", "Water"),
      },
      {
        capacity: 4,
        description: text("מגרשי טניס במתחם", "Теннисные корты комплекса", "Tennis courts in the complex"),
        id: "country-poleg-tennis-courts",
        indoor: false,
        name: text("מגרשי טניס", "Теннисные корты", "Tennis courts"),
        sports: ["tennis"],
        surface: text("משטח קשיח", "Хард", "Hard court"),
      },
    ],
    programs: [
      {
        bookingMethod: "external_registration",
        confidenceScore: 86,
        description: text("חוגי שחייה ושיעורים פרטיים מגיל 5 ועד מבוגרים.", "Плавание и индивидуальные занятия с 5 лет до взрослых.", "Swimming classes and private lessons from age 5 through adults."),
        externalRegistrationUrl: sourceUrls.countryPoleg,
        id: "program-country-poleg-swimming",
        maxAge: 120,
        minAge: 5,
        paymentMethod: "external_payment",
        recurrence: text("לפי מסלול והרשמה", "По выбранной программе", "By track and registration"),
        remaining: 4,
        spaceId: "country-poleg-pool",
        sportCode: "swimming",
        title: text("שחייה לילדים ומבוגרים", "Плавание для детей и взрослых", "Swimming for children and adults"),
        verificationStatus: "live_registration",
      },
    ],
    slots: [
      slot({
        ageRange: text("5-120", "5-120", "5-120"),
        capacity: 10,
        confidence: "manual_review",
        date: "2026-06-23",
        day: text("לפי מסלול", "По программе", "By track"),
        durationMinutes: 45,
        group: text("שחייה", "Плавание", "Swimming"),
        id: "country-poleg-swimming-slot",
        inventoryKind: "group_class",
        maxAge: 120,
        minAge: 5,
        mode: "request",
        participantNote: text(
          "קבוצה/מסלול שחייה; מקום פנוי משוער עד אישור מפעיל.",
          "Группа по плаванию; свободные места нужно подтвердить у центра.",
          "Swimming group/track; remaining seats are estimated until operator confirmation.",
        ),
        remaining: 4,
        sourceUrl: sourceUrls.countryPoleg,
        spaceId: "country-poleg-pool",
        sportCode: "swimming",
        syncStatus: "stale",
        time: "אחה\"צ",
        title: text("שחייה לילדים ומבוגרים", "Плавание для детей и взрослых", "Swimming for children and adults"),
      }),
    ],
    source: {
      checkedAt,
      confidence: "manual_review",
      name: text("קאנטרי קלאב פולג", "Country Club Poleg", "Country Club Poleg"),
      url: sourceUrls.countryPoleg,
    },
    sport: text("שחייה, טניס, קטרגל וכושר", "Плавание, теннис, футзал и фитнес", "Swimming, tennis, futsal, and fitness"),
    sports: [
      text("שחייה", "Плавание", "Swimming"),
      text("טניס", "Теннис", "Tennis"),
      text("קטרגל", "Футзал", "Futsal"),
    ],
    status: "needsConfirmation",
    summary: text(
      "קאנטרי חי עם בריכות, מגרשים וחוגים; מתאים לייבוא זמינות והזמנות בעתיד.",
      "Действующий клуб с бассейнами, кортами и секциями. Бронирование пока проходит через центр.",
      "Live country club with pools, courts, and classes; strong candidate for future availability/booking import.",
    ),
    tone: "info",
  },
  {
    accessibility: "yes",
    address: text("שדרות בן גוריון 143", "проспект Бен-Гурион 143", "Sderot Ben Gurion 143"),
    audience: text("משפחות, נוער, סקייט, רולר ופוטסל", "Семьи, подростки, скейт, ролики и футзал", "Families, youth, skate, roller, and futsal"),
    id: "winter-lake-sports-park",
    bookingMethod: "free_public",
    confidenceScore: 71,
    coordinates: facilityCoordinates.winterLakeSportsPark,
    features: ["available_today", "free_public", "skate_roller"],
    sourceNotes: text(
      "אגם החורף: פוטסל, רולר וסקייט; הזמנה מוקדמת לפוטסל דורשת אישור.",
      "Winter Lake: футзал, ролики и скейт; предварительная бронь футзала требует подтверждения.",
      "Winter Lake: futsal, roller, and skate; futsal advance booking needs confirmation.",
    ),
    sourceType: "official_municipal",
    verificationStatus: "active_contact_only",
    images: [
      {
        alt: text("ספורטק ושטח ציבורי", "Публичная спортивная площадка", "Public sports area"),
        sourceUrl: sourceUrls.netanyaMunicipality,
        src: images.skateRoller,
      },
    ],
    kind: "public_space",
    lighting: true,
    mode: "mirror",
    name: text("אגם החורף - סקייט, רולר ופוטסל", "Winter Lake - скейт, ролики и футзал", "Winter Lake - Skate, Roller, and Futsal"),
    neighborhood: text("אגם החורף", "Winter Lake", "Winter Lake"),
    parking: true,
    primarySlotId: "winter-lake-skatepark-open",
    searchTerms: ["winter lake", "skatepark", "skate", "roller", "futsal", "скейт", "ролики", "אגם החורף"],
    spaces: [
      {
        capacity: 20,
        description: text("מגרש פוטסל סינתטי ציבורי", "Публичное синтетическое поле футзала", "Public synthetic futsal field"),
        id: "winter-lake-futsal-field",
        indoor: false,
        name: text("מגרש פוטסל", "Поле футзала", "Futsal field"),
        sports: ["futsal"],
        surface: text("דשא סינתטי", "Искусственная трава", "Synthetic grass"),
      },
      {
        capacity: 30,
        description: text("סקייטפארק ציבורי עם מתקני אקסטרים", "Публичный скейтпарк с extreme facilities", "Public skatepark with extreme facilities"),
        id: "winter-lake-skatepark",
        indoor: false,
        name: text("סקייטפארק", "Скейтпарк", "Skatepark"),
        sports: ["skateboarding", "roller_skating"],
        surface: text("בטון", "Бетон", "Concrete"),
      },
    ],
    slots: [
      slot({
        ageRange: text("כל הגילאים באחריות המשתמש", "Все возрасты под ответственность пользователя", "All ages under user responsibility"),
        capacity: 30,
        confidence: "official_info",
        date: "2026-06-18",
        day: text("פתוח לציבור", "Открыто для публики", "Open to public"),
        durationMinutes: 60,
        group: text("סקייט / רולר", "Скейт / ролики", "Skate / roller"),
        id: "winter-lake-skatepark-open",
        inventoryKind: "open_play",
        maxAge: 99,
        minAge: 0,
        mode: "mirror",
        participantNote: text(
          "זהו שטח ציבורי; מקומות פנויים הם הערכת עומס בלבד.",
          "Это публичная зона; свободные места означают только оценку загрузки.",
          "This is public space; remaining places are only estimated load.",
        ),
        priceNis: 0,
        remaining: 12,
        sourceUrl: sourceUrls.netanyaMunicipality,
        spaceId: "winter-lake-skatepark",
        sportCode: "skateboarding",
        syncStatus: "fresh",
        time: "עד 01:00",
        title: text("סקייטפארק ציבורי", "Публичный скейтпарк", "Public skatepark"),
      }),
      slot({
        ageRange: text("כל הגילאים", "Все возрасты", "All ages"),
        capacity: 20,
        confidence: "official_info",
        date: "2026-06-18",
        day: text("פתוח לציבור", "Открыто для публики", "Open to public"),
        durationMinutes: 60,
        group: text("פוטסל", "Футзал", "Futsal"),
        id: "winter-lake-futsal-evening",
        inventoryKind: "open_play",
        maxAge: 99,
        minAge: 0,
        mode: "mirror",
        participantNote: text(
          "פוטסל ציבורי; research מציין צורך אפשרי בהזמנה מוקדמת.",
          "Публичный футзал; правила предварительной брони нужно уточнить.",
          "Public futsal; research notes possible advance booking.",
        ),
        priceNis: 0,
        remaining: 12,
        sourceUrl: sourceUrls.netanyaMunicipality,
        spaceId: "winter-lake-futsal-field",
        sportCode: "futsal",
        syncStatus: "stale",
        time: "17:00-23:00",
        title: text("פוטסל ציבורי", "Публичный футзал", "Public futsal"),
      }),
    ],
    source: {
      checkedAt,
      confidence: "official_info",
      name: netanyaMunicipality,
      url: sourceUrls.netanyaMunicipality,
    },
    sport: text("סקייט, רולר ופוטסל", "Скейт, ролики и футзал", "Skate, roller, and futsal"),
    sports: [
      text("סקייטבורד", "Скейтборд", "Skateboarding"),
      text("רולר", "Ролики", "Roller skating"),
      text("קטרגל", "Футзал", "Futsal"),
    ],
    status: "needsConfirmation",
    summary: text(
      "פארק ציבורי עם סקייט, רולר ופוטסל. לא מוצגת הרשמה מיידית ללא אישור כללי booking.",
      "Публичный парк со скейтом, роликами и футзалом. Для футзала правила брони нужно уточнить.",
      "Public park with skate, roller, and futsal. No instant booking until rules are verified.",
    ),
    tone: "warning",
  },
  {
    accessibility: "unknown",
    address: text("האר\"י / דגניה", "HaAri / Degania", "HaAri / Degania"),
    audience: text("משפחות, רולר, כדורסל ופוטסל", "Семьи, ролики, баскетбол и футзал", "Families, roller, basketball, and futsal"),
    id: "sportek-yahalom",
    bookingMethod: "free_public",
    confidenceScore: 70,
    coordinates: facilityCoordinates.sportekYahalom,
    features: ["available_today", "free_public", "skate_roller"],
    sourceNotes: text(
      "פוטסל, מגרש משולב ורולר; עומס הוא הערכה בלבד.",
      "Футзал, универсальная площадка и ролики; занятость указана ориентировочно.",
      "Futsal, combined court, and roller court; load is estimated only.",
    ),
    sourceType: "official_municipal",
    verificationStatus: "info_only",
    images: [
      {
        alt: text("ספורטק יהלום", "Спортек Яалом", "Sportek Yahalom"),
        sourceUrl: sourceUrls.netanyaMunicipality,
        src: images.skateRoller,
      },
    ],
    kind: "public_space",
    lighting: true,
    mode: "mirror",
    name: text("ספורטק יהלום", "Спортек Яалом", "Sportek Yahalom"),
    neighborhood: text("יהלום", "Яалом", "Yahalom"),
    parking: "unknown",
    primarySlotId: "sportek-yahalom-roller-open",
    searchTerms: ["sportek yahalom", "roller", "futsal", "basketball", "ролики", "футзал"],
    spaces: [
      {
        capacity: 18,
        description: text("מגרש רולר ציבורי", "Публичная роллер-площадка", "Public roller court"),
        id: "sportek-yahalom-roller-court",
        indoor: false,
        name: text("מגרש רולר", "Роллер-площадка", "Roller court"),
        sports: ["roller_skating"],
        surface: text("אספלט ספורט", "Спортивный асфальт", "Sport asphalt"),
      },
    ],
    slots: [
      slot({
        ageRange: text("כל הגילאים", "Все возрасты", "All ages"),
        capacity: 18,
        confidence: "official_info",
        date: "2026-06-18",
        day: text("פתוח לציבור", "Открыто для публики", "Open to public"),
        durationMinutes: 60,
        group: text("רולר", "Ролики", "Roller"),
        id: "sportek-yahalom-roller-open",
        inventoryKind: "open_play",
        maxAge: 99,
        minAge: 0,
        mode: "mirror",
        participantNote: text(
          "שטח ציבורי חינמי; מספר המקומות הוא עומס משוער.",
          "Бесплатная публичная зона; места показывают оценку загрузки.",
          "Free public space; places show estimated load.",
        ),
        priceNis: 0,
        remaining: 11,
        sourceUrl: sourceUrls.netanyaMunicipality,
        spaceId: "sportek-yahalom-roller-court",
        sportCode: "roller_skating",
        syncStatus: "fresh",
        time: "17:00-23:00",
        title: text("רולר ציבורי", "Публичные ролики", "Public roller skating"),
      }),
    ],
    source: {
      checkedAt,
      confidence: "official_info",
      name: netanyaMunicipality,
      url: sourceUrls.netanyaMunicipality,
    },
    sport: text("רולר, כדורסל ופוטסל", "Ролики, баскетбол и футзал", "Roller, basketball, and futsal"),
    sports: [
      text("רולר", "Ролики", "Roller skating"),
      text("כדורסל", "Баскетбол", "Basketball"),
      text("קטרגל", "Футзал", "Futsal"),
    ],
    status: "needsConfirmation",
    summary: text(
      "ספורטק ציבורי עם רולר ומגרשים משולבים. מתאים לחיפוש משפחתי וחינמי.",
      "Общественный спортпарк с роликами и универсальными площадками. Подходит для бесплатного семейного отдыха.",
      "Public sportek with roller and combined courts. Useful for free family activity search.",
    ),
    tone: "warning",
  },
  {
    accessibility: "unknown",
    address: text("המורן 7", "HaMoran 7", "HaMoran 7"),
    audience: text("ילדים מגיל 3, שיעורים פרטיים ומאסטרס", "Дети с 3 лет, индивидуальные занятия и взрослые группы", "Children from age 3, private lessons, and masters"),
    id: "olimp-swimming-netanya",
    bookingMethod: "external_registration",
    confidenceScore: 84,
    coordinates: facilityCoordinates.olimpSwimmingNetanya,
    externalRegistrationUrl: sourceUrls.olimp,
    features: ["kids", "swimming", "online_booking"],
    sourceNotes: text(
      "שחייה מגיל 3, קבוצות, שיעורים פרטיים ותחרותי לפי אתר רשמי.",
      "Плавание с 3 лет, группы, индивидуальные занятия и спортивная подготовка по официальному сайту.",
      "Age 3+, groups, private lessons, and competitive swimming per official site.",
    ),
    sourceType: "partner_site",
    verificationStatus: "live_registration",
    images: [
      {
        alt: text("בריכת שחייה", "Бассейн", "Swimming pool"),
        sourceUrl: sourceUrls.olimp,
        src: images.swimming,
      },
    ],
    kind: "program",
    lighting: "unknown",
    mode: "request",
    name: text("אולימפ - מועדון שחייה נתניה", "Olimp - школа плавания Нетания", "Olimp Swimming Club Netanya"),
    neighborhood: text("קריית השרון", "Кирьят ха-Шарон", "Kiryat HaSharon"),
    parking: "unknown",
    primarySlotId: "olimp-children-swimming-slot",
    searchTerms: ["olimp", "swimming", "private lesson", "masters", "плавание", "дети"],
    spaces: [
      {
        capacity: 12,
        description: text("קבוצות שחייה ושיעורים פרטיים", "Группы плавания и индивидуальные занятия", "Swimming groups and private lessons"),
        id: "olimp-swim-lanes",
        indoor: true,
        name: text("מסלולי שחייה", "Дорожки бассейна", "Swim lanes"),
        sports: ["swimming"],
        surface: text("מים", "Вода", "Water"),
      },
    ],
    coaches: [
      {
        bio: text("צוות מדריכי שחייה; שיוך מדריך ספציפי דורש אישור.", "Команда тренеров по плаванию; конкретного тренера нужно подтвердить.", "Swimming coaching team; specific coach assignment needs confirmation."),
        id: "coach-olimp-team",
        languages: ["עברית", "Русский"],
        maxAge: 120,
        minAge: 3,
        name: text("צוות אולימפ", "Команда Olimp", "Olimp team"),
        sourceUrl: sourceUrls.olimp,
        sportCodes: ["swimming"],
      },
    ],
    programs: [
      {
        bookingMethod: "external_registration",
        confidenceScore: 84,
        coachId: "coach-olimp-team",
        description: text("קבוצות שחייה לילדים, שיעורים פרטיים ומאסטרס.", "Группы плавания для детей, индивидуальные занятия и взрослые группы.", "Children groups, private lessons, and masters swimming."),
        externalRegistrationUrl: sourceUrls.olimp,
        id: "program-olimp-children-swimming",
        maxAge: 120,
        minAge: 3,
        paymentMethod: "external_payment",
        recurrence: text("הרשמה עונתית", "Набор на сезон", "Season registration"),
        remaining: 3,
        spaceId: "olimp-swim-lanes",
        sportCode: "swimming",
        title: text("שחייה לילדים ומאסטרס", "Плавание для детей и masters", "Children and masters swimming"),
        verificationStatus: "live_registration",
      },
    ],
    slots: [
      slot({
        ageRange: text("3+", "3+", "3+"),
        capacity: 8,
        confidence: "manual_review",
        date: "2026-06-24",
        day: text("לפי קבוצה", "По группе", "By group"),
        durationMinutes: 45,
        group: text("קבוצת שחייה", "Группа плавания", "Swimming group"),
        id: "olimp-children-swimming-slot",
        instructor: text("צוות אולימפ", "Команда Olimp", "Olimp team"),
        inventoryKind: "group_class",
        maxAge: 120,
        minAge: 3,
        mode: "request",
        participantNote: text(
          "מקום בקבוצת שחייה לפי גיל ורמה; נדרש אישור לפני הזמנה.",
          "Место в группе по возрасту и уровню; нужна проверка перед бронью.",
          "Swimming group seat by age and level; confirmation required before booking.",
        ),
        remaining: 3,
        sourceUrl: sourceUrls.olimp,
        spaceId: "olimp-swim-lanes",
        sportCode: "swimming",
        syncStatus: "stale",
        time: "17:00",
        title: text("קבוצת שחייה לילדים", "Группа плавания для детей", "Children swimming group"),
      }),
      slot({
        ageRange: text("3+", "3+", "3+"),
        capacity: 1,
        confidence: "manual_review",
        date: "2026-06-24",
        day: text("לפי זמינות", "По наличию", "By availability"),
        durationMinutes: 30,
        group: text("שיעור פרטי", "Частный урок", "Private lesson"),
        id: "olimp-private-swim-slot",
        instructor: text("צוות אולימפ", "Команда Olimp", "Olimp team"),
        inventoryKind: "coach_session",
        maxAge: 120,
        minAge: 3,
        mode: "request",
        participantNote: text(
          "שיעור פרטי תופס מדריך/מסלול אחד; המשתתף הוא תלמיד אחד.",
          "Частный урок занимает тренера/дорожку; участник один ученик.",
          "Private lesson occupies one coach/lane; participant is one student.",
        ),
        remaining: 1,
        sourceUrl: sourceUrls.olimp,
        spaceId: "olimp-swim-lanes",
        sportCode: "swimming",
        syncStatus: "stale",
        time: "18:00",
        title: text("שיעור שחייה פרטי", "Частный урок плавания", "Private swimming lesson"),
      }),
    ],
    source: {
      checkedAt,
      confidence: "manual_review",
      name: text("אולימפ", "Olimp", "Olimp"),
      url: sourceUrls.olimp,
    },
    sport: text("שחייה", "Плавание", "Swimming"),
    sports: [text("שחייה", "Плавание", "Swimming")],
    status: "needsConfirmation",
    summary: text(
      "מועדון שחייה חי עם קבוצות, שיעורים פרטיים ומאסטרס; דורש ייבוא לוח לפי גיל ורמה.",
      "Действующий клуб плавания с группами и индивидуальными занятиями; расписание нужно уточнять по возрасту и уровню.",
      "Live swim club with groups, private lessons, and masters; needs timetable import by age and level.",
    ),
    tone: "info",
  },
  {
    accessibility: "unknown",
    address: text("שולמית 3", "Шуламит 3", "Shulamit 3"),
    audience: text("מבוגרים, ילדים ונוער", "Взрослые, дети и подростки", "Adults, children, and youth"),
    id: "crossfit-green-beach",
    bookingMethod: "external_registration",
    confidenceScore: 84,
    coordinates: facilityCoordinates.crossfitGreenBeach,
    externalRegistrationUrl: sourceUrls.crossfitGreenBeach,
    features: ["kids", "online_booking"],
    sourceNotes: text(
      "מקור רשמי עם ילדים/נוער ותוכניות כוח.",
      "Официальная страница с детскими, подростковыми и силовыми программами.",
      "Official source with kids/youth and strength programs.",
    ),
    sourceType: "partner_site",
    verificationStatus: "live_registration",
    images: [
      {
        alt: text("רחבת אימון פונקציונלי", "Функциональная тренировочная зона", "Functional training floor"),
        sourceUrl: sourceUrls.crossfitGreenBeach,
        src: images.functionalFitness,
      },
    ],
    kind: "sport_center",
    lighting: true,
    mode: "request",
    name: text("קרוספיט גרין ביץ'", "CrossFit Green Beach", "CrossFit Green Beach"),
    neighborhood: text("פולג / גרין ביץ'", "Полег / Green Beach", "Poleg / Green Beach"),
    parking: "unknown",
    primarySlotId: "crossfit-green-beach-kids-slot",
    searchTerms: ["crossfit", "fitness", "kids", "hyrox", "weightlifting", "gymnastics", "кроссфит", "фитнес"],
    spaces: [
      {
        capacity: 16,
        description: text("אימון קרוספיט indoor/outdoor", "Тренировки CrossFit indoor/outdoor", "Indoor/outdoor CrossFit training"),
        id: "crossfit-green-beach-floor",
        indoor: false,
        name: text("רחבת אימון", "Тренировочная зона", "Training floor"),
        sports: ["crossfit", "fitness", "gymnastics", "hyrox", "weightlifting"],
        surface: text("משטח פונקציונלי", "Функциональное покрытие", "Functional surface"),
      },
    ],
    coaches: [
      {
        bio: text("צוות קרוספיט, ילדים ונוער.", "Команда CrossFit, дети и подростки.", "CrossFit, kids, and youth coaching team."),
        id: "coach-crossfit-green-beach-team",
        languages: ["עברית", "English"],
        maxAge: 99,
        minAge: 6,
        name: text("צוות קרוספיט גרין ביץ'", "Команда CrossFit Green Beach", "CrossFit Green Beach team"),
        sourceUrl: sourceUrls.crossfitGreenBeach,
        sportCodes: ["crossfit"],
      },
    ],
    programs: [
      {
        bookingMethod: "external_registration",
        confidenceScore: 84,
        coachId: "coach-crossfit-green-beach-team",
        description: text("קבוצות קרוספיט לילדים ונוער.", "Группы CrossFit для детей и подростков.", "CrossFit groups for children and youth."),
        externalRegistrationUrl: sourceUrls.crossfitGreenBeach,
        id: "program-crossfit-green-beach-kids",
        maxAge: 17,
        minAge: 6,
        paymentMethod: "external_payment",
        recurrence: text("לפי מערכת המועדון", "По расписанию клуба", "By club timetable"),
        remaining: 5,
        spaceId: "crossfit-green-beach-floor",
        sportCode: "crossfit",
        title: text("קרוספיט ילדים ונוער", "CrossFit дети и подростки", "CrossFit kids and youth"),
        verificationStatus: "live_registration",
      },
    ],
    slots: [
      slot({
        ageRange: text("6-17", "6-17", "6-17"),
        capacity: 12,
        confidence: "manual_review",
        date: "2026-06-22",
        day: text("לפי מערכת", "По расписанию", "By timetable"),
        durationMinutes: 45,
        group: text("ילדים ונוער", "Дети и подростки", "Kids and youth"),
        id: "crossfit-green-beach-kids-slot",
        instructor: text("צוות קרוספיט", "Команда CrossFit", "CrossFit team"),
        inventoryKind: "group_class",
        maxAge: 17,
        minAge: 6,
        mode: "request",
        participantNote: text(
          "מקום בקבוצת ילדים/נוער; נדרש אישור לפני הזמנה.",
          "Место в детской/подростковой группе; нужна проверка перед бронью.",
          "Seat in a kids/youth group; confirmation required before booking.",
        ),
        remaining: 5,
        sourceUrl: sourceUrls.crossfitGreenBeach,
        spaceId: "crossfit-green-beach-floor",
        sportCode: "crossfit",
        syncStatus: "stale",
        time: "19:00",
        title: text("קרוספיט ילדים ונוער", "CrossFit дети и подростки", "CrossFit kids and youth"),
      }),
      slot({
        ageRange: text("לפי מערכת המועדון", "Уточнить в клубе", "Confirm with club"),
        capacity: 1,
        confidence: "manual_review",
        date: "2026-06-19",
        day: text("לוח זמנים לבדיקה", "Расписание уточнить", "Schedule to confirm"),
        durationMinutes: 60,
        group: text("אימון פונקציונלי", "Функциональная тренировка", "Functional training"),
        id: "crossfit-green-beach-hyrox-catalog-slot",
        instructor: text("צוות קרוספיט", "Команда CrossFit", "CrossFit team"),
        inventoryKind: "group_class",
        maxAge: 99,
        minAge: 16,
        mode: "mirror",
        participantNote: text(
          "נוסף מקטלוג Netanya 2026; נדרש אימות לפני הרשמה.",
          "Добавлено из каталога Netanya 2026; перед записью нужно подтвердить расписание.",
          "Added from the 2026 Netanya catalog; timetable must be confirmed before registration.",
        ),
        priceNis: 0,
        remaining: 1,
        sourceUrl: sourceUrls.crossfitGreenBeach,
        spaceId: "crossfit-green-beach-floor",
        sportCode: "hyrox",
        syncStatus: "stale",
        time: "ללא שעה קבועה",
        title: text("HYROX", "HYROX — уточнить", "HYROX — confirm"),
      }),
      slot({
        ageRange: text("לפי מערכת המועדון", "Уточнить в клубе", "Confirm with club"),
        capacity: 1,
        confidence: "manual_review",
        date: "2026-06-19",
        day: text("לוח זמנים לבדיקה", "Расписание уточнить", "Schedule to confirm"),
        durationMinutes: 60,
        group: text("אימון כוח", "Силовая тренировка", "Strength training"),
        id: "crossfit-green-beach-weightlifting-catalog-slot",
        instructor: text("צוות קרוספיט", "Команда CrossFit", "CrossFit team"),
        inventoryKind: "group_class",
        maxAge: 99,
        minAge: 16,
        mode: "mirror",
        participantNote: text(
          "נוסף מקטלוג Netanya 2026; נדרש אימות לפני הרשמה.",
          "Добавлено из каталога Netanya 2026; перед записью нужно подтвердить расписание.",
          "Added from the 2026 Netanya catalog; timetable must be confirmed before registration.",
        ),
        priceNis: 0,
        remaining: 1,
        sourceUrl: sourceUrls.crossfitGreenBeach,
        spaceId: "crossfit-green-beach-floor",
        sportCode: "weightlifting",
        syncStatus: "stale",
        time: "ללא שעה קבועה",
        title: text("הרמת משקולות", "Тяжелая атлетика — уточнить", "Weightlifting — confirm"),
      }),
    ],
    source: {
      checkedAt,
      confidence: "manual_review",
      name: text("קרוספיט גרין ביץ'", "CrossFit Green Beach", "CrossFit Green Beach"),
      url: sourceUrls.crossfitGreenBeach,
    },
    sport: text("קרוספיט וכושר", "Кроссфит и фитнес", "CrossFit and fitness"),
    sports: [text("קרוספיט", "Кроссфит", "CrossFit"), text("כושר", "Фитнес", "Fitness")],
    status: "needsConfirmation",
    summary: text(
      "מועדון קרוספיט חי עם מסלולי ילדים/נוער ומבוגרים; מתאים להרשמה חיצונית ובהמשך API.",
      "Действующий клуб CrossFit с детскими, подростковыми и взрослыми группами. Регистрация пока проходит на сайте клуба.",
      "Live CrossFit box with kids/youth and adult tracks; external registration now, API later.",
    ),
    tone: "info",
  },
  {
    accessibility: "unknown",
    address: text("נתניה", "Нетания", "Netanya"),
    audience: text("ילדים 4-16", "Дети 4-16", "Children 4-16"),
    id: "maccabi-netanya-football-school",
    bookingMethod: "contact_request",
    confidenceScore: 58,
    coordinates: facilityCoordinates.maccabiNetanyaFootballSchool,
    features: ["kids"],
    sourceNotes: text(
      "דף רישום עונתי פעיל לכאורה, אך יש לבדוק סתירת תאריכים.",
      "Набор на сезон выглядит активным, но даты нужно уточнить.",
      "Season registration appears active, but dates conflict.",
    ),
    sourceType: "sports_association",
    verificationStatus: "needs_verification",
    images: [
      {
        alt: text("אימון כדורגל", "Футбольная тренировка", "Football training"),
        sourceUrl: sourceUrls.netanyaMunicipality,
        src: images.footballField,
      },
    ],
    kind: "program",
    lighting: "unknown",
    mode: "request",
    name: text("מכבי נתניה - בית ספר לכדורגל", "Maccabi Netanya - футбольная школа", "Maccabi Netanya Football School"),
    neighborhood: text("נתניה", "Нетания", "Netanya"),
    parking: "unknown",
    primarySlotId: "maccabi-netanya-football-school-slot",
    searchTerms: ["maccabi netanya", "football school", "soccer", "футбол", "дети", "מכבי נתניה"],
    spaces: [
      {
        capacity: 18,
        description: text("בית ספר לכדורגל וקבוצות גיל", "Футбольная школа и возрастные группы", "Football school and age groups"),
        id: "maccabi-netanya-football-training",
        indoor: false,
        name: text("מגרש אימון", "Тренировочное поле", "Training field"),
        sports: ["football"],
        surface: text("דשא / סינתטי", "Трава / синтетика", "Grass / synthetic"),
      },
    ],
    programs: [
      {
        bookingMethod: "contact_request",
        confidenceScore: 58,
        description: text("בית ספר לכדורגל לגילים צעירים; דורש אימות תאריכי עונה.", "Футбольная школа для младших возрастов; даты сезона требуют проверки.", "Football school for young age groups; season dates need verification."),
        id: "program-maccabi-netanya-football-school",
        maxAge: 16,
        minAge: 4,
        paymentMethod: "unknown",
        recurrence: text("עונת 2025-2026 - לבדיקה", "Сезон 2025-2026 - проверить", "2025-2026 season - verify"),
        remaining: 8,
        spaceId: "maccabi-netanya-football-training",
        sportCode: "football",
        title: text("בית ספר לכדורגל", "Футбольная школа", "Football school"),
        verificationStatus: "needs_verification",
      },
    ],
    slots: [
      slot({
        ageRange: text("4-16", "4-16", "4-16"),
        capacity: 18,
        confidence: "manual_review",
        date: "2026-06-23",
        day: text("עונתי - לבדיקה", "Сезонно - проверить", "Seasonal - verify"),
        durationMinutes: 60,
        group: text("בית ספר לכדורגל", "Футбольная школа", "Football school"),
        id: "maccabi-netanya-football-school-slot",
        inventoryKind: "group_class",
        maxAge: 16,
        minAge: 4,
        mode: "request",
        participantNote: text(
          "לא להציג כהזמנה אונליין עד אימות תאריכי העונה והרשמה.",
          "Не показывать как онлайн-бронь до проверки дат сезона и регистрации.",
          "Do not show as online booking until season dates and registration are verified.",
        ),
        remaining: 8,
        sourceUrl: sourceUrls.netanyaMunicipality,
        spaceId: "maccabi-netanya-football-training",
        sportCode: "football",
        syncStatus: "conflicting",
        time: "אחה\"צ",
        title: text("בית ספר לכדורגל - לבדיקה", "Футбольная школа - проверить", "Football school - verify"),
      }),
    ],
    source: {
      checkedAt,
      confidence: "manual_review",
      name: text("מכבי נתניה / מקור עירוני", "Maccabi Netanya / муниципальная страница", "Maccabi Netanya / municipal source"),
      url: sourceUrls.netanyaMunicipality,
    },
    sport: text("כדורגל", "Футбол", "Football"),
    sports: [text("כדורגל", "Футбол", "Football")],
    status: "needsConfirmation",
    summary: text(
      "מועדון פעיל, אבל תאריכי ההרשמה דורשים אימות ידני לפני הצגה כ-live registration.",
      "Клуб активен, но даты набора нужно уточнить перед публикацией онлайн-заявки.",
      "Active club, but registration dates need manual review before live-registration display.",
    ),
    tone: "danger",
  },
];

export const facilities: FacilityPreview[] = [...curatedFacilities, ...netanyaCatalogFacilities];

export type DataVerificationTaskPreview = {
  facilityId?: string;
  id: string;
  notes: LocalizedText;
  organizationLabel?: LocalizedText;
  priority: "critical" | "high" | "medium";
  sourceUrl: string;
  status: "open";
  title: LocalizedText;
};

export const dataVerificationTasks: DataVerificationTaskPreview[] = [
  {
    facilityId: "top-padel-ir-yamim",
    id: "verify-top-padel-booking-sync",
    notes: text("בדוק אם ניתן לקבל לוח זמנים וקובץ זמינות לפני פתיחת הזמנה מקומית.", "Уточнить, можно ли получать расписание и подтверждение свободного времени от Top Padel.", "Check timetable/export access and confirmation state before enabling local online booking."),
    priority: "critical",
    sourceUrl: sourceUrls.topPadel,
    status: "open",
    title: text("אימות סנכרון Top Padel", "Проверить расписание Top Padel", "Verify Top Padel sync"),
  },
  {
    facilityId: "collegym-netanya",
    id: "verify-collegym-dedupe",
    notes: text("אחד את Collegym ו-Sports Center at Netanya Academic College כישות אחת אם זה אותו מפעיל.", "Проверить, не один ли это центр с разными названиями.", "Merge Collegym and Netanya Academic College Sports Center if they are the same operator."),
    priority: "high",
    sourceUrl: sourceUrls.collegym,
    status: "open",
    title: text("בדיקת כפילות Collegym", "Проверить карточку Collegym", "Check Collegym duplicate"),
  },
  {
    facilityId: "winter-lake-sports-park",
    id: "verify-winter-lake-futsal-rules",
    notes: text("אשר אם הפוטסל דורש הזמנה מוקדמת ומהי דרך ההזמנה העירונית.", "Подтвердить, нужна ли предварительная бронь футзала и как она работает.", "Confirm whether futsal requires advance booking and the municipal booking path."),
    priority: "high",
    sourceUrl: sourceUrls.netanyaMunicipality,
    status: "open",
    title: text("כללי הזמנה באגם החורף", "Правила брони Winter Lake", "Winter Lake booking rules"),
  },
  {
    facilityId: "sportek-yahalom",
    id: "verify-sportek-yahalom-hours",
    notes: text("אמת שעות תאורה 17:00-23:00, זמינות רולר ומגרש משולב.", "Проверить освещение 17:00-23:00, роликовую зону и универсальную площадку.", "Verify lighting hours 17:00-23:00, roller court, and combined court availability."),
    priority: "medium",
    sourceUrl: sourceUrls.netanyaMunicipality,
    status: "open",
    title: text("אימות ספורטק יהלום", "Проверить Sportek Yahalom", "Verify Sportek Yahalom"),
  },
  {
    facilityId: "olimp-swimming-netanya",
    id: "verify-olimp-swim-schedule",
    notes: text("קבל לוח קבוצות לפי גיל, זמני אימון אישי ודרך אישור הזמנה.", "Получить расписание групп по возрастам, время индивидуальных занятий и способ подтверждения брони.", "Get age-group timetable, personal coaching times, and booking confirmation path."),
    priority: "high",
    sourceUrl: sourceUrls.olimp,
    status: "open",
    title: text("אימות לוח שחייה Olimp", "Проверить расписание Olimp", "Verify Olimp swimming timetable"),
  },
  {
    facilityId: "maccabi-netanya-football-school",
    id: "verify-maccabi-season-dates",
    notes: text("בדוק סתירות בין דף הרשמה עונתי לתאריכי העונה לפני הצגה כ-live registration.", "Проверить даты сезонного набора перед публикацией онлайн-заявки.", "Check seasonal registration date conflicts before showing as live registration."),
    priority: "critical",
    sourceUrl: sourceUrls.netanyaMunicipality,
    status: "open",
    title: text("אימות תאריכי מכבי נתניה", "Проверить даты Maccabi Netanya", "Verify Maccabi Netanya dates"),
  },
  {
    id: "verify-regaim-import-feed",
    notes: text("מצא דרך ייבוא Hugim/Regaim לעונה 2025-2026: גיל, מחיר, מרכז, קישור הרשמה.", "Получить сведения Hugim/Regaim на сезон 2025-2026: возраст, стоимость, центр и ссылка на регистрацию.", "Find Hugim/Regaim import path for 2025-2026: age, price, center, registration link."),
    organizationLabel: text("רגעים", "Regaim", "Regaim"),
    priority: "high",
    sourceUrl: sourceUrls.regaim,
    status: "open",
    title: text("ייבוא חוגי Regaim", "Импорт кружков Regaim", "Import Regaim classes"),
  },
];

export function getFacilityById(id: string) {
  return facilities.find((facility) => facility.id === id);
}

export function getFacilitySlotById(facilityId: string, slotId: string) {
  return getFacilityById(facilityId)?.slots.find((slotItem) => slotItem.id === slotId);
}

export function getPrimarySlot(facility: FacilityPreview): FacilitySlot {
  const primarySlot =
    facility.slots.find((slotItem) => slotItem.id === facility.primarySlotId) ??
    facility.slots[0];

  if (!primarySlot) {
    throw new Error(`Facility ${facility.id} has no slots`);
  }

  return primarySlot;
}

function slotDateTime(slotItem: FacilitySlot) {
  const timeMatch = /^(\d{1,2}):(\d{2})/.exec(slotItem.time);
  const hours = timeMatch?.[1] ? Number(timeMatch[1]) : 12;
  const minutes = timeMatch?.[2] ? Number(timeMatch[2]) : 0;

  return new Date(`${slotItem.date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00+03:00`);
}

function slotTimeMinutes(slotItem: FacilitySlot) {
  const timeMatch = /^(\d{1,2}):(\d{2})/.exec(slotItem.time);

  if (!timeMatch?.[1] || !timeMatch?.[2]) {
    return null;
  }

  return Number(timeMatch[1]) * 60 + Number(timeMatch[2]);
}

export function formatSlotTime(slotItem: FacilitySlot, locale: Locale) {
  const localizedTime: Record<string, Record<Locale, string>> = {
    "אחה\"צ": {
      en: "Afternoon",
      he: "אחה\"צ",
      ru: "После обеда",
    },
    "לפי גיל": {
      en: "By age",
      he: "לפי גיל",
      ru: "По возрасту",
    },
    "ללא שעה קבועה": {
      en: "No fixed time",
      he: "ללא שעה קבועה",
      ru: "Без фиксированного времени",
    },
    "עד 01:00": {
      en: "Until 01:00",
      he: "עד 01:00",
      ru: "До 01:00",
    },
  };

  return localizedTime[slotItem.time]?.[locale] ?? slotItem.time;
}

export function formatDurationMinutes(durationMinutes: number, locale: Locale) {
  return {
    en: `${durationMinutes} min`,
    he: `${durationMinutes} דק׳`,
    ru: `${durationMinutes} мин`,
  }[locale];
}

export function isSlotCapacityTracked(slotItem: FacilitySlot) {
  if (slotItem.mode === "mirror" && slotItem.priceNis === 0) {
    return false;
  }

  return true;
}

export function formatSlotAvailability(slotItem: FacilitySlot, locale: Locale) {
  if (!isSlotCapacityTracked(slotItem)) {
    if (slotItem.inventoryKind !== "open_play" && slotItem.inventoryKind !== "court_rental") {
      return {
        en: "Schedule to confirm",
        he: "לוח זמנים לבדיקה",
        ru: "Расписание уточнить",
      }[locale];
    }

    return {
      en: "Open to public",
      he: "פתוח לציבור",
      ru: "Открыто для публики",
    }[locale];
  }

  return `${slotItem.remaining} ${getAvailabilityUnit(slotItem, locale)}`;
}

export function getSlotConflicts(facility: FacilityPreview, sourceSlot: FacilitySlot) {
  const sourceStart = slotTimeMinutes(sourceSlot);
  const sourceSpace = sourceSlot.spaceId;

  if (!sourceSpace || sourceStart === null) {
    return [];
  }

  const sourceEnd = sourceStart + sourceSlot.durationMinutes;

  return facility.slots.filter((candidate) => {
    if (candidate.id === sourceSlot.id || candidate.spaceId !== sourceSpace || candidate.date !== sourceSlot.date) {
      return false;
    }

    const candidateStart = slotTimeMinutes(candidate);

    if (candidateStart === null) {
      return false;
    }

    const candidateEnd = candidateStart + candidate.durationMinutes;

    return sourceStart < candidateEnd && candidateStart < sourceEnd;
  });
}

function ageOverlaps(source: FacilitySlot, candidate: FacilitySlot) {
  const sourceMin = source.minAge ?? 0;
  const sourceMax = source.maxAge ?? 99;
  const candidateMin = candidate.minAge ?? 0;
  const candidateMax = candidate.maxAge ?? 99;

  return sourceMin <= candidateMax && candidateMin <= sourceMax;
}

function alternativeRank(source: FacilitySlot, candidate: FacilitySlot) {
  const sourceTime = slotDateTime(source).getTime();
  const candidateTime = slotDateTime(candidate).getTime();
  const sameDateBonus = candidate.date === source.date ? 0 : 1000 * 60 * 60 * 3;
  const sameCoachBonus =
    candidate.instructor?.en === source.instructor?.en || candidate.group.en === source.group.en
      ? 0
      : 1000 * 60 * 60 * 6;

  return Math.abs(candidateTime - sourceTime) + sameDateBonus + sameCoachBonus;
}

export function getAlternativeSlots(
  facility: FacilityPreview,
  sourceSlotId: string,
  limit = 3,
): FacilitySlot[] {
  const sourceSlot = getFacilitySlotById(facility.id, sourceSlotId);

  if (!sourceSlot) {
    return [];
  }

  return facility.slots
    .filter((slotItem) => slotItem.id !== sourceSlot.id)
    .filter((slotItem) => slotItem.inventoryKind === sourceSlot.inventoryKind)
    .filter((slotItem) => slotItem.remaining > 0)
    .filter((slotItem) => ageOverlaps(sourceSlot, slotItem))
    .sort((left, right) => alternativeRank(sourceSlot, left) - alternativeRank(sourceSlot, right))
    .slice(0, limit);
}

export function getCatalogStats() {
  const slots = facilities.flatMap((facility) => facility.slots);
  const paidSlots = slots.filter((slotItem) => typeof slotItem.priceNis === "number" && slotItem.priceNis > 0);
  const averagePrice =
    paidSlots.length === 0
      ? 0
      : Math.round(paidSlots.reduce((sum, slotItem) => sum + (slotItem.priceNis ?? 0), 0) / paidSlots.length);

  return {
    averagePrice,
    facilities: facilities.length,
    todayOptions: slots.length,
    verifiedSlots: slots.filter((slotItem) =>
      ["live_inventory", "operator_confirmed", "manual_review"].includes(slotItem.confidence),
    ).length,
  };
}

function normalizeFilter<T extends string>(value: string | undefined, allowed: readonly T[], fallback: T) {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function getAvailableSportCodes() {
  return [
    ...new Set(
      facilities.flatMap((facility) =>
        facility.slots
          .filter((slotItem) => slotItem.remaining > 0)
          .map((slotItem) => slotItem.sportCode)
          .filter((code): code is SportCode => code !== undefined),
      ),
    ),
  ];
}

function normalizeIntentFilter(value: string | undefined): IntentFilter {
  if (value === "court_rental" || value === "open_play" || value === "space_rental") {
    return "space_rental";
  }

  return normalizeFilter(value, ["all", "coach_session", "group_class"], "all");
}

export function normalizeSearchFilters(filters: FacilitySearchFilters): NormalizedFacilitySearchFilters {
  return {
    age: normalizeFilter(filters.age, ["all", "kids", "teens", "adults"], "all"),
    date: filters.date?.trim() ?? "",
    feature: normalizeFilter(
      filters.feature,
      ["all", "adapted", "available_today", "free_public", "kids", "online_booking", "skate_roller", "swimming"],
      "all",
    ),
    intent: normalizeIntentFilter(filters.intent),
    onlineOnly: filters.online === "1" || filters.online === "true",
    query: filters.query?.trim() ?? "",
    sport: normalizeFilter(filters.sport, ["all", ...getAvailableSportCodes()], "all"),
  };
}

function getNormalizedSearchFilters(
  filters: FacilitySearchFilters | NormalizedFacilitySearchFilters,
): NormalizedFacilitySearchFilters {
  return "onlineOnly" in filters ? filters : normalizeSearchFilters(filters);
}

function ageMatches(slotItem: FacilitySlot, age: AgeFilter) {
  if (age === "all") {
    return true;
  }

  const minAge = slotItem.minAge ?? 0;
  const maxAge = slotItem.maxAge ?? 99;

  if (age === "kids") {
    return minAge <= 12 && maxAge >= 4;
  }

  if (age === "teens") {
    return minAge <= 17 && maxAge >= 13;
  }

  return maxAge >= 18;
}

function isOnlineBookable(slotItem: FacilitySlot) {
  return (
    slotItem.mode === "payment" &&
    ["live_inventory", "manual_review", "operator_confirmed"].includes(slotItem.confidence)
  );
}

function featureMatches(facility: FacilityPreview, feature: FeatureFilter) {
  if (feature === "all") {
    return true;
  }

  if (feature === "available_today") {
    return facility.slots.some((slotItem) => slotItem.date === checkedAt && slotItem.remaining > 0);
  }

  return facility.features?.includes(feature) ?? false;
}

function getFacilitySportCodes(facility: FacilityPreview) {
  const slotCodes = facility.slots
    .map((slotItem) => slotItem.sportCode)
    .filter((code): code is SportCode => code !== undefined);
  const spaceCodes = facility.spaces?.flatMap((space) => space.sports) ?? [];
  const coachCodes = facility.coaches?.flatMap((coach) => coach.sportCodes) ?? [];
  const programCodes = facility.programs?.map((program) => program.sportCode) ?? [];
  const openMatchCodes = facility.openMatches?.map((match) => match.sportCode) ?? [];

  return [...new Set([...spaceCodes, ...slotCodes, ...coachCodes, ...programCodes, ...openMatchCodes])];
}

function sportMatches(slotItem: FacilitySlot, sport: SportFilter) {
  if (sport === "all") {
    return true;
  }

  return slotItem.sportCode === sport;
}

export function getMatchingSlots(
  facility: FacilityPreview,
  filters: FacilitySearchFilters | NormalizedFacilitySearchFilters,
) {
  const normalized = getNormalizedSearchFilters(filters);

  if (!featureMatches(facility, normalized.feature)) {
    return [];
  }

  return facility.slots.filter((slotItem) => {
    const matchesIntent =
      normalized.intent === "all" ||
      (normalized.intent === "space_rental"
        ? slotItem.inventoryKind === "court_rental" || slotItem.inventoryKind === "open_play"
        : slotItem.inventoryKind === normalized.intent);
    const matchesAge = ageMatches(slotItem, normalized.age);
    const matchesDate = !normalized.date || slotItem.date === normalized.date;
    const matchesOnline = !normalized.onlineOnly || isOnlineBookable(slotItem);
    const matchesSport = sportMatches(slotItem, normalized.sport);

    return matchesIntent && matchesAge && matchesDate && matchesOnline && matchesSport;
  });
}

export function getAvailabilityUnit(slotItem: FacilitySlot, locale: Locale) {
  if (slotItem.inventoryKind === "court_rental") {
    return {
      en: "courts left",
      he: "מגרשים זמינים",
      ru: "кортов доступно",
    }[locale];
  }

  return {
    en: "seats left",
    he: "מקומות פנויים",
    ru: "мест свободно",
  }[locale];
}

export function getVerificationTone(facility: FacilityPreview) {
  switch (facility.verificationStatus) {
    case "live_bookable":
      return "success";
    case "live_registration":
      return "info";
    case "active_contact_only":
      return "info";
    case "needs_verification":
      return "danger";
    case "archived_closed":
      return "neutral";
    case "info_only":
    default:
      return "warning";
  }
}

export function searchFacilities(
  filters: FacilitySearchFilters | NormalizedFacilitySearchFilters,
  locale: Locale,
) {
  const normalized = getNormalizedSearchFilters(filters);
  const normalizedQuery = normalized.query.toLocaleLowerCase(locale);

  return facilities.filter((facility) => {
    const matchingSlots = getMatchingSlots(facility, normalized);

    if (matchingSlots.length === 0) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const values = [
      facility.name[locale],
      facility.neighborhood[locale],
      facility.address[locale],
      facility.audience[locale],
      facility.sport[locale],
      facility.summary[locale],
      facility.sourceNotes?.[locale] ?? "",
      facility.verificationStatus ?? "",
      facility.bookingMethod ?? "",
      facility.sourceType ?? "",
      ...facility.sports.map((sport) => sport[locale]),
      ...facility.searchTerms,
      ...(facility.spaces?.flatMap((space) => [
        space.name[locale],
        space.description?.[locale] ?? "",
        space.surface?.[locale] ?? "",
        ...space.sports.map((code) => sportLabels[code][locale]),
      ]) ?? []),
      ...(facility.coaches?.flatMap((coach) => [
        coach.name[locale],
        coach.bio[locale],
        ...coach.languages,
        ...coach.sportCodes.map((code) => sportLabels[code][locale]),
      ]) ?? []),
      ...(facility.programs?.flatMap((program) => [
        program.title[locale],
        program.description[locale],
        program.recurrence[locale],
        sportLabels[program.sportCode][locale],
      ]) ?? []),
      ...(facility.openMatches?.flatMap((match) => [
        match.title[locale],
        match.level[locale],
        sportLabels[match.sportCode][locale],
      ]) ?? []),
      ...facility.slots.flatMap((slotItem) => [
        slotItem.ageRange[locale],
        slotItem.date,
        slotItem.day[locale],
        slotItem.group[locale],
        slotItem.instructor?.[locale] ?? "",
        slotItem.participantNote[locale],
        slotItem.school?.[locale] ?? "",
        slotItem.title[locale],
      ]),
    ];

    return values.some((value) => value.toLocaleLowerCase(locale).includes(normalizedQuery));
  });
}

export function getFacilitySportTags(facility: FacilityPreview, locale: Locale) {
  const codes = getFacilitySportCodes(facility);

  if (codes.length > 0) {
    return codes.map((code) => sportLabels[code][locale]);
  }

  return facility.sports.map((sport) => sport[locale]);
}

export function getAvailableSportOptions(
  locale: Locale,
  filters?: FacilitySearchFilters | NormalizedFacilitySearchFilters,
) {
  const optionFilters = filters ? { ...filters, sport: "all" } : undefined;
  const codes = [
    ...new Set(
      facilities.flatMap((facility) => {
        const sourceSlots = optionFilters
          ? getMatchingSlots(facility, optionFilters)
          : facility.slots.filter((slotItem) => slotItem.remaining > 0);

        return sourceSlots
          .map((slotItem) => slotItem.sportCode)
          .filter((code): code is SportCode => code !== undefined);
      }),
    ),
  ]
    .filter((code) => sportLabels[code])
    .sort((left, right) => sportLabels[left][locale].localeCompare(sportLabels[right][locale], locale));

  return codes.map((code) => ({
    label: sportLabels[code][locale],
    value: code,
  }));
}

function getFacilityMapQuery(facility: FacilityPreview, locale: Locale) {
  if (facility.coordinates) {
    return `${facility.coordinates.lat},${facility.coordinates.lng}`;
  }

  return `${facility.name[locale]}, ${facility.address[locale]}, Netanya`;
}

export function getFacilityGoogleMapsUrl(facility: FacilityPreview, locale: Locale) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getFacilityMapQuery(facility, locale))}`;
}

export function getFacilityGoogleMapsEmbedUrl(facility: FacilityPreview, locale: Locale) {
  return `https://www.google.com/maps?q=${encodeURIComponent(getFacilityMapQuery(facility, locale))}&z=15&output=embed`;
}

export function getAvailabilityLines(
  facility: FacilityPreview,
  filters: FacilitySearchFilters | NormalizedFacilitySearchFilters,
  locale: Locale,
  limit = 2,
) {
  const matchingSlots = getMatchingSlots(facility, filters);
  const sourceSlots = matchingSlots.length > 0 ? matchingSlots : facility.slots;

  return sourceSlots.slice(0, limit).map((slotItem) => {
    const sportLabel = slotItem.sportCode ? sportLabels[slotItem.sportCode][locale] : facility.sport[locale];
    return `${sportLabel}: ${slotItem.day[locale]}, ${formatSlotTime(slotItem, locale)} · ${formatSlotAvailability(slotItem, locale)}`;
  });
}

export function getNearestSearchAlternatives(
  filters: FacilitySearchFilters | NormalizedFacilitySearchFilters,
  locale: Locale,
  limit = 4,
) {
  const normalized = getNormalizedSearchFilters(filters);
  const relaxedFilters = { ...normalized, date: "" };
  const targetDate = normalized.date ? new Date(`${normalized.date}T12:00:00+03:00`).getTime() : Date.now();

  return searchFacilities(relaxedFilters, locale)
    .flatMap((facility) =>
      getMatchingSlots(facility, relaxedFilters).map((slotItem) => ({
        facility,
        slot: slotItem,
      })),
    )
    .filter(({ slot: slotItem }) => !normalized.date || slotItem.date !== normalized.date)
    .sort(
      (left, right) =>
        Math.abs(slotDateTime(left.slot).getTime() - targetDate) -
        Math.abs(slotDateTime(right.slot).getTime() - targetDate),
    )
    .slice(0, limit);
}
