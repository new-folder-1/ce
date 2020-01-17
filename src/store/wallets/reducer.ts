import { ActionType, createReducer } from 'typesafe-actions';

import { Wallet } from '../../types';
import * as walletsActions from './actions';

export interface WalletState {
    items: Wallet[],
    fetchError?: Error,
    exchangeError?: Error,
}

const initialState: WalletState = {
    items: [],
};

type WalletsAction = ActionType<typeof walletsActions>;

export const walletsReducer = createReducer<WalletState, WalletsAction>(initialState)
    .handleAction([
        walletsActions.fetchWalletsAsync.success,
        walletsActions.submitExchangeAsync.success
    ], (state, action) => {
        return {
            ...state,
            items: action.payload || [],
            fetchError: undefined,
            exchangeError: undefined
        };
    })
    .handleAction(walletsActions.fetchWalletsAsync.failure, (state, action) => {
        return {
            ...state,
            fetchError: action.payload
        };
    })
    .handleAction(walletsActions.submitExchangeAsync.failure, (state, action) => {
        return {
            ...state,
            exchangeError: action.payload
        };
    });
