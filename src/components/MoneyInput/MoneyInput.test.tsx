import React from 'react';
import { shallow, mount, ReactWrapper, ShallowWrapper } from 'enzyme';

import { MoneyInput } from './MoneyInput';

const getInput = (component: ReactWrapper | ShallowWrapper) => component.find('input').at(0);

describe('MoneyInput', () => {
    let onChange: jest.Mock;
    beforeEach(() => {
        onChange = jest.fn();
    });

    it('snapshot renders', () => {
        const component = mount(
            <MoneyInput
                prefix="+"
                amount={200}
                onChange={jest.fn()}
                disabled
                autofocus
            />
        );

        expect(component).toMatchSnapshot();
    });

    it('updates input when external props update', () => {
        const component = shallow(
            <MoneyInput
                prefix="+"
                onChange={onChange}
            />
        );
        component.setProps({ amount: 100 });
        expect(getInput(component).prop('value')).toBe('+ 100');

        component.setProps({ amount: 10.12 });
        expect(getInput(component).prop('value')).toBe('+ 10.12');

        component.setProps({ amount: 0 });
        expect(getInput(component).prop('value')).toBe('');
    });

    it('onChange is called properly', () => {
        const component = mount(
            <MoneyInput
                prefix="+"
                amount={20}
                onChange={onChange}
            />
        );
        const input = getInput(component);

        input.simulate('change', {
            target: { value: '+ 200' }
        });
        expect(onChange).toBeCalledWith(200);

        input.simulate('change', {
            target: { value: '+ 20.12' }
        });
        expect(onChange).toBeCalledWith(20.12);
    });

    describe('incorrect input', () => {
        it('not numbers', () => {
            const component = mount(
                <MoneyInput
                    prefix="+"
                    amount={20}
                    onChange={onChange}
                />
            );
            const input = getInput(component);

            input.simulate('change', {
                target: { value: '+ 20f' }
            });
            expect(onChange).toBeCalledTimes(0);
            expect(getInput(component).prop('value')).toBe('+ 20');

            input.simulate('change', {
                target: { value: '+ 2f0' }
            });
            expect(onChange).toBeCalledTimes(0);
            expect(getInput(component).prop('value')).toBe('+ 20');

            input.simulate('change', {
                target: { value: '//+ 20' }
            });
            expect(onChange).toBeCalledTimes(0);
            expect(getInput(component).prop('value')).toBe('+ 20');
        });

        it('leading zeros', () => {
            const component = mount(
                <MoneyInput
                    prefix="+"
                    amount={20}
                    onChange={onChange}
                />
            );
            const input = getInput(component);
            input.simulate('change', {
                target: { value: '+ 020' }
            });
            expect(onChange).toBeCalledTimes(0);
            expect(getInput(component).prop('value')).toBe('+ 20');
        });

        it('dot without decimals', () => {
            const component = mount(
                <MoneyInput
                    prefix="+"
                    amount={20}
                    onChange={onChange}
                />
            );
            const input = getInput(component);
            input.simulate('change', {
                target: { value: '+ 20.' }
            });
            expect(onChange).toBeCalledTimes(0);
            expect(getInput(component).prop('value')).toBe('+ 20.');
        });
    });
});
