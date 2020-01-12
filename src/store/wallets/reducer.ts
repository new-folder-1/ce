import { ActionType, createReducer } from 'typesafe-actions';

import { Wallet } from '../../types';
import * as walletsActions from './actions';

export interface WalletState {
    items: Wallet[]
}

const initialState: WalletState = {
    items: []
};

type WalletsAction = ActionType<typeof walletsActions>;

export const walletsReducer = createReducer<WalletState, WalletsAction>(initialState)
    .handleAction([
        walletsActions.fetchWalletsAsync.success,
        walletsActions.submitExchangeAsync.success
    ], (state, action) => {
        return {
            ...state,
            items: action.payload
        };
    });
