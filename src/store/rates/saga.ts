import { call, select, put, takeLatest, takeEvery, take, race, delay } from 'redux-saga/effects';
import { ActionType, getType } from 'typesafe-actions';

import * as ratesActions from './actions';
import { getRates } from '../../api/rates';
import { Currency } from '../../types';

function* fetchRates(action: ActionType<typeof ratesActions.fetchRates.request>) {
    try {
        const rates = yield call(getRates, action.payload);
        yield put(ratesActions.fetchRates.success(rates));
    } catch (e) {
        yield put(ratesActions.fetchRates.failure(e));
    }
}

const POLLING_PERIOD = 10000;

function* startPollingRates() {
    while (true) {
        try {
            const currentBaseCurrency: Currency = yield select(state => state.rates.base);
            yield put(ratesActions.fetchRates.request(currentBaseCurrency));
            yield delay(POLLING_PERIOD);
        } catch (e) {
            yield put(ratesActions.stopPollingRates());
            yield put(ratesActions.fetchRates.failure(e));
        }
    }
};

export const pollRatesMain = function*() {
    yield race([
        call(startPollingRates),
        take(getType(ratesActions.stopPollingRates))
    ]);
};

function* updateBaseCurrency(action: ActionType<typeof ratesActions.updateBaseCurrency>) {
    yield put(ratesActions.fetchRates.request(action.payload));
}

export const ratesSaga = function*() {
    yield takeLatest(ratesActions.fetchRates.request, fetchRates);
    yield takeLatest(ratesActions.startPollingRates, pollRatesMain);
    yield takeEvery(ratesActions.updateBaseCurrency, updateBaseCurrency);
};
