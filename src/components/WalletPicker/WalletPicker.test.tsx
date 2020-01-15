import React from 'react';
import { shallow } from 'enzyme';

import { WalletPicker, WalletPickerProps } from './WalletPicker';
import { Button } from '../Button/Button';
import { MoneyInput } from '../MoneyInput/MoneyInput';

const baseProps: WalletPickerProps = {
    type: 'from',
    prev: {
        currency: 'USD',
        amount: 200,
        id: '1'
    },
    current: {
        currency: 'GBP',
        amount: 300,
        id: '2'
    },
    next: {
        currency: 'EUR',
        amount: 100.20,
        id: '3'
    },
    onWalletChange: jest.fn(),
    onAmountChange: jest.fn(),
    rate: 0.8992,
    exchangeCurrency: 'USD',
    amount: 20.50
};

describe('WalletPicker', () => {
    it('snapshot renders', () => {
        const component = shallow(<WalletPicker {...baseProps} />);
        expect(component).toMatchSnapshot();
    });

    it('prev is not rendered', () => {
        const props: WalletPickerProps = {
            ...baseProps,
            prev: undefined
        };
        const component = shallow(<WalletPicker {...props} />);
        expect(component).toMatchSnapshot();
    });

    it('next is not rendered', () => {
        const props: WalletPickerProps = {
            ...baseProps,
            next: undefined
        };
        const component = shallow(<WalletPicker {...props} />);
        expect(component).toMatchSnapshot();
    });

    it('calls onWalletChange when buttons are clicked', () => {
        const component = shallow(<WalletPicker {...baseProps} />);
        const buttons = component
            .find('.WalletPicker-WalletChanger')
            .find(Button);
        
        buttons.at(0).prop('onClick')();
        expect(baseProps.onWalletChange).toBeCalledWith('prev');

        buttons.at(1).prop('onClick')();
        expect(baseProps.onWalletChange).toBeCalledWith('next');
    });

    it('calls onAmountChange when input changes', () => {
        const component = shallow(<WalletPicker {...baseProps} />);
        const inputs = component.find(MoneyInput);

        inputs.at(0).prop('onChange')(200);
        expect(baseProps.onAmountChange).toBeCalledWith('from', 200);
    });
});
