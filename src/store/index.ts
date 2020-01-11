import { combineReducers, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import { WalletState, walletsReducer } from "./wallets/reducer";
import { ExchangeState, exchangeReducer } from "./exchange/reducer";
import { RatesState, ratesReducer } from "./rates/reducer";
import { walletsSaga } from "./wallets/saga";

export interface RootState {
    wallets: WalletState;
    exchange: ExchangeState;
    rates: RatesState;
}

const rootReducers = combineReducers<RootState>({
    wallets: walletsReducer,
    exchange: exchangeReducer,
    rates: ratesReducer
});

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
    rootReducers,
    composeWithDevTools(
        applyMiddleware(sagaMiddleware)
    )
);

const rootSaga = function*() {
    yield all([
        walletsSaga()
    ]);
}

sagaMiddleware.run(rootSaga);
