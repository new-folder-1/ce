import { createAsyncAction } from 'typesafe-actions';
import { Wallet } from '../../types';

export const fetchWalletsAsync = createAsyncAction(
    'wallets/fetch-request',
    'wallets/fetch-success',
    'wallets/fetch-error'
)<void, Wallet[], Error>();

export interface ExchangeSubmit {
    walletFromId: string;
    walletToId: string;
    amount: number;
    rate: number;
}

export const submitExchangeAsync = createAsyncAction(
    'wallets/exchange-request',
    'wallets/exchange-success',
    'wallets/exchange-error'
)<ExchangeSubmit, Wallet[], Error>();
