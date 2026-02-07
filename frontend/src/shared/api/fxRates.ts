import { useQuery } from "@tanstack/react-query";
import type { CurrencyCode } from "../types/currency";
import { currencyCodes } from "../types/currency";

export type FxRates = {
  base: CurrencyCode;
  rates: Record<CurrencyCode, number>;
};

type FrankfurterResponse = {
  rates: Record<string, number>;
};

export async function fetchFxRates(base: CurrencyCode): Promise<FxRates> {
  const targets = currencyCodes.filter((c) => c !== base).join(",");
  if (!targets) {
    return { base, rates: { [base]: 1 } as Record<CurrencyCode, number> };
  }

  try {
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=${base}&to=${targets}`,
    );

    if (!res.ok) {
      throw new Error("Nie udało się pobrać kursów walut.");
    }

    const data = (await res.json()) as FrankfurterResponse;
    const rates = {
      [base]: 1,
      ...Object.fromEntries(
        Object.entries(data.rates).map(([code, value]) => [
          code,
          Number(value),
        ]),
      ),
    } as Record<CurrencyCode, number>;

    return { base, rates };
  } catch {
    return {
      base,
      rates: currencyCodes.reduce((acc, code) => ({ ...acc, [code]: 1 }), {
        [base]: 1,
      } as Record<CurrencyCode, number>),
    };
  }
}

export function convertToBase(
  amount: number,
  from: CurrencyCode,
  base: CurrencyCode,
  fx?: FxRates,
): number {
  if (from === base) return amount;
  if (!fx || fx.base !== base) return amount;
  const rate = fx.rates[from];
  if (!rate || rate === 0) return amount;
  return amount / rate;
}

export function useFxRates(base: CurrencyCode) {
  return useQuery({
    queryKey: ["fx-rates", base],
    queryFn: () => fetchFxRates(base),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
