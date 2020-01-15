import React from 'react';
import { shallow } from 'enzyme';

import { Button } from './Button';

describe('Button', () => {
    it('renders with default theme if one not provided', () => {
        expect(
            shallow(<Button text="test" />)
        ).toMatchSnapshot();
    });

    it('renders with action theme', () => {
        expect(
            shallow(<Button text="test" theme="action" />)
        ).toMatchSnapshot();
    });

    it('renders disabled', () => {
        expect(
            shallow(<Button text="test" disabled />)
        ).toMatchSnapshot();
    });

    it('renders with className added', () => {
        expect(
            shallow(<Button text="test" className="Wrapper-Button" />)
        ).toMatchSnapshot();
    });

    it('onClick fires', () => {
        const onClick = jest.fn()
        const component = shallow(
            <Button text="test" className="Wrapper-Button" onClick={onClick} />
        );
        component.find('button').simulate('click');
        
        expect(onClick).toBeCalledTimes(1);
    });
});
