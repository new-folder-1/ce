import * as React from "react";

import { appConnector } from "./connectors";
import { Wallet, ExchangeRates, Currency } from "../../types";

import './App.scss';
import { WalletPicker, WalletType } from "../WalletPicker/WalletPicker";
import { ExchangeSubmit } from "../../store/wallets/actions";

interface AppProps {
    title: string;

    rates: ExchangeRates,
    wallets: Wallet[];
    fetchWallets: () => void;
    updateBaseCurrency: (currency: Currency) => void;
    submitExchange: (data: ExchangeSubmit) => void;
}

interface AppState {
    walletFrom?: Wallet;
    walletTo?: Wallet;

    amount: number;
}

class AppPresenter extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        this.state = {
            amount: 0
        };

        this.onBallanceChange = this.onBallanceChange.bind(this);
        this.onWalletChange = this.onWalletChange.bind(this);
        this.submitExchange = this.submitExchange.bind(this);
    }

    componentDidMount() {
        this.props.fetchWallets();
    }

    componentDidUpdate() {
        if (!this.state.walletFrom && !this.state.walletTo) {
            this.setState({
                walletFrom: this.props.wallets[0],
                walletTo: this.props.wallets[1]
            });
        }
    }
    
    render() {
        const { wallets, rates } = this.props;
        const { walletFrom, walletTo, amount } = this.state;
        if (!walletFrom && !walletTo) {
            return <span>Loading wallets...</span>;
        }
        if (!(rates && rates[walletFrom.currency])) {
            return <span>Loading rates...</span>;
        }

        const walletFromIndex = wallets.findIndex(w => w.id === walletFrom.id);
        const walletToIndex = wallets.findIndex(w => w.id === walletTo.id);

        const rateFrom = rates[walletFrom.currency][walletTo.currency];
        const rateTo = 1 / rateFrom;

        const amountTo = amount * rateFrom;

        return (
            <div>
                <div>
                    <button onClick={this.submitExchange}>Exchange</button>
                </div>
                <WalletPicker
                    type="from"
                    current={walletFrom}
                    currentIndex={walletFromIndex}
                    onWalletChange={this.onWalletChange}
                    onBallanceChange={this.onBallanceChange}
                    walletsAmount={wallets.length}
                    rate={rateFrom}
                    exchangeCurrency={walletTo.currency}
                    amount={amount}
                />
                <hr />
                <WalletPicker
                    type="to"
                    current={walletTo}
                    currentIndex={walletToIndex}
                    onBallanceChange={this.onBallanceChange}
                    onWalletChange={this.onWalletChange}
                    walletsAmount={wallets.length}
                    rate={rateTo}
                    exchangeCurrency={walletFrom.currency}
                    amount={amountTo}
                />
            </div>
        );
    }

    onBallanceChange(type: WalletType, value: string) {
        const rateFrom = this.props.rates[this.state.walletFrom.currency][this.state.walletTo.currency];
        const rateTo = 1 / rateFrom;
        type === 'from' && this.setState({
            amount: Number(value)
        });
        type === 'to' && this.setState({
            amount: Number(value) * rateTo
        });
    }

    onWalletChange(type: WalletType, index: number) {
        this.setState({
            walletFrom: type === 'from' ? this.props.wallets[index] : this.state.walletFrom,
            walletTo: type === 'to' ? this.props.wallets[index] : this.state.walletTo
        }, () => {
            type === 'from' && this.props.updateBaseCurrency(this.state.walletFrom.currency);
        });
    }

    submitExchange() {
        this.props.submitExchange({
            walletFromId: this.state!.walletFrom.id,
            walletToId: this.state!.walletTo.id,
            amount: this.state.amount,
            rate: this.props.rates[this.state.walletFrom.currency][this.state.walletTo.currency]
        });
    }
}

export const App = appConnector(AppPresenter);
