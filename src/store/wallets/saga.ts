import { call, put, takeLatest } from 'redux-saga/effects';

import { fetchWalletsAsync } from './actions';
import { getWallets } from '../../api/';
import { Wallet } from '../../types';

function* fetchWallets() {
    try {
        console.log('here');
        const wallets: Wallet[] = yield call(getWallets);
        yield put(fetchWalletsAsync.success(wallets));
    } catch (e) {
        yield put(fetchWalletsAsync.failure(e));
    }
};

export const walletsSaga = function*() {
    yield takeLatest(fetchWalletsAsync.request, fetchWallets);
};
