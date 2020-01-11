import { Reducer } from "redux";

export interface ExchangeState {
    from?: string; // wallet id
    to?: string; // wallet id
    amount: number;
};

const initialState: ExchangeState = {
    amount: 0
};

type ExchangeReducer = Reducer<ExchangeState>;

export const exchangeReducer: ExchangeReducer = (state = initialState) => {
    return state;
};
