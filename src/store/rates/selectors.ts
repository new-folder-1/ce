import { RootState } from "..";

export const getRatesForCurrentBase = (state: RootState) => state.rates.rates && state.rates.rates[state.rates.base];
