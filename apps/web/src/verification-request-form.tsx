"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Send, ShieldCheck } from "lucide-react";
import { Button, LinkButton, Notice } from "@sportil/ui";
import type { FacilityPreview, Locale } from "@sportil/types";
import { authHeaders } from "@/auth-client";

type VerificationAction = "claim" | "online-booking" | "report" | string | undefined;

type VerificationRequestKind =
  | "availability_request"
  | "claim_facility"
  | "report_wrong_info"
  | "request_online_booking";

type VerificationRequestFormProps = {
  action?: VerificationAction;
  facility: FacilityPreview;
  locale: Locale;
};

type VerificationRequestResponse = {
  data?: {
    publicId: string;
    status: string;
  };
  message?: string;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_SPORTIL_API_BASE_URL ?? "http://localhost:4000/api/v1";

const copy = {
  en: {
    contactEmail: "Email",
    contactPhone: "Phone",
    errorTitle: "Could not send the request",
    message: "What should the team check?",
    name: "Full name",
    sending: "Sending",
    submit: "Send request",
    successBody: "The request was saved. You can track it in your bookings area.",
    successTitle: "Request saved",
    title: "Send a request to SportIL",
    viewMine: "My bookings",
  },
  he: {
    contactEmail: "אימייל",
    contactPhone: "טלפון",
    errorTitle: "לא ניתן לשלוח את הבקשה",
    message: "מה צריך לבדוק?",
    name: "שם מלא",
    sending: "שולחים",
    submit: "שליחת בקשה",
    successBody: "הבקשה נשמרה. אפשר לעקוב אחריה באזור ההזמנות.",
    successTitle: "הבקשה נשמרה",
    title: "שליחת בקשה ל-SportIL",
    viewMine: "ההזמנות שלי",
  },
  ru: {
    contactEmail: "Эл. почта",
    contactPhone: "Телефон",
    errorTitle: "Не удалось отправить заявку",
    message: "Что нужно проверить?",
    name: "Имя и фамилия",
    sending: "Отправляем",
    submit: "Отправить заявку",
    successBody: "Заявка сохранена. Ее можно посмотреть в разделе броней и заявок.",
    successTitle: "Заявка отправлена",
    title: "Отправить заявку в SportIL",
    viewMine: "Мои брони",
  },
} satisfies Record<Locale, Record<string, string>>;

function optionalField(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  return value ? value : undefined;
}

function actionToKind(action: VerificationAction): VerificationRequestKind {
  if (action === "claim") {
    return "claim_facility";
  }

  if (action === "online-booking") {
    return "request_online_booking";
  }

  if (action === "report") {
    return "report_wrong_info";
  }

  return "availability_request";
}

export function VerificationRequestForm({ action, facility, locale }: VerificationRequestFormProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedPublicId, setSavedPublicId] = useState("");
  const labels = copy[locale];
  const kind = useMemo(() => actionToKind(action), [action]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const idempotencyKey = `${facility.id}:${kind}:${Date.now()}`;

    try {
      const response = await fetch(`${apiBaseUrl}/verification-requests`, {
        body: JSON.stringify({
          ...(optionalField(formData, "contactEmail")
            ? { contactEmail: optionalField(formData, "contactEmail") }
            : {}),
          ...(optionalField(formData, "contactPhone")
            ? { contactPhone: optionalField(formData, "contactPhone") }
            : {}),
          facilityId: facility.id,
          idempotencyKey,
          kind,
          message: optionalField(formData, "message") ?? "",
          preferredLocale: locale,
          ...(optionalField(formData, "residentName")
            ? { residentName: optionalField(formData, "residentName") }
            : {}),
        }),
        headers: {
          "content-type": "application/json",
          ...authHeaders("resident"),
        },
        method: "POST",
      });
      const body = (await response.json().catch(() => ({}))) as VerificationRequestResponse;

      if (!response.ok || !body.data) {
        throw new Error(body.message || labels.errorTitle);
      }

      setSavedPublicId(body.data.publicId);
      event.currentTarget.reset();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : labels.errorTitle);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="request-form-panel" aria-labelledby="verification-request-form-title">
      <div>
        <p className="section-heading__eyebrow">{facility.name[locale]}</p>
        <h2 id="verification-request-form-title">{labels.title}</h2>
      </div>

      {savedPublicId ? (
        <Notice icon={<ShieldCheck aria-hidden="true" size={20} />} title={labels.successTitle} tone="success">
          {labels.successBody} {savedPublicId}
        </Notice>
      ) : null}

      <form className="resident-request-form" onSubmit={handleSubmit}>
        <label>
          <span>{labels.name}</span>
          <input autoComplete="name" name="residentName" />
        </label>
        <label>
          <span>{labels.contactPhone}</span>
          <input autoComplete="tel" dir="ltr" inputMode="tel" name="contactPhone" />
        </label>
        <label>
          <span>{labels.contactEmail}</span>
          <input autoComplete="email" dir="ltr" name="contactEmail" type="email" />
        </label>
        <label className="resident-request-form__wide">
          <span>{labels.message}</span>
          <textarea maxLength={1200} name="message" required rows={4} />
        </label>

        <div className="resident-request-form__actions">
          <Button disabled={isSubmitting} icon={<Send aria-hidden="true" size={18} />} type="submit">
            {isSubmitting ? labels.sending : labels.submit}
          </Button>
          <LinkButton href={`/${locale}/bookings`} variant="secondary">
            {labels.viewMine}
          </LinkButton>
        </div>
      </form>

      {errorMessage ? (
        <Notice title={labels.errorTitle} tone="danger">
          {errorMessage}
        </Notice>
      ) : null}
    </section>
  );
}
