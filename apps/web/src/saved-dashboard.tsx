"use client";

import { useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { Button, LinkButton, Notice, StatusBadge } from "@sportil/ui";
import type { BookingMethod, Locale, LocalizedText, SourceType, VerificationStatus } from "@sportil/types";
import { authHeaders } from "@/auth-client";

type SavedFacility = {
  createdAt: string;
  facility: {
    address: LocalizedText | null;
    bookingMethod: BookingMethod;
    id: string;
    name: LocalizedText;
    neighborhood: LocalizedText | null;
    sourceType: SourceType;
    verificationStatus: VerificationStatus;
  };
  followId: string;
};

type SavedResponse = {
  data?: {
    facilities: SavedFacility[];
  };
  message?: string;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_SPORTIL_API_BASE_URL ?? "http://localhost:4000/api/v1";

const copy = {
  en: {
    empty: "No saved facilities yet.",
    error: "Could not load saved facilities.",
    loading: "Loading saved facilities",
    open: "Open",
    remove: "Remove",
    saved: "Saved facilities",
    search: "Find facilities",
    status: {
      active_contact_only: "Active by contact",
      archived_closed: "Archived / closed",
      info_only: "Information only",
      live_bookable: "Bookable in SportIL",
      live_registration: "Registration open",
      needs_verification: "Needs verification",
    },
  },
  he: {
    empty: "עדיין אין מתקנים שמורים.",
    error: "לא ניתן לטעון שמורים.",
    loading: "טוענים שמורים",
    open: "פתיחה",
    remove: "הסרה",
    saved: "מתקנים שמורים",
    search: "חיפוש מתקנים",
    status: {
      active_contact_only: "פעיל בתיאום",
      archived_closed: "ארכיון / סגור",
      info_only: "מידע בלבד",
      live_bookable: "הזמנה ב-SportIL",
      live_registration: "הרשמה פתוחה",
      needs_verification: "דורש בדיקה",
    },
  },
  ru: {
    empty: "Пока нет сохраненных объектов.",
    error: "Не удалось загрузить сохраненные объекты.",
    loading: "Загружаем сохраненное",
    open: "Открыть",
    remove: "Убрать",
    saved: "Сохраненные объекты",
    search: "Найти объекты",
    status: {
      active_contact_only: "Активно по заявке",
      archived_closed: "Архив / закрыто",
      info_only: "Информация",
      live_bookable: "Бронь в SportIL",
      live_registration: "Запись открыта",
      needs_verification: "Нужна проверка",
    },
  },
} satisfies Record<Locale, {
  empty: string;
  error: string;
  loading: string;
  open: string;
  remove: string;
  saved: string;
  search: string;
  status: Record<VerificationStatus, string>;
}>;

async function fetchSavedFacilities(errorLabel: string) {
  const response = await fetch(`${apiBaseUrl}/me/saved`, {
    headers: authHeaders("resident"),
  });
  const body = (await response.json().catch(() => ({}))) as SavedResponse;

  if (!response.ok || !body.data) {
    throw new Error(body.message || errorLabel);
  }

  return body.data.facilities;
}

export function SavedDashboard({ locale }: { locale: Locale }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [items, setItems] = useState<SavedFacility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState("");
  const labels = copy[locale];

  useEffect(() => {
    let isMounted = true;

    async function loadInitialSaved() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const nextItems = await fetchSavedFacilities(labels.error);

        if (isMounted) {
          setItems(nextItems);
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

    void loadInitialSaved();

    return () => {
      isMounted = false;
    };
  }, [labels.error]);

  async function removeSaved(facilityId: string) {
    setRemovingId(facilityId);
    setErrorMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/me/saved/facilities/${facilityId}`, {
        headers: authHeaders("resident"),
        method: "DELETE",
      });
      const body = (await response.json().catch(() => ({}))) as SavedResponse;

      if (!response.ok || !body.data) {
        throw new Error(body.message || labels.error);
      }

      setItems(body.data.facilities);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : labels.error);
    } finally {
      setRemovingId("");
    }
  }

  if (isLoading) {
    return <Notice title={labels.loading}>{labels.loading}</Notice>;
  }

  return (
    <div className="account-dashboard">
      <section className="account-panel" aria-labelledby="saved-facilities-title">
        <div className="account-panel__heading">
          <h2 id="saved-facilities-title">{labels.saved}</h2>
          <LinkButton href={`/${locale}`} variant="secondary">
            {labels.search}
          </LinkButton>
        </div>

        {errorMessage ? (
          <Notice title={labels.error} tone="warning">
            {errorMessage}
          </Notice>
        ) : null}

        {items.length > 0 ? (
          <div className="account-list">
            {items.map((item) => (
              <article className="account-item" key={item.followId}>
                <div>
                  <p className="ui-result-card__meta">{item.facility.neighborhood?.[locale] ?? "Netanya"}</p>
                  <h3>{item.facility.name[locale]}</h3>
                  <p>{item.facility.address?.[locale] ?? item.facility.sourceType}</p>
                </div>
                <div className="account-item__actions">
                  <StatusBadge tone="info">{labels.status[item.facility.verificationStatus]}</StatusBadge>
                  <LinkButton href={`/${locale}/facilities/${item.facility.id}`} variant="secondary">
                    {labels.open}
                  </LinkButton>
                  <Button
                    disabled={removingId === item.facility.id}
                    icon={<Trash2 aria-hidden="true" size={18} />}
                    onClick={() => void removeSaved(item.facility.id)}
                    variant="tertiary"
                  >
                    {labels.remove}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <Notice icon={<Heart aria-hidden="true" size={20} />} title={labels.saved}>
            {labels.empty}
          </Notice>
        )}
      </section>
    </div>
  );
}
