import { Reducer } from 'redux';
import { Currency } from '../../types';

export interface WalletState {
    items: Wallet[]
}

interface Wallet {
    id: string;
    amount: number;
    currency: Currency;
}

const initialState: WalletState = {
    items: []
};

type WalletsReducer = Reducer<WalletState>;

export const walletsReducer: WalletsReducer = (state = initialState) => {
    return state;
};
