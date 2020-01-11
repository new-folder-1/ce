import { combineReducers, createStore } from "redux";
import { devToolsEnhancer } from 'redux-devtools-extension';

import { WalletState, walletsReducer } from "./wallets/reducer";
import { ExchangeState, exchangeReducer } from "./exchange/reducer";
import { RatesState, ratesReducer } from "./rates/reducer";

interface RootState {
    wallets: WalletState;
    exchange: ExchangeState;
    rates: RatesState;
}

const rootReducers = combineReducers<RootState>({
    wallets: walletsReducer,
    exchange: exchangeReducer,
    rates: ratesReducer
});

export const store = createStore(
    rootReducers,
    devToolsEnhancer({})
);
