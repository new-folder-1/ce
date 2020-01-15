import * as React from 'react';
import NumberFormat, { NumberFormatValues } from "react-number-format";

import './MoneyInput.scss';

export interface MoneyInputProps {
    prefix: '+' | '-' | '';
    amount?: number;
    autofocus?: boolean;
    onChange: (value: number) => void;
}

export const MoneyInput =({
    prefix, amount, autofocus, onChange
} : MoneyInputProps) => {
    const onNumberInput = React.useCallback((value: NumberFormatValues) => {
        const newValue = Math.abs(value.floatValue);
        if (newValue === amount) {
            return;
        }
    }, [onChange, amount]);

    return (
        <NumberFormat
            className="MoneyInput"
            prefix={`${prefix} `}
            allowNegative={false}
            value={amount}
            decimalScale={2}
            decimalSeparator="."
            onValueChange={onNumberInput}
            placeholder="0.00"
            autoFocus={autofocus}
            type="tel"
        />
    );
};
