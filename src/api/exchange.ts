import { Wallet } from "../types";
import { ExchangeSubmit } from "../store/wallets/actions";
import { formatNumber } from "../utils";

export const submitExchange = (wallets: Wallet[], data: ExchangeSubmit) => {
    return Promise.resolve(calculateExchange(wallets, data));
};

const Money = {
    sum: (v1: number, v2: number) => (v1 * 100 + v2 * 100) / 100,
    sub: (v1: number, v2: number) => Money.sum(v1, -v2),  
};
// mock backend calculations
const calculateExchange = (wallets: Wallet[], data: ExchangeSubmit): Wallet[] => {
    return wallets.map(wallet => {
        const _wallet = { ...wallet };
        if (wallet.id === data.walletFromId) {
            _wallet.amount = Money.sub(wallet.amount, data.amount);
        }
        if (wallet.id === data.walletToId) {
            _wallet.amount = Money.sum(wallet.amount, formatNumber(data.amount * data.rate));
        }
        return _wallet;
    });
};
