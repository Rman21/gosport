# SportIL Payments Package

Payment provider adapter package.

Current scope:

- Provider interface for creating and confirming payment intents.
- `MockPaymentProvider` for local booking/payment verification.
- Redacted payment method and event payloads only.

Raw card data must never be stored, logged, or passed through SportIL APIs.
