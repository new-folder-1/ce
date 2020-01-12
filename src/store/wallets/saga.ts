import { call, put, takeLatest } from 'redux-saga/effects';

import { fetchWalletsAsync, submitExchangeAsync } from './actions';
import { getWallets, submitExchange } from '../../api/';
import { Wallet } from '../../types';
import { updateBaseCurrency, startPollingRates } from '../rates/actions';
import { ActionType } from 'typesafe-actions';

function* fetchWallets() {
    try {
        const wallets: Wallet[] = yield call(getWallets);
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
        const wallets: Wallet[] = yield call(getWallets); 
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
