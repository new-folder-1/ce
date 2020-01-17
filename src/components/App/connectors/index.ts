import { Dispatch } from "redux";
import { fetchWalletsAsync, submitExchangeAsync, ExchangeSubmit } from "../../../store/wallets/actions";
import { connect } from "react-redux";
import { RootState } from "../../../store";
import { getWallets, getFetchError as walletsError, getExchangeError } from "../../../store/wallets/selectors";
import { updateBaseCurrency } from "../../../store/rates/actions";
import { Currency } from "../../../types";
import { getRates, getRateError as ratesError } from "../../../store/rates/selectors";

const mapStateToProps = (state: RootState) => {
    return {
        wallets: getWallets(state),
        rates: getRates(state),
        globalError: walletsError(state) || ratesError(state),
        exchangeError: getExchangeError(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        fetchWallets: () => dispatch(fetchWalletsAsync.request()),
        updateBaseCurrency: (currency: Currency) => dispatch(updateBaseCurrency(currency)),
        submitExchange: (data: ExchangeSubmit) => dispatch(submitExchangeAsync.request(data))
    };
};

export const appConnector = connect(mapStateToProps, mapDispatchToProps);
