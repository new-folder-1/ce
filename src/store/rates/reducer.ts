import { ActionType, createReducer, action } from "typesafe-actions";

import * as ratesActions from './actions';
import { ExchangeRates, Currency } from "../../types";

export interface RatesState {
    base: Currency;
    rates?: ExchangeRates;
    error?: Error;
}

const initialState = {
    base: 'USD'
};

type RatesActions = ActionType<typeof ratesActions>;

export const ratesReducer = createReducer<RatesState, RatesActions>(initialState)
    .handleAction(ratesActions.fetchRates.success, (state, action) => {
        return {
            ...state,
            rates: {
                ...state.rates,
                ...action.payload
            },
            error: undefined
        };
    })
    .handleAction(ratesActions.fetchRates.failure, (state, action) => {
        return {
            ...state,
            error: action.payload
        };
    })
    .handleAction(ratesActions.updateBaseCurrency, (state, action) => {
        return {
            ...state,
            base: action.payload
        };
    });
