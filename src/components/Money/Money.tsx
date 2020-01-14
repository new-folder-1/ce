import * as React from 'react';

import { Currency } from '../../types';

export interface MoneyProps {
    amount: number;
    currency: Currency;
}

export const Money = React.memo(({ amount, currency }: MoneyProps) => (
    <span>
        {amount.toLocaleString('en', {
            style: 'currency',
            currency: currency
        })}
    </span>
));
