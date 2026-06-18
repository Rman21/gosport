"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@sportil/ui";
import type { Locale } from "@sportil/types";
import { authHeaders } from "@/auth-client";

type SavedFacilityResponse = {
  data?: {
    facilities: Array<{
      facility: {
        id: string;
      };
    }>;
  };
  message?: string;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_SPORTIL_API_BASE_URL ?? "http://localhost:4000/api/v1";

const copy = {
  en: {
    error: "Could not update saved items",
    save: "Save",
    saved: "Saved",
    saving: "Saving",
    remove: "Remove",
  },
  he: {
    error: "לא ניתן לעדכן שמורים",
    save: "שמירה",
    saved: "שמור",
    saving: "שומרים",
    remove: "הסרה",
  },
  ru: {
    error: "Не удалось обновить сохраненное",
    save: "Сохранить",
    saved: "Сохранено",
    saving: "Сохраняем",
    remove: "Убрать",
  },
} satisfies Record<Locale, Record<string, string>>;

export function SaveFacilityButton({ facilityId, locale }: { facilityId: string; locale: Locale }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const labels = copy[locale];

  useEffect(() => {
    let isMounted = true;

    async function loadSaved() {
      try {
        const response = await fetch(`${apiBaseUrl}/me/saved`, {
          headers: authHeaders("resident"),
        });
        const body = (await response.json().catch(() => ({}))) as SavedFacilityResponse;

        if (isMounted && body.data) {
          setIsSaved(body.data.facilities.some((item) => item.facility.id === facilityId));
        }
      } catch {
        if (isMounted) {
          setErrorMessage(labels.error);
        }
      }
    }

    void loadSaved();

    return () => {
      isMounted = false;
    };
  }, [facilityId, labels.error]);

  async function toggleSaved() {
    setErrorMessage("");
    setIsBusy(true);

    try {
      const response = await fetch(`${apiBaseUrl}/me/saved/facilities/${facilityId}`, {
        headers: authHeaders("resident"),
        method: isSaved ? "DELETE" : "POST",
      });
      const body = (await response.json().catch(() => ({}))) as SavedFacilityResponse;

      if (!response.ok || !body.data) {
        throw new Error(body.message || labels.error);
      }

      setIsSaved(body.data.facilities.some((item) => item.facility.id === facilityId));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : labels.error);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="save-facility-control">
      <Button
        aria-pressed={isSaved}
        disabled={isBusy}
        icon={<Heart aria-hidden="true" fill={isSaved ? "currentColor" : "none"} size={18} />}
        onClick={toggleSaved}
        variant={isSaved ? "primary" : "secondary"}
      >
        {isBusy ? labels.saving : isSaved ? labels.saved : labels.save}
      </Button>
      {errorMessage ? <span role="alert">{errorMessage}</span> : null}
    </div>
  );
}
