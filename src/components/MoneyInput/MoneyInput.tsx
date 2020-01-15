import * as React from 'react';

import { isValidNumber, clearLeadingZeros } from '../../utils';

import './MoneyInput.scss';

export interface MoneyInputProps {
    prefix: '+' | '-';
    amount?: number;
    autofocus?: boolean;
    onChange: (value: number) => void;
}

const addPrefix = (string: string, prefix: string) => `${prefix}${string}`;

export const MoneyInput =({
    prefix, amount, autofocus, onChange
} : MoneyInputProps) => {
    const [rawValue, setRawValue] = React.useState(amount ? amount.toString() : '');
    const [value, setValue] = React.useState(amount);

    const _prefix = prefix + ' ';

    React.useEffect(() => {
        if (amount === value) return;

        setValue(amount);
        const amountString = amount ? amount.toString() : '';
        setRawValue(amount ? addPrefix(amountString, _prefix) : amountString);
    }, [amount, value]);

    const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.currentTarget.value;        
        let clearInputVal = inputVal.startsWith(_prefix) ? inputVal.substring(_prefix.length) : inputVal;

        if (!isValidNumber(clearInputVal)) {
            return;
        }

        clearInputVal = clearLeadingZeros(clearInputVal);
        const num = Number(clearInputVal);
        setValue(num);
        setRawValue(num === 0 ? clearInputVal : addPrefix(clearInputVal, _prefix));

        onChange(num);
    };

    return (
        <input
            className="MoneyInput"
            value={rawValue}
            onChange={onInput}
            autoFocus={autofocus}
            placeholder="0.00"
            type="tel"
        />
    );
};
