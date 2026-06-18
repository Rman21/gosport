"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Save, ShieldCheck } from "lucide-react";
import { Button, Notice } from "@sportil/ui";
import type { Locale } from "@sportil/types";
import { authHeaders } from "@/auth-client";

type Profile = {
  contactPhone: string;
  email: string;
  familyNote: string;
  favoriteSports: string[];
  fullName: string;
  id: string;
  preferredLocale: Locale;
  role: string;
};

type ProfileResponse = {
  data?: Profile;
  message?: string;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_SPORTIL_API_BASE_URL ?? "http://localhost:4000/api/v1";

const copy = {
  en: {
    contactPhone: "Phone",
    email: "Email",
    error: "Could not save profile.",
    familyNote: "Family notes",
    favoriteSports: "Favorite sports",
    fullName: "Full name",
    loading: "Loading profile",
    preferredLocale: "Service language",
    profile: "Profile details",
    saved: "Profile saved",
    saving: "Saving",
    submit: "Save profile",
  },
  he: {
    contactPhone: "טלפון",
    email: "אימייל",
    error: "לא ניתן לשמור פרופיל.",
    familyNote: "הערות משפחה",
    favoriteSports: "ענפי ספורט מועדפים",
    fullName: "שם מלא",
    loading: "טוענים פרופיל",
    preferredLocale: "שפת שירות",
    profile: "פרטי פרופיל",
    saved: "הפרופיל נשמר",
    saving: "שומרים",
    submit: "שמירת פרופיל",
  },
  ru: {
    contactPhone: "Телефон",
    email: "Эл. почта",
    error: "Не удалось сохранить профиль.",
    familyNote: "Семья и возраст детей",
    favoriteSports: "Любимые виды спорта",
    fullName: "Имя и фамилия",
    loading: "Загружаем профиль",
    preferredLocale: "Язык сервиса",
    profile: "Данные профиля",
    saved: "Профиль сохранен",
    saving: "Сохраняем",
    submit: "Сохранить профиль",
  },
} satisfies Record<Locale, Record<string, string>>;

const sportChoices = ["tennis", "swimming", "basketball", "football", "padel", "judo"] as const;

function optionalField(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  return value ? value : undefined;
}

export function ProfileDashboard({ locale }: { locale: Locale }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const labels = copy[locale];

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${apiBaseUrl}/me/profile`, {
          headers: authHeaders("resident"),
        });
        const body = (await response.json().catch(() => ({}))) as ProfileResponse;

        if (!response.ok || !body.data) {
          throw new Error(body.message || labels.error);
        }

        if (isMounted) {
          setProfile(body.data);
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

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [labels.error]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const favoriteSports = sportChoices.filter((sport) => formData.getAll("favoriteSports").includes(sport));

    try {
      const response = await fetch(`${apiBaseUrl}/me/profile`, {
        body: JSON.stringify({
          ...(optionalField(formData, "contactPhone") ? { contactPhone: optionalField(formData, "contactPhone") } : {}),
          ...(optionalField(formData, "email") ? { email: optionalField(formData, "email") } : {}),
          ...(optionalField(formData, "familyNote") ? { familyNote: optionalField(formData, "familyNote") } : {}),
          favoriteSports,
          ...(optionalField(formData, "fullName") ? { fullName: optionalField(formData, "fullName") } : {}),
          preferredLocale: String(formData.get("preferredLocale") ?? locale),
        }),
        headers: {
          "content-type": "application/json",
          ...authHeaders("resident"),
        },
        method: "PATCH",
      });
      const body = (await response.json().catch(() => ({}))) as ProfileResponse;

      if (!response.ok || !body.data) {
        throw new Error(body.message || labels.error);
      }

      setProfile(body.data);
      setSuccessMessage(labels.saved);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : labels.error);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <Notice title={labels.loading}>{labels.loading}</Notice>;
  }

  return (
    <div className="account-dashboard">
      <section className="account-panel" aria-labelledby="profile-form-title">
        <div className="account-panel__heading">
          <h2 id="profile-form-title">{labels.profile}</h2>
          <span className="ui-result-card__meta">{profile?.role ?? "resident"}</span>
        </div>

        <form className="resident-request-form profile-form" onSubmit={handleSubmit}>
          <label>
            <span>{labels.fullName}</span>
            <input autoComplete="name" defaultValue={profile?.fullName ?? ""} name="fullName" />
          </label>
          <label>
            <span>{labels.email}</span>
            <input autoComplete="email" defaultValue={profile?.email ?? ""} dir="ltr" name="email" type="email" />
          </label>
          <label>
            <span>{labels.contactPhone}</span>
            <input autoComplete="tel" defaultValue={profile?.contactPhone ?? ""} dir="ltr" inputMode="tel" name="contactPhone" />
          </label>
          <label>
            <span>{labels.preferredLocale}</span>
            <select defaultValue={profile?.preferredLocale ?? locale} name="preferredLocale">
              <option value="ru">Русский</option>
              <option value="he">עברית</option>
              <option value="en">English</option>
            </select>
          </label>
          <fieldset className="profile-sport-choices">
            <legend>{labels.favoriteSports}</legend>
            {sportChoices.map((sport) => (
              <label key={sport}>
                <input
                  defaultChecked={profile?.favoriteSports.includes(sport)}
                  name="favoriteSports"
                  type="checkbox"
                  value={sport}
                />
                <span>{sport}</span>
              </label>
            ))}
          </fieldset>
          <label className="resident-request-form__wide">
            <span>{labels.familyNote}</span>
            <textarea defaultValue={profile?.familyNote ?? ""} name="familyNote" rows={4} />
          </label>
          <div className="resident-request-form__actions">
            <Button disabled={isSaving} icon={<Save aria-hidden="true" size={18} />} type="submit">
              {isSaving ? labels.saving : labels.submit}
            </Button>
          </div>
        </form>

        {successMessage ? (
          <Notice icon={<ShieldCheck aria-hidden="true" size={20} />} title={labels.saved} tone="success">
            {successMessage}
          </Notice>
        ) : null}
        {errorMessage ? (
          <Notice title={labels.error} tone="warning">
            {errorMessage}
          </Notice>
        ) : null}
      </section>
    </div>
  );
}
