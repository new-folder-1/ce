import { Wallet } from "../types";

const mockWallets: Wallet[] = [
    {
        id: 'EUR1',
        currency: 'EUR',
        amount: 950
    },
    {
        id: 'USD1',
        currency: 'USD',
        amount: 2000
    },
    {
        id: 'quids',
        currency: 'GBP',
        amount: 200
    }
];

export const getWallets = (): Promise<Wallet[]> => {
    return Promise.resolve(mockWallets);
};
