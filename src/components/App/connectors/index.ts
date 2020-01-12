import { Dispatch } from "redux";
import { fetchWalletsAsync, submitExchangeAsync, ExchangeSubmit } from "../../../store/wallets/actions";
import { connect } from "react-redux";
import { RootState } from "../../../store";
import { getWallets } from "../../../store/wallets/selectors";
import { updateBaseCurrency } from "../../../store/rates/actions";
import { Currency } from "../../../types";

const mapStateToProps = (state: RootState) => {
    return {
        wallets: getWallets(state),
        rates: state.rates.rates,
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