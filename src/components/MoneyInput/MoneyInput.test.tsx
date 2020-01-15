import React from 'react';
import { shallow } from 'enzyme';
import NumberFormat from "react-number-format";

import { MoneyInput } from './MoneyInput';

describe('MoneyInput', () => {
    let onChange: jest.Mock;
    beforeEach(() => {
        onChange = jest.fn();
    });

    it('snapshot renders', () => {
        const component = shallow(
            <MoneyInput
                prefix="+"
                amount={200}
                onChange={onChange}
            />
        );

        expect(component).toMatchSnapshot();
    });

    //todo
    it('adds prefix when input changes', () => {
        const component = shallow(
            <MoneyInput
                prefix="+"
                onChange={onChange}
            />
        );

        const input = component
            .find(NumberFormat)
            .dive()
            .find('input');

        // HTMLInputElement.prototype.focus = jest.fn();
        // input.at(0).instance().foc
        // input.at(0).simulate('change', {
        //     persistent: jest.fn(),
        //     target: { value: '2' }
        // });

        expect(input).toMatchSnapshot()
    });
});
