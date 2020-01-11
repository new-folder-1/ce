import { Reducer } from "redux";
import { Currency } from "../../types";

export interface RatesState {
    rates?: Record<Currency, Record<Currency, number>>;
}

const initialState = {};

type RatesReducer = Reducer<RatesState>;

export const ratesReducer: RatesReducer = (state = initialState) => {
    return state;
};
