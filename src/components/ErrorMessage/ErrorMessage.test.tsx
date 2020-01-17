import React from 'react';
import { shallow } from 'enzyme';

import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
    it('snapshot', () => {
        expect(
            shallow(<ErrorMessage message="Failed to fetch wallets" />)
        ).toMatchSnapshot();
    });
});
