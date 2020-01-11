export type Currency = string;

export interface Wallet {
    id: string;
    amount: number;
    currency: Currency;
}

export type ExchangeRates = Record<Currency, Record<Currency, number>>;
