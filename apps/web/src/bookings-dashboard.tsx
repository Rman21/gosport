"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Hourglass, Inbox } from "lucide-react";
import { LinkButton, Notice, StatusBadge } from "@sportil/ui";
import type { Locale, StatusTone } from "@sportil/types";
import { authHeaders } from "@/auth-client";

type LocalizedPayload = {
  en: string;
  he: string;
  ru: string;
};

type BookingItem = {
  createdAt: string;
  endsAt: string;
  facility: {
    id: string;
    name: LocalizedPayload;
  };
  id: string;
  kind: "booking" | "hold";
  reference?: string;
  startsAt: string;
  status: "cancelled" | "confirmed" | "expired" | "held" | "refunded" | "released";
  title: LocalizedPayload;
};

type VerificationRequestItem = {
  createdAt: string;
  facility: {
    id: string;
    name: LocalizedPayload;
  } | null;
  id: string;
  kind: "availability_request" | "claim_facility" | "report_wrong_info" | "request_online_booking";
  publicId: string;
  status: "in_progress" | "rejected" | "resolved" | "submitted" | "triaged";
};

type BookingsResponse = {
  data?: {
    items: BookingItem[];
  };
  message?: string;
};

type RequestsResponse = {
  data?: {
    requests: VerificationRequestItem[];
  };
  message?: string;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_SPORTIL_API_BASE_URL ?? "http://localhost:4000/api/v1";

const copy = {
  en: {
    bookings: "Bookings and held places",
    emptyBookings: "No bookings yet. Start from search and reserve a verified time.",
    emptyRequests: "No requests yet. Requests from facility pages will appear here.",
    error: "Could not load your account data.",
    loading: "Loading your bookings",
    requests: "Requests sent to SportIL",
    search: "Find sport",
    status: {
      cancelled: "Cancelled",
      confirmed: "Confirmed",
      expired: "Expired",
      held: "Held",
      in_progress: "In review",
      refunded: "Refunded",
      rejected: "Rejected",
      released: "Released",
      resolved: "Resolved",
      submitted: "Sent",
      triaged: "In queue",
    },
    requestKind: {
      availability_request: "Availability request",
      claim_facility: "Facility claim",
      report_wrong_info: "Correction report",
      request_online_booking: "Online booking request",
    },
  },
  he: {
    bookings: "הזמנות ומקומות שמורים",
    emptyBookings: "עדיין אין הזמנות. התחילו מחיפוש ובחרו זמן מאומת.",
    emptyRequests: "עדיין אין בקשות. בקשות מדפי מתקנים יוצגו כאן.",
    error: "לא ניתן לטעון את אזור המשתמש.",
    loading: "טוענים את ההזמנות",
    requests: "בקשות שנשלחו ל-SportIL",
    search: "חיפוש ספורט",
    status: {
      cancelled: "בוטל",
      confirmed: "אושר",
      expired: "פג תוקף",
      held: "נשמר זמנית",
      in_progress: "בטיפול",
      refunded: "זוכה",
      rejected: "נדחה",
      released: "שוחרר",
      resolved: "טופל",
      submitted: "נשלח",
      triaged: "בתור",
    },
    requestKind: {
      availability_request: "בקשת זמינות",
      claim_facility: "בקשת ניהול מתקן",
      report_wrong_info: "דיווח תיקון",
      request_online_booking: "בקשת הזמנה אונליין",
    },
  },
  ru: {
    bookings: "Брони и удержанные места",
    emptyBookings: "Пока нет броней. Начните с поиска и выберите проверенное время.",
    emptyRequests: "Пока нет заявок. Заявки со страниц объектов появятся здесь.",
    error: "Не удалось загрузить личный раздел.",
    loading: "Загружаем брони",
    requests: "Заявки, отправленные в SportIL",
    search: "Найти спорт",
    status: {
      cancelled: "Отменено",
      confirmed: "Подтверждено",
      expired: "Истекло",
      held: "Удерживается",
      in_progress: "В работе",
      refunded: "Возвращено",
      rejected: "Отклонено",
      released: "Освобождено",
      resolved: "Решено",
      submitted: "Отправлено",
      triaged: "В очереди",
    },
    requestKind: {
      availability_request: "Заявка на доступность",
      claim_facility: "Управление объектом",
      report_wrong_info: "Сообщение об ошибке",
      request_online_booking: "Запрос онлайн-брони",
    },
  },
} satisfies Record<Locale, {
  bookings: string;
  emptyBookings: string;
  emptyRequests: string;
  error: string;
  loading: string;
  requests: string;
  search: string;
  status: Record<string, string>;
  requestKind: Record<string, string>;
}>;

function formatDateTime(value: string, locale: Locale) {
  const formatterLocale = locale === "ru" ? "ru-IL" : locale === "he" ? "he-IL" : "en-IL";

  return new Intl.DateTimeFormat(formatterLocale, {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
  }).format(new Date(value));
}

function statusTone(status: string): StatusTone {
  if (status === "confirmed" || status === "resolved") {
    return "success";
  }

  if (status === "held" || status === "submitted" || status === "triaged" || status === "in_progress") {
    return "info";
  }

  if (status === "expired" || status === "released") {
    return "warning";
  }

  return "neutral";
}

export function BookingsDashboard({ locale }: { locale: Locale }) {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<VerificationRequestItem[]>([]);
  const labels = copy[locale];

  useEffect(() => {
    let isMounted = true;

    async function loadAccount() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [bookingsResponse, requestsResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/me/bookings`, {
            headers: authHeaders("resident"),
          }),
          fetch(`${apiBaseUrl}/me/verification-requests`, {
            headers: authHeaders("resident"),
          }),
        ]);
        const bookingsBody = (await bookingsResponse.json().catch(() => ({}))) as BookingsResponse;
        const requestsBody = (await requestsResponse.json().catch(() => ({}))) as RequestsResponse;

        if (!bookingsResponse.ok || !requestsResponse.ok || !bookingsBody.data || !requestsBody.data) {
          throw new Error(bookingsBody.message || requestsBody.message || labels.error);
        }

        if (isMounted) {
          setBookings(bookingsBody.data.items);
          setRequests(requestsBody.data.requests);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : labels.error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadAccount();

    return () => {
      isMounted = false;
    };
  }, [labels.error]);

  if (isLoading) {
    return (
      <Notice icon={<Hourglass aria-hidden="true" size={20} />} title={labels.loading}>
        {labels.loading}
      </Notice>
    );
  }

  if (errorMessage) {
    return (
      <div className="account-dashboard">
        <Notice title={labels.error} tone="warning">
          {errorMessage}
        </Notice>
        <LinkButton href={`/${locale}`} variant="secondary">
          {labels.search}
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="account-dashboard">
      <section className="account-panel" aria-labelledby="account-bookings-title">
        <div className="account-panel__heading">
          <h2 id="account-bookings-title">{labels.bookings}</h2>
          <LinkButton href={`/${locale}`} variant="secondary">
            {labels.search}
          </LinkButton>
        </div>

        {bookings.length > 0 ? (
          <div className="account-list">
            {bookings.map((item) => (
              <article className="account-item" key={`${item.kind}-${item.id}`}>
                <div>
                  <p className="ui-result-card__meta">{formatDateTime(item.startsAt, locale)}</p>
                  <h3>{item.facility.name[locale]}</h3>
                  <p>{item.title[locale]}</p>
                  {item.reference ? <strong>{item.reference}</strong> : null}
                </div>
                <StatusBadge tone={statusTone(item.status)}>{labels.status[item.status]}</StatusBadge>
              </article>
            ))}
          </div>
        ) : (
          <Notice icon={<Inbox aria-hidden="true" size={20} />} title={labels.bookings}>
            {labels.emptyBookings}
          </Notice>
        )}
      </section>

      <section className="account-panel" aria-labelledby="account-requests-title">
        <div className="account-panel__heading">
          <h2 id="account-requests-title">{labels.requests}</h2>
        </div>

        {requests.length > 0 ? (
          <div className="account-list">
            {requests.map((request) => (
              <article className="account-item" key={request.id}>
                <div>
                  <p className="ui-result-card__meta">{formatDateTime(request.createdAt, locale)}</p>
                  <h3>{request.facility?.name[locale] ?? "SportIL"}</h3>
                  <p>{labels.requestKind[request.kind]}</p>
                  <strong>{request.publicId}</strong>
                </div>
                <StatusBadge tone={statusTone(request.status)}>{labels.status[request.status]}</StatusBadge>
              </article>
            ))}
          </div>
        ) : (
          <Notice icon={<CalendarCheck aria-hidden="true" size={20} />} title={labels.requests}>
            {labels.emptyRequests}
          </Notice>
        )}
      </section>

    </div>
  );
}
