import React from 'react';
import { shallow } from 'enzyme';

import { Money } from './Money';

describe('Money', () => {
    it('snapshot renders', () => {
        expect(
            shallow(<Money amount={1} currency="USD" />)
        ).toMatchSnapshot();
    })

    it('renders with currency symbol', () => {
        const component = shallow(<Money amount={20.01} currency="GBP" />)
        expect(component.text()).toEqual('£20.01');
    });

    it('renders with thousands separator', () => {
        const component = shallow(<Money amount={1000} currency="USD" />)
        expect(component.text()).toEqual('$1,000.00');
    });
});
