export type Currency = string;

export interface Wallet {
    id: string;
    amount: number;
    currency: Currency;
}
