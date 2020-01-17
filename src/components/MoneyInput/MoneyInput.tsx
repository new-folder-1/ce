import * as React from 'react';
import { boundMethod } from 'autobind-decorator';

import { isValidNumber, clearLeadingZeros } from '../../utils';

import './MoneyInput.scss';

export interface MoneyInputProps {
    prefix: '+' | '-';
    amount?: number;
    autofocus?: boolean;
    disabled?: boolean;
    onChange: (value: number) => void;
}

interface MoneyInputState {
    rawValue: string;
    value: number;
}

export class MoneyInput extends React.Component<MoneyInputProps, MoneyInputState> {
    state: MoneyInputState = {
        rawValue: this.formatRawValue(this.props.amount),
        value: this.props.amount
    }

    componentDidUpdate() {
        const { amount } = this.props;
        if (amount !== this.state.value) {
            this.setState({
                value: amount,
                rawValue: this.formatRawValue(amount)
            });
        }
    }

    formatRawValue(value: number, preFormattedString?: string) {
        const formatted = preFormattedString || (value ? value.toString() : '');
        return value ? `${this.prefix}${formatted}` : formatted;
    }

    get prefix() {
        return this.props.prefix + ' ';
    }

    @boundMethod
    onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const inputVal = e.target.value;
        let clearInputVal = inputVal.startsWith(this.prefix) ? inputVal.substring(this.prefix.length) : inputVal;

        if (!isValidNumber(clearInputVal)) {
            return;
        }
        clearInputVal = clearLeadingZeros(clearInputVal);
        if (clearInputVal.startsWith('.')) {
            clearInputVal = '0' + clearInputVal;
        }
        const num = Number(clearInputVal);

        this.setState({
            value: num,
            rawValue: this.formatRawValue(num, clearInputVal)
        }, num !== this.state.value ? () => {
            this.props.onChange(this.state.value);
        } : undefined);
    };

    
    render() {
        const { autofocus, disabled } = this.props;
        return (
            <input
                className="MoneyInput"
                disabled={disabled}
                value={this.state.rawValue}
                onChange={this.onInputChange}
                autoFocus={autofocus}
                placeholder="0.00"
                type="tel"
            />
        );
    }
}

