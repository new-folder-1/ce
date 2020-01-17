import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import { AppPresenter as App, AppProps } from './App';
import { Button } from '../Button/Button';
import { WalletPicker } from '../WalletPicker/WalletPicker';

const r1 = 0.8992;
const r2 = 0.765404;
const baseRates = {
    USD: {
        "EUR": r1,
        "GBP": r2,
        "USD": 1
    },
    EUR: {
        "EUR": 1,
        "GBP": r2/r1,
        "USD": 1/r1
    },
    GBP: {
        "EUR": r1/r2,
        "GBP": 1,
        "USD": 1/r2
    }
};
const baseWallets = [
    {
        currency: 'USD',
        amount: 200,
        id: '1'
    },
    {
        currency: 'GBP',
        amount: 300,
        id: '2'
    },
    {
        currency: 'EUR',
        amount: 100.20,
        id: '3'
    },
];
const getApp = (extendProps?: Partial<AppProps>) => {
    const baseProps: AppProps = {
        rates: baseRates,
        wallets: baseWallets,
        fetchWallets: jest.fn(),
        updateBaseCurrency: jest.fn(),
        submitExchange: jest.fn()
    };
    return shallow(<App {...baseProps} {...(extendProps || {}) } />)
}

const getExchangeButton = (component: ShallowWrapper) => component.find(Button).at(0);

