import { createAsyncAction } from 'typesafe-actions';
import { Wallet } from '../../types';

export const fetchWalletsAsync = createAsyncAction(
    'wallets/fetch-request',
    'wallets/fetch-success',
    'wallets/fetch-error'
)<void, Wallet[], Error>();
