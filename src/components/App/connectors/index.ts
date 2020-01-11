import { Dispatch } from "redux";
import { fetchWalletsAsync } from "../../../store/wallets/actions";
import { connect } from "react-redux";
import { RootState } from "../../../store";
import { getWallets } from "../../../store/wallets/selectors";

const mapStateToProps = (state: RootState) => {
    return {
        wallets: getWallets(state)
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        fetchWallets: () => dispatch(fetchWalletsAsync.request())
    };
};

export const appConnector = connect(mapStateToProps, mapDispatchToProps);