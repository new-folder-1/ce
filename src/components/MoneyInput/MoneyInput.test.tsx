import React from 'react';
import { shallow } from 'enzyme';

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
            .find('input');

        input.at(0).simulate('change', {
            currentTarget: { value: '2' }
        });

        expect(input).toMatchSnapshot()
    });
});
