import { Currency, Wallet, ExchangeRates } from "../types";

// todo
const OPENEXCHANGE_APP_ID = 'b15747ffa53d439e913dc56a5e8c8fb0';
const SYMBOLS = ['USD', 'EUR', 'GBP'].join(',');

interface RatesResponse {
    base: Currency,
    rates: Record<Currency, number>
}

const mockRatesResponse: Record<Currency, RatesResponse> = {
    USD: {
        "base": "USD",
        "rates": {
            "EUR": 0.8992,
            "GBP": 0.765404,
            "USD": 1
        }
    },
    EUR: {
        "base": "EUR",
        "rates": {
            "EUR": 1,
            "GBP": 0.765404/0.8992,
            "USD": 1/0.8992
        }
    }
};

export const getRates = (base: Currency): Promise<ExchangeRates> => {
    const url = new URL('https://openexchangerates.org/api/latest.json');

    url.searchParams.append('base', base);
    url.searchParams.append('app_id', OPENEXCHANGE_APP_ID);
    url.searchParams.append('symbols', SYMBOLS);

    console.log(base);
    return Promise.resolve(mockRatesResponse[base])
        .then(transformRates);

    // return fetch(url.href)
    //     .then(response => response.json())
    //     .then(transformRates);
};

const transformRates = (rates: RatesResponse): ExchangeRates => {
    return { [rates.base]: rates.rates };
};

const mockWallets: Wallet[] = [
    {
        id: 'EUR1',
        currency: 'EUR',
        amount: 950
    },
    {
        id: 'USD1',
        currency: 'USD',
        amount: 2000
    },
    {
        id: 'quids',
        currency: 'GBP',
        amount: 200
    }
];

export const getWallets = (): Promise<Wallet[]> => {
    return Promise.resolve(mockWallets);
};
