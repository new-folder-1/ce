import { Currency, ExchangeRates } from "../types";

interface RatesResponse {
    base: Currency,
    rates: Record<Currency, number>
}

//
const OPENEXCHANGE_APP_ID = 'b15747ffa53d439e913dc56a5e8c8fb0';
const SYMBOLS = ['USD', 'EUR', 'GBP'].join(',');

export const getRates = (base: Currency): Promise<ExchangeRates> => {
    const url = new URL('https://openexchangerates.org/api/latest.json');

    url.searchParams.append('base', base);
    url.searchParams.append('app_id', OPENEXCHANGE_APP_ID);
    url.searchParams.append('symbols', SYMBOLS);

    return Promise.resolve(mockRatesResponse()[base])
        .then(transformRates);

    // return fetch(url.href)
    //     .then(response => response.json())
    //     .then(transformRates);
};

const transformRates = (rates: RatesResponse): ExchangeRates => {
    return { [rates.base]: rates.rates };
};

const mockRatesResponse = (): Record<Currency, RatesResponse> => {
    const mods = [0, 0.01, -0.03, 0.05, 0.02, -0.006];
    const getRandomMod = () => mods[Math.floor(Math.random() * mods.length)];

    const r1 = 0.8992 + getRandomMod();
    const r2 = 0.765404 + getRandomMod();
    return {
        USD: {
            "base": "USD",
            "rates": {
                "EUR": r1,
                "GBP": r2,
                "USD": 1
            }
        },
        EUR: {
            "base": "EUR",
            "rates": {
                "EUR": 1,
                "GBP": r2/r1,
                "USD": 1/r1
            }
        },
        GBP: {
            "base": "GBP",
            "rates": {
                "EUR": r1/r2,
                "GBP": 1,
                "USD": 1/r2
            }
        }
    }
};