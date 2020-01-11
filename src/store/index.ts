import { combineReducers, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import { WalletState, walletsReducer } from "./wallets/reducer";
import { RatesState, ratesReducer } from "./rates/reducer";
import { walletsSaga } from "./wallets/saga";
import { ratesSaga } from "./rates/saga";

export interface RootState {
    wallets: WalletState;
    rates: RatesState;
}

const rootReducers = combineReducers<RootState>({
    wallets: walletsReducer,
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
        walletsSaga(),
        ratesSaga()
    ]);
}

sagaMiddleware.run(rootSaga);
