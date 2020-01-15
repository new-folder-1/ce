import React from 'react';
import { shallow } from 'enzyme';

import { AppPresenter as App, AppProps } from './App';

const baseProps: AppProps = {
    rates: {
        'USD': {
            'EUR': 0.8992,
            'USD': 1,
            'GBP': 0.7654
        }
    },
    wallets: [
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
    ],
    fetchWallets: jest.fn(),
    updateBaseCurrency: jest.fn(),
    submitExchange: jest.fn()
};

describe('App', () => {
    it('snapshot renders', () => {
        const component = shallow(<App
            {...baseProps}
        />);
        expect(component).toMatchSnapshot();
    });
});
