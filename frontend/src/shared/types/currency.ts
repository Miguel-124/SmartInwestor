export const currencyCodes = ["PLN", "EUR", "USD"] as const;
export type CurrencyCode = (typeof currencyCodes)[number];
