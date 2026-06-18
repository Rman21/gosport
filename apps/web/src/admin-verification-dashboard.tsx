"use client";

import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { Button, Notice, StatusBadge } from "@sportil/ui";
import type { Locale, LocalizedText, StatusTone } from "@sportil/types";
import { authHeaders } from "@/auth-client";

type VerificationRequestStatus = "in_progress" | "rejected" | "resolved" | "submitted" | "triaged";

type AdminRequest = {
  contact?: {
    email: string | null;
    phone: string | null;
    residentName: string | null;
  };
  createdAt: string;
  facility: {
    id: string;
    name: LocalizedText;
    neighborhood: LocalizedText | null;
  } | null;
  id: string;
  kind: "availability_request" | "claim_facility" | "report_wrong_info" | "request_online_booking";
  message: string | null;
  publicId: string;
  status: VerificationRequestStatus;
};

type AdminRequestsResponse = {
  data?: {
    requests: AdminRequest[];
  };
  message?: string;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_SPORTIL_API_BASE_URL ?? "http://localhost:4000/api/v1";

const copy = {
  en: {
    admin: "Admin verification",
    contact: "Contact",
    empty: "No resident requests in this queue.",
    error: "Could not load verification requests.",
    kind: {
      availability_request: "Availability request",
      claim_facility: "Facility claim",
      report_wrong_info: "Correction report",
      request_online_booking: "Online booking request",
    },
    refresh: "Refresh",
    status: {
      in_progress: "In review",
      rejected: "Rejected",
      resolved: "Resolved",
      submitted: "Sent",
      triaged: "Triaged",
    },
  },
  he: {
    admin: "ניהול אימות מידע",
    contact: "פרטי קשר",
    empty: "אין פניות תושבים בתור הזה.",
    error: "לא ניתן לטעון פניות אימות.",
    kind: {
      availability_request: "בקשת זמינות",
      claim_facility: "בקשת ניהול מתקן",
      report_wrong_info: "דיווח תיקון",
      request_online_booking: "בקשת הזמנה אונליין",
    },
    refresh: "רענון",
    status: {
      in_progress: "בטיפול",
      rejected: "נדחה",
      resolved: "טופל",
      submitted: "נשלח",
      triaged: "תועדף",
    },
  },
  ru: {
    admin: "Проверка заявок",
    contact: "Контакт",
    empty: "В этой очереди пока нет обращений жителей.",
    error: "Не удалось загрузить заявки на проверку.",
    kind: {
      availability_request: "Заявка на доступность",
      claim_facility: "Управление объектом",
      report_wrong_info: "Сообщение об ошибке",
      request_online_booking: "Запрос онлайн-брони",
    },
    refresh: "Обновить",
    status: {
      in_progress: "В работе",
      rejected: "Отклонено",
      resolved: "Решено",
      submitted: "Отправлено",
      triaged: "Разобрано",
    },
  },
} satisfies Record<Locale, {
  admin: string;
  contact: string;
  empty: string;
  error: string;
  kind: Record<AdminRequest["kind"], string>;
  refresh: string;
  status: Record<VerificationRequestStatus, string>;
}>;

const statusOrder: VerificationRequestStatus[] = ["submitted", "triaged", "in_progress", "resolved", "rejected"];

async function fetchRequests(errorLabel: string) {
  const response = await fetch(`${apiBaseUrl}/admin/verification-requests`, {
    headers: authHeaders("admin"),
  });
  const body = (await response.json().catch(() => ({}))) as AdminRequestsResponse;

  if (!response.ok || !body.data) {
    throw new Error(body.message || errorLabel);
  }

  return body.data.requests;
}

function statusTone(status: VerificationRequestStatus): StatusTone {
  if (status === "resolved") return "success";
  if (status === "rejected") return "danger";
  if (status === "in_progress" || status === "triaged") return "info";
  return "warning";
}

function formatDate(value: string, locale: Locale) {
  const formatterLocale = locale === "ru" ? "ru-IL" : locale === "he" ? "he-IL" : "en-IL";
  return new Intl.DateTimeFormat(formatterLocale, {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
  }).format(new Date(value));
}

export function AdminVerificationDashboard({ locale }: { locale: Locale }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [updatingId, setUpdatingId] = useState("");
  const labels = copy[locale];

  async function loadRequests() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      setRequests(await fetchRequests(labels.error));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : labels.error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialRequests() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const nextRequests = await fetchRequests(labels.error);

        if (isMounted) {
          setRequests(nextRequests);
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

    void loadInitialRequests();

    return () => {
      isMounted = false;
    };
  }, [labels.error]);

  async function updateStatus(requestId: string, status: VerificationRequestStatus) {
    setUpdatingId(requestId);
    setErrorMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/admin/verification-requests/${requestId}`, {
        body: JSON.stringify({ status }),
        headers: {
          "content-type": "application/json",
          ...authHeaders("admin"),
        },
        method: "PATCH",
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { message?: string };
        throw new Error(body.message || labels.error);
      }

      setRequests(await fetchRequests(labels.error));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : labels.error);
    } finally {
      setUpdatingId("");
    }
  }

  if (isLoading) {
    return <Notice title={labels.admin}>{labels.admin}</Notice>;
  }

  return (
    <div className="account-dashboard admin-verification-dashboard">
      <section className="account-panel" aria-labelledby="admin-verification-title">
        <div className="account-panel__heading">
          <h2 id="admin-verification-title">{labels.admin}</h2>
          <Button icon={<RefreshCcw aria-hidden="true" size={18} />} onClick={() => void loadRequests()} variant="secondary">
            {labels.refresh}
          </Button>
        </div>

        {errorMessage ? (
          <Notice title={labels.error} tone="warning">
            {errorMessage}
          </Notice>
        ) : null}

        {requests.length > 0 ? (
          <div className="account-list">
            {requests.map((request) => (
              <article className="account-item admin-request-item" key={request.id}>
                <div>
                  <p className="ui-result-card__meta">
                    {formatDate(request.createdAt, locale)} · {request.publicId}
                  </p>
                  <h3>{request.facility?.name[locale] ?? "SportIL"}</h3>
                  <p>{labels.kind[request.kind]}</p>
                  {request.message ? <p>{request.message}</p> : null}
                  <strong>
                    {labels.contact}: {request.contact?.residentName ?? "-"} · {request.contact?.phone ?? request.contact?.email ?? "-"}
                  </strong>
                </div>
                <div className="admin-request-item__controls">
                  <StatusBadge tone={statusTone(request.status)}>{labels.status[request.status]}</StatusBadge>
                  <div className="admin-status-grid">
                    {statusOrder.map((status) => (
                      <Button
                        disabled={updatingId === request.id || status === request.status}
                        key={status}
                        onClick={() => void updateStatus(request.id, status)}
                        variant={status === request.status ? "primary" : "tertiary"}
                      >
                        {labels.status[status]}
                      </Button>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <Notice title={labels.admin}>{labels.empty}</Notice>
        )}
      </section>
    </div>
  );
}
