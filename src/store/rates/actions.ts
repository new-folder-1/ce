import { createAsyncAction, createAction } from 'typesafe-actions';
import { Currency, ExchangeRates } from '../../types';

export const fetchRates = createAsyncAction(
    'rates/fetch-request',
    'rates/fetch-success',
    'rates/fetch-error'
)<Currency, ExchangeRates, Error>();

export const updateBaseCurrency = createAction('rates/update-base-currency')<Currency>();

export const startPollingRates = createAction('rates/polling-start')();
export const stopPollingRates = createAction('rates/polling-stop')();
