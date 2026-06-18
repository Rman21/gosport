export type PaymentCurrency = "ILS";

export type PaymentIntentState =
  | "requires_confirmation"
  | "processing"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "refunded";

export type RedactedPaymentMethod = {
  brand: "mock-visa";
  expLabel: string;
  last4: "4242";
  label: string;
};

export type CreatePaymentIntentInput = {
  amountAgorot: number;
  bookingHoldId: string;
  currency: PaymentCurrency;
  idempotencyKey: string;
  userId: string;
};

export type PaymentIntentResult = {
  amountAgorot: number;
  currency: PaymentCurrency;
  id: string;
  idempotencyKey: string;
  provider: string;
  providerIntentId: string;
  redactedMethod: RedactedPaymentMethod;
  state: PaymentIntentState;
};

export type ConfirmPaymentIntentInput = {
  idempotencyKey: string;
  providerIntentId: string;
};

export type PaymentEventResult = {
  eventType: "payment_intent.succeeded" | "payment_intent.failed";
  idempotencyKey: string;
  providerEventId: string;
  providerIntentId: string;
  redactedPayload: Record<string, string | number | boolean | null>;
  state: PaymentIntentState;
};

export interface PaymentProvider {
  readonly providerName: string;
  createIntent(input: CreatePaymentIntentInput): Promise<PaymentIntentResult>;
  confirmIntent(input: ConfirmPaymentIntentInput): Promise<PaymentEventResult>;
}

function stableToken(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 72);
}

export class MockPaymentProvider implements PaymentProvider {
  readonly providerName = "sportil_mock";

  async createIntent(input: CreatePaymentIntentInput): Promise<PaymentIntentResult> {
    if (input.amountAgorot < 0) {
      throw new Error("Payment amount must be non-negative");
    }

    const token = stableToken(`${input.bookingHoldId}_${input.idempotencyKey}`);

    return {
      amountAgorot: input.amountAgorot,
      currency: input.currency,
      id: `mock_local_${token}`,
      idempotencyKey: input.idempotencyKey,
      provider: this.providerName,
      providerIntentId: `mock_pi_${token}`,
      redactedMethod: {
        brand: "mock-visa",
        expLabel: "12/30",
        label: "Mock Visa 4242",
        last4: "4242",
      },
      state: "requires_confirmation",
    };
  }

  async confirmIntent(input: ConfirmPaymentIntentInput): Promise<PaymentEventResult> {
    const token = stableToken(`${input.providerIntentId}_${input.idempotencyKey}`);

    return {
      eventType: "payment_intent.succeeded",
      idempotencyKey: input.idempotencyKey,
      providerEventId: `mock_evt_${token}`,
      providerIntentId: input.providerIntentId,
      redactedPayload: {
        livemode: false,
        provider: this.providerName,
        providerIntentId: input.providerIntentId,
        rawCardData: null,
      },
      state: "succeeded",
    };
  }
}

export function createMockPaymentProvider(): PaymentProvider {
  return new MockPaymentProvider();
}
