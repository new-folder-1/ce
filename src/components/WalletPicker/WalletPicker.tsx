import * as React from 'react';

import { Wallet, Currency } from "../../types";

import './WalletPicker.scss';

interface WalletPickerProps {
    type: WalletType;

    current: Wallet;
    currentIndex: number;

    amount: number;

    rate: number;
    exchangeCurrency: Currency;

    walletsAmount: number;
    onBalanceChange: (type: WalletType, value: string) => void;
    onWalletChange: (type: WalletType, walletIndex: number) => void;
}

export type WalletType = 'from' | 'to';

export const isNumber = (value: string) => /^[0-9]*[.]{0,1}[0-9]{0,2}$/.test(value);

export const WalletPicker = ({
    type,
    onBalanceChange,
    onWalletChange,
    current,
    currentIndex,
    walletsAmount,
    rate,
    exchangeCurrency,
    amount
}: WalletPickerProps) => {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isNumber(e.target.value)) {
            return;
        }
        onBalanceChange(type, e.target.value);
    }
    const onPrevClick = () => {
        onWalletChange(type, currentIndex === 0 ? 0 : currentIndex - 1);
    }
    const onNextClick = () => {
        onWalletChange(type, currentIndex === walletsAmount - 1 ? currentIndex : currentIndex + 1);
    }

    return (
        <section className="WalletPicker">
            <div className="WalletPicker-Row">
                <header className="WalletPicker-Currency">
                    {current.currency}
                </header>
                <input className="WalletPicker-Input" onChange={onChange} value={+amount.toFixed(5)} />
            </div>
            <div className="WalletPicker-Row">
                <span className="WalletPicker-Balance">You have: {current.currency} {current.amount}</span>
                {type === 'to' && (
                    <span className="WalletPicker-Rate">
                        {current.currency}1 = {exchangeCurrency}{Number(rate.toFixed(5))}
                    </span>
                )}
            </div>
            <div>
                <button onClick={onPrevClick}>Prev</button>
                <button onClick={onNextClick}>Next</button>
            </div>
        </section>
    );
};
