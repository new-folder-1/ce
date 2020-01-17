import * as React from 'react';

import { Wallet, Currency } from '../../types';
import { Button } from '../Button/Button';
import { MoneyInput, MoneyInputProps } from '../MoneyInput/MoneyInput';
import { Money } from '../Money/Money';

import './WalletPicker.scss';

export interface WalletPickerProps {
    type: WalletType;

    prev: Wallet;
    current: Wallet;
    next: Wallet;

    amount: number;

    rate: number;
    exchangeCurrency: Currency;

    amountDisabled?: boolean;
    onAmountChange: (type: WalletType, value: number) => void;
    onWalletChange: (direction: DirectionType) => void;
}

export type WalletType = 'from' | 'to';
export type DirectionType = 'prev' | 'next';

export const WalletPicker = ({
    type,
    onAmountChange,
    onWalletChange,
    prev,
    current,
    next,
    rate,
    exchangeCurrency,
    amount,
    amountDisabled
}: WalletPickerProps) => {
    const onMoneyInputChange = React.useCallback((value: number) => {
        onAmountChange(type, value);
    }, [type, onAmountChange]);

    const onPrevClick = React.useCallback(() => onWalletChange('prev'), [onWalletChange]);
    const onNextClick = React.useCallback(() => onWalletChange('next'), [onWalletChange]);

    const prefix: MoneyInputProps['prefix'] = type === 'from' ? '-' : '+';

    return (
        <section className="WalletPicker">
            <div className="WalletPicker-Row">
                <header className="WalletPicker-Currency">
                    {current.currency}
                </header>
                <MoneyInput
                    amount={amount}
                    prefix={prefix}
                    autofocus={type === 'from'}
                    onChange={onMoneyInputChange}
                    disabled={amountDisabled}
                />
            </div>
            <div className="WalletPicker-Row">
                <span className="WalletPicker-Balance">
                    You have: <Money amount={current.amount} currency={current.currency} />
                </span>
                <span className="WalletPicker-Rate">
                    <Money amount={1} currency={current.currency} />&nbsp;=&nbsp;
                    <Money amount={rate} currency={exchangeCurrency} />
                </span>
            </div>
            {type === 'from' && amount > current.amount && (
                <div className="WalletPicker-Row">
                    <span className="WalletPicker-Warning">You don't have enough money</span>
                </div>
            )}
            <div className="WalletPicker-Row WalletPicker-WalletChanger">
                {prev && <Button onClick={onPrevClick} text={`← ${prev.currency}`} />}
                <span>&nbsp;</span>
                {next && <Button onClick={onNextClick} text={`${next.currency} →`} />}
            </div>
        </section>
    );
};
