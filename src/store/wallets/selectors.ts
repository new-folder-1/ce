import { RootState } from "..";
import { Wallet } from "../../types";

export const getWallets = (state: RootState): Wallet[] => state.wallets.items;
export const getFetchError = (state: RootState): Error => state.wallets.fetchError;
export const getExchangeError = (state: RootState): Error => state.wallets.exchangeError;
