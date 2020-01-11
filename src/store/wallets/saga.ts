import { call, put, takeLatest } from 'redux-saga/effects';

import { fetchWalletsAsync } from './actions';
import { getWallets } from '../../api/';
import { Wallet } from '../../types';
import { updateBaseCurrency, startPollingRates } from '../rates/actions';

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

export const walletsSaga = function*() {
    yield takeLatest(fetchWalletsAsync.request, fetchWallets);
};
