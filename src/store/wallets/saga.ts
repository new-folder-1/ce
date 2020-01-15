import { call, put, select, takeLatest } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';

import { fetchWalletsAsync, submitExchangeAsync } from './actions';
import { getWallets as getWalletsApi } from '../../api/wallets';
import { getWallets as getWalletsSelector } from './selectors';
import { submitExchange } from '../../api/exchange';
import { Wallet } from '../../types';
import { updateBaseCurrency, startPollingRates } from '../rates/actions';

function* fetchWallets() {
    try {
        const wallets: Wallet[] = yield call(getWalletsApi);
        yield put(fetchWalletsAsync.success(wallets));
        if (wallets[0]) {
            yield put(updateBaseCurrency(wallets[0].currency));
            yield put(startPollingRates());
        }
    } catch (e) {
        yield put(fetchWalletsAsync.failure(e));
    }
};

function* exchange(action: ActionType<typeof submitExchangeAsync.request>) {
    try {
        const wallets: Wallet[] = yield select(getWalletsSelector); 
        const newWallets = yield call(submitExchange, wallets, action.payload);
        yield put(submitExchangeAsync.success(newWallets));
    } catch (e) {
        yield put(submitExchangeAsync.failure(e));
    }
}

export const walletsSaga = function*() {
    yield takeLatest(fetchWalletsAsync.request, fetchWallets);
    yield takeLatest(submitExchangeAsync.request, exchange);
};
