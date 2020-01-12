import * as React from 'react';

import { Wallet, Currency } from "../../types";

interface WalletPickerProps {
    type: WalletType;

    current: Wallet;
    currentIndex: number;

    amount: number;

    rate: number;
    exchangeCurrency: Currency;

    walletsAmount: number;
    onBallanceChange: (type: WalletType, value: string) => void;
    onWalletChange: (type: WalletType, walletIndex: number) => void;
}

export type WalletType = 'from' | 'to';

export const isNumber = (value: string) => /^[0-9]*[.]{0,1}[0-9]{0,2}$/.test(value);

export const WalletPicker = ({
    type,
    onBallanceChange,
    onWalletChange,
    current,
    currentIndex,
    walletsAmount,
    rate,
    exchangeCurrency,
    amount
}: WalletPickerProps) => {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(isNumber(e.target.value));
        if (!isNumber(e.target.value)) {
            return;
        }
        onBallanceChange(type, e.target.value);
    }
    const onPrevClick = () => {
        onWalletChange(type, currentIndex === 0 ? 0 : currentIndex - 1);
    }
    const onNextClick = () => {
        onWalletChange(type, currentIndex === walletsAmount - 1 ? currentIndex : currentIndex + 1);
    }
    console.log(type, amount);
    return (
        <div>
            <h4>{current.currency}</h4>
            <span>You have: {current.currency} {current.amount}</span>
            <input onChange={onChange} value={+amount.toFixed(5)} />
            {type === 'to' && (
                <div>
                    {current.currency}1 = {exchangeCurrency}{Number(rate.toFixed(5))}
                </div>
            )}
            <div>
                <button onClick={onPrevClick}>Prev</button>
                <button onClick={onNextClick}>Next</button>
            </div>
        </div>
    );
};