describe('App', () => {
    let fetchWallets: jest.Mock;
    let updateBaseCurrency: jest.Mock;
    let submitExchange: jest.Mock;

    beforeEach(() => {
        fetchWallets = jest.fn();
        updateBaseCurrency = jest.fn();
        submitExchange = jest.fn();
    });

    it('snapshot renders', () => {
        const component = getApp();
        expect(component).toMatchSnapshot();
    });

    it('fetches wallets on mount', () => {
        getApp({ fetchWallets });
        expect(fetchWallets).toBeCalledTimes(1);
    });

    it('exchange click calls api', () => {
        const component = getApp({ submitExchange });
        component.setState({
            walletFromIndex: 1,
            walletToIndex: 0,
            amountFrom: 100,
            amountTo: 100/r2
        });
        component.find(Button).at(0).simulate('click');

        expect(submitExchange).toBeCalledTimes(1);
        expect(submitExchange).toBeCalledWith({
            walletFromId: baseWallets[1].id,
            walletToId: baseWallets[0].id,
            amount: 100,
            rate: 1/r2
        });
    });

    it('changes wallets and recalculates amount', () => {
        const component = getApp({ updateBaseCurrency });
        const walletFrom = component.find(WalletPicker).at(0);
        const walletTo = component.find(WalletPicker).at(1);

        component.setState({
            walletFromIndex: 0,
            walletToIndex: 1,
            amountFrom: 100,
            amountTo: 100*r1
        });

        walletFrom.prop('onWalletChange')('next');
        expect(component.state('walletFromIndex')).toEqual(1);
        expect(component.state('amountFrom')).toEqual(100);
        expect(updateBaseCurrency).toBeCalledTimes(1);
        expect(updateBaseCurrency).toBeCalledWith('GBP');

        walletTo.prop('onWalletChange')('prev');
        expect(component.state('walletToIndex')).toEqual(0);
        expect(component.state('amountTo')).toEqual(130.65);
    });

    it('changes state when input changes', () => {
        const component = getApp();
        const walletFrom = component.find(WalletPicker).at(0);
        const walletTo = component.find(WalletPicker).at(1);

        walletFrom.prop('onAmountChange')('from', 100);
        expect(component.state('lastTouchedWallet')).toEqual('from');
        expect(component.state('amountFrom')).toEqual(100);
        expect(component.state('amountTo')).toEqual(76.54); //100*r2

        walletTo.prop('onAmountChange')('to', 100);
        expect(component.state('lastTouchedWallet')).toEqual('to');
        expect(component.state('amountFrom')).toEqual(130.65); //100/r2
        expect(component.state('amountTo')).toEqual(100);
    });

    describe('exchange button', () => {
        it('enabled', () => {
            const component = getApp();
            component.setState({
                walletFromIndex: 0,
                walletToIndex: 1,
                amountFrom: 100,
                amountTo: 100*r1
            });
            expect(getExchangeButton(component).prop('disabled')).toBeFalsy();
        });

        it('disabled when wallets are equal', () => {
            const component = getApp();
            component.setState({
                walletFromIndex: 0,
                walletToIndex: 0,
            });
            expect(getExchangeButton(component).prop('disabled')).toBeTruthy();
        });

        it('disabled when amount is less than 1', () => {
            const component = getApp();
            component.setState({
                amountFrom: 0,
            });
            expect(getExchangeButton(component).prop('disabled')).toBeTruthy();
            component.setState({
                amountFrom: 0.05,
            });
            expect(getExchangeButton(component).prop('disabled')).toBeTruthy();
        });

        it('disabled when amount is greater than balance', () => {
            const component = getApp();
            component.setState({
                amountFrom: 201,
            });
            expect(getExchangeButton(component).prop('disabled')).toBeTruthy();
        });
    });

    it('disables input when wallets are equal', () => {
        const component = getApp();
        expect(component.find(WalletPicker).at(0).prop('amountDisabled')).toBeFalsy();
        component.setState({
            walletFromIndex: 0,
            walletToIndex: 0,
        });
        expect(component.find(WalletPicker).at(0).prop('amountDisabled')).toBeTruthy();
    });

    it('clears inputs when balances update', () => {
        const component = getApp();

        component.setState({
            amountFrom: 100,
            amountTo: 100*r1
        });

        component.setProps({
            wallets: [
                {
                    currency: 'USD',
                    amount: 100,
                    id: '1'
                },
                {
                    currency: 'GBP',
                    amount: 300 - 100*r1,
                    id: '2'
                },
                {
                    currency: 'EUR',
                    amount: 100.20,
                    id: '3'
                },
            ]
        });

        expect(component.state('amountFrom')).toEqual(0);
        expect(component.state('amountTo')).toEqual(0);
    });

    it('updates inputs when new rates come', () => {
        const component = getApp();
        component.setState({
            amountFrom: 100,
            amountTo: 100*r1
        });

        component.setProps({
            rates: {
                ...baseRates,
                USD: {
                    "EUR": r2,
                    "GBP": r2,
                    "USD": 1
                },
            }
        });

        expect(component.state('amountFrom')).toEqual(100);
        expect(component.state('amountTo')).toEqual(76.54); // 100*r2
    });

    describe('keeps value of last touched wallet', () => {
        it('when wallets are changed', () => {
            const component = getApp();
            const walletFrom = component.find(WalletPicker).at(0);
            const walletTo = component.find(WalletPicker).at(1);
    
            component.setState({
                amountFrom: 100,
                amountTo: 100*r1,
                lastTouchedWallet: 'from'
            });

            walletFrom.prop('onWalletChange')('next');
            expect(component.state('amountFrom')).toEqual(100);
            walletTo.prop('onWalletChange')('next');
            expect(component.state('amountFrom')).toEqual(100);
    
            component.setState({
                amountFrom: 100/r1,
                amountTo: 100,
                lastTouchedWallet: 'to'
            });
    
            walletFrom.prop('onWalletChange')('prev');
            expect(component.state('amountTo')).toEqual(100);
            walletTo.prop('onWalletChange')('prev');
            expect(component.state('amountTo')).toEqual(100);
        });

        it('when rates are updated', () => {
            const component = getApp();
    
            component.setState({
                amountFrom: 100,
                amountTo: 100*r1,
                lastTouchedWallet: 'from'
            });
    
            component.setProps({
                rates: {
                    ...baseRates,
                    USD: {
                        "EUR": 0.1,
                        "GBP": 0.1,
                        "USD": 1
                    },
                }
            });

            expect(component.state('amountFrom')).toEqual(100);
        });
    });
});
