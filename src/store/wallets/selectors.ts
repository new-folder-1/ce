import { RootState } from "..";
import { Wallet } from "../../types";

export const getWallets = (state: RootState): Wallet[] => state.wallets.items;