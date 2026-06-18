"use client";

import { useState } from "react";
import { CalendarCheck, CheckCircle2, LockKeyhole, TimerReset } from "lucide-react";
import type { FacilityPreview, FacilitySlot, Locale, SportilDictionary } from "@sportil/types";
import { Button, LinkButton, Notice, StatusBadge, SummaryList } from "@sportil/ui";
import { authHeaders } from "@/auth-client";
import { formatSlotAvailability, formatSlotTime, isSlotCapacityTracked } from "@/demo-data";

type BookingStep = "review" | "held" | "confirmed";

type BookingFlowProps = {
  alternatives?: FacilitySlot[];
  dictionary: SportilDictionary;
  facility: FacilityPreview;
  locale: Locale;
  slot: FacilitySlot;
};

type HoldApiResponse = {
  data?: {
    expiresAt: string;
    holdId: string;
    paymentIntent: {
      id: string;
      providerIntentId: string;
    };
    status: string;
  };
  message?: string;
};

type ConfirmApiResponse = {
  data?: {
    bookingId: string;
    reference: string;
    status: string;
  };
  message?: string;
};

type HoldState = {
  expiresAt: string;
  holdId: string;
  paymentIntentId: string;
  providerIntentId: string;
};

type ConfirmationState = {
  bookingId: string;
  reference: string;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_SPORTIL_API_BASE_URL ?? "http://localhost:4000/api/v1";

export function BookingFlow({ alternatives = [], dictionary: t, facility, locale, slot }: BookingFlowProps) {
  const [step, setStep] = useState<BookingStep>("review");
  const [confirmation, setConfirmation] = useState<ConfirmationState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [holdState, setHoldState] = useState<HoldState | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const canReserveOnline = slot.mode === "payment";
  const formatterLocale = locale === "ru" ? "ru-IL" : locale === "he" ? "he-IL" : "en-IL";
  const holdExpiryLabel = holdState
    ? new Date(holdState.expiresAt).toLocaleTimeString(formatterLocale, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "06:00";

  async function readJson<T>(response: Response): Promise<T> {
    return (await response.json().catch(() => ({}))) as T;
  }

  async function handleHold() {
    setErrorMessage("");
    setIsBusy(true);

    try {
      const response = await fetch(`${apiBaseUrl}/booking-holds`, {
        body: JSON.stringify({
          idempotencyKey: `${slot.id}:hold:${Date.now()}`,
          participantsCount: 1,
          slotId: slot.id,
        }),
        headers: {
          "content-type": "application/json",
          ...authHeaders("resident"),
        },
        method: "POST",
      });
      const body = await readJson<HoldApiResponse>(response);

      if (!response.ok || !body.data) {
        throw new Error(body.message || t.alternativeOptionsBody);
      }

      setHoldState({
        expiresAt: body.data.expiresAt,
        holdId: body.data.holdId,
        paymentIntentId: body.data.paymentIntent.id,
        providerIntentId: body.data.paymentIntent.providerIntentId,
      });
      setStep("held");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t.alternativeOptionsBody);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleConfirm() {
    if (!holdState) {
      return;
    }

    setErrorMessage("");
    setIsBusy(true);

    try {
      const response = await fetch(`${apiBaseUrl}/booking-holds/${holdState.holdId}/confirm`, {
        body: JSON.stringify({
          idempotencyKey: `${slot.id}:confirm:${Date.now()}`,
          providerIntentId: holdState.providerIntentId,
        }),
        headers: {
          "content-type": "application/json",
          ...authHeaders("resident"),
        },
        method: "POST",
      });
      const body = await readJson<ConfirmApiResponse>(response);

      if (!response.ok || !body.data) {
        throw new Error(body.message || t.cannotBookOnline);
      }

      setConfirmation({
        bookingId: body.data.bookingId,
        reference: body.data.reference,
      });
      setStep("confirmed");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t.cannotBookOnline);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="booking-flow" aria-live="polite">
      <div className="booking-flow__panel">
        <div className="booking-flow__heading">
          <p className="section-heading__eyebrow">{t.bookingSummary}</p>
          <h1>{facility.name[locale]}</h1>
          <StatusBadge tone={canReserveOnline ? "success" : "warning"}>
            {t.paymentLabels[slot.mode]}
          </StatusBadge>
        </div>

        <SummaryList
          items={[
            { label: t.schedule, value: `${slot.day[locale]} · ${formatSlotTime(slot, locale)}` },
            { label: t.ageRange, value: slot.ageRange[locale] },
            { label: t.group, value: slot.group[locale] },
            {
              label: t.capacity,
              value: isSlotCapacityTracked(slot) ? formatSlotAvailability(slot, locale) : t.capacityNotTracked,
            },
            { label: t.averagePrice, value: typeof slot.priceNis === "number" ? `₪${slot.priceNis}` : "-" },
          ]}
        />

        <p className="booking-flow__note">{slot.participantNote[locale]}</p>

        {!canReserveOnline ? (
          <Notice tone="warning" title={t.noticeTitle}>
            {t.cannotBookOnline}
          </Notice>
        ) : null}

        {canReserveOnline && step === "review" ? (
          <div className="booking-flow__actions">
            <Notice
              icon={<LockKeyhole aria-hidden="true" size={20} />}
              title={t.mockPaymentTitle}
              tone="info"
            >
              {t.mockPaymentBody}
            </Notice>
            <Button
              disabled={isBusy}
              icon={<TimerReset aria-hidden="true" size={18} />}
              onClick={handleHold}
            >
              {isBusy ? t.holdExpires : t.holdSlot}
            </Button>
          </div>
        ) : null}

        {canReserveOnline && step === "held" ? (
          <div className="booking-flow__actions">
            <div className="booking-confirmation-box">
              <div>
                <p>{t.holdExpires}</p>
                <strong>{holdExpiryLabel}</strong>
              </div>
              <div>
                <p>{t.paymentMethod}</p>
                <strong>{t.mockCard}</strong>
              </div>
            </div>

            <div className="booking-flow__action-row">
              <Button
                disabled={isBusy}
                icon={<CalendarCheck aria-hidden="true" size={18} />}
                onClick={handleConfirm}
              >
                {isBusy ? t.holdExpires : t.confirmMockPayment}
              </Button>
              <Button
                onClick={() => {
                  setErrorMessage("");
                  setHoldState(null);
                  setStep("review");
                }}
                variant="secondary"
              >
                {t.releaseHold}
              </Button>
            </div>
          </div>
        ) : null}

        {canReserveOnline && step === "confirmed" ? (
          <div className="booking-flow__actions">
            <Notice
              icon={<CheckCircle2 aria-hidden="true" size={20} />}
              title={t.bookingConfirmed}
              tone="success"
            >
              {t.bookingReference}: {confirmation?.reference}
            </Notice>
            <LinkButton href={`/${locale}/bookings`} variant="secondary">
              {t.nav.bookings}
            </LinkButton>
          </div>
        ) : null}

        {errorMessage ? (
          <Notice tone="danger" title={t.alternativeOptions}>
            {errorMessage}
          </Notice>
        ) : null}
      </div>

      <aside className="booking-flow__source">
        <p className="section-heading__eyebrow">{t.source}</p>
        <h2>{slot.title[locale]}</h2>
        <p>{facility.summary[locale]}</p>
        <a href={slot.sourceUrl} rel="noreferrer" target="_blank">
          {facility.source.name[locale]}
        </a>

        {alternatives.length > 0 ? (
          <div className="booking-flow__alternatives">
            <div>
              <p className="section-heading__eyebrow">{t.schedule}</p>
              <h3>{t.alternativeOptions}</h3>
              <p>{t.alternativeOptionsBody}</p>
            </div>

            <div className="alternative-list">
              {alternatives.map((alternative) => (
                <a
                  className="alternative-item"
                  href={`/${locale}/book/${facility.id}?slot=${alternative.id}`}
                  key={alternative.id}
                >
                  <span>
                    <strong>{alternative.day[locale]}</strong>
                    <small>{alternative.title[locale]}</small>
                  </span>
                  <span>{formatSlotTime(alternative, locale)}</span>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
