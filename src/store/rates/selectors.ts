import { RootState } from "..";

export const getRates = (state: RootState) => state.rates.rates;
export const getRateError = (state: RootState) => state.rates.error;
