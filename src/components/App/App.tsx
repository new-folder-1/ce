import * as React from "react";
import { boundMethod } from 'autobind-decorator';

import { appConnector } from "./connectors";
import { Wallet, Currency, ExchangeRates } from "../../types";
import { WalletPicker, WalletType, DirectionType } from "../WalletPicker/WalletPicker";
import { Button } from '../Button/Button';
import { ExchangeSubmit } from "../../store/wallets/actions";
import { formatNumber, poorDeepEqual } from "../../utils";

import './App.scss';

export interface AppProps {
    rates: ExchangeRates,
    wallets: Wallet[];
    fetchWallets: () => void;
    updateBaseCurrency: (currency: Currency) => void;
    submitExchange: (data: ExchangeSubmit) => void;
}

type AppState = {
    walletFromIndex: number;
    walletToIndex: number;

    lastTouchedWallet: WalletType;
} & AppAmounts

interface AppAmounts {
    amountFrom?: number;
    amountTo?: number;
}

export class AppPresenter extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        this.state = {
            walletFromIndex: 0,
            walletToIndex: 1,

            lastTouchedWallet: 'from',
        };
    }

    get walletFrom(): Wallet | undefined {
        return this.props.wallets[this.state.walletFromIndex];
    }
    get walletTo(): Wallet | undefined {
        return this.props.wallets[this.state.walletToIndex];
    }
    get rateFrom(): number | null {
        const { props: { rates }, walletFrom, walletTo} = this;
        if (!rates || !rates[walletFrom.currency] || !walletFrom || !walletTo) {
            return null;
        }
        return rates[walletFrom.currency][walletTo.currency];
    }
    get rateTo(): number | null {
        if (!this.rateFrom) {
            return null;
        }
        return 1 / this.rateFrom;
    }

    componentDidMount() {
        this.props.fetchWallets();
    }

    componentDidUpdate(prevProps: AppProps) {
        if (!poorDeepEqual(prevProps.rates, this.props.rates)) {
            this.setState({
                ...this.recalculateForLastTouchedWallet()
            });
        } else if (!poorDeepEqual(prevProps.wallets, this.props.wallets)) {
            this.setState({ amountFrom: 0, amountTo: 0 });
        }
    }
    
    render() {
        const { wallets } = this.props;
        const { walletFromIndex, walletToIndex, amountFrom, amountTo } = this.state;
        const { walletFrom, walletTo, rateFrom, rateTo } = this;

        if (wallets.length === 0) {
            return <span>Wallets were not found</span>;
        }

        if (!rateFrom) {
            return <span>Loading rates...</span>;
        }

        return (
            <div className="App">
                <div className="App-Header">
                    <Button
                        text="Exchange"
                        onClick={this.submitExchange}
                        disabled={this.isSubmitDisabled()}
                        theme="action"
                    />
                </div>
                <div className="App-Wallet App-Wallet_from">
                    <WalletPicker
                        type="from"
                        prev={wallets[walletFromIndex - 1]}
                        current={walletFrom}
                        next={wallets[walletFromIndex + 1]}

                        onWalletChange={this.onWalletFromChange}
                        onAmountChange={this.onAmountChange}
                        
                        rate={rateFrom}
                        exchangeCurrency={walletTo.currency}
                        amount={amountFrom}
                    />
                </div>
                <div className="App-Wallet App-Wallet_to">
                    <WalletPicker
                        type="to"
                        prev={wallets[walletToIndex - 1]}
                        current={walletTo}
                        next={wallets[walletToIndex + 1]}

                        onAmountChange={this.onAmountChange}
                        onWalletChange={this.onWalletToChange}

                        rate={rateTo}
                        exchangeCurrency={walletFrom.currency}
                        amount={amountTo}
                    />
                </div>
            </div>
        );
    }

    recalculateMoney(type: WalletType, amount: number): AppAmounts {
        let amountFrom: number;
        let amountTo: number;
        const currentBalance = this.walletFrom.amount;

        if (type === 'from') {
            amountFrom = amount > currentBalance ? currentBalance : amount;
            amountTo = formatNumber(amountFrom * this.rateFrom);
        } else if (type === 'to') {
            const tmpAmountFrom = formatNumber(amount * this.rateTo);
            const isNotEnoughBalance = tmpAmountFrom > currentBalance;
            amountFrom = isNotEnoughBalance ? currentBalance : tmpAmountFrom;
            amountTo = isNotEnoughBalance ? formatNumber(amountFrom * this.rateFrom) : amount; 
        } else {
            throw new Error(`${type} is not found`);
        }

        return { amountFrom, amountTo };
    }

    recalculateForLastTouchedWallet() {
        const { lastTouchedWallet, amountFrom, amountTo } = this.state;
        return this.recalculateMoney(
            lastTouchedWallet,
            lastTouchedWallet === 'from' ? amountFrom : amountTo
        );
    }

    @boundMethod
    onAmountChange(type: WalletType, value: number) {
        this.setState({
            ...this.recalculateMoney(type, value),
            lastTouchedWallet: type,
        });
    }

    @boundMethod
    onWalletFromChange(direction: DirectionType) {
        
        this.setState({
            walletFromIndex: this.getNewWalletIndex('from', direction)
        }, () => {
            this.setState({
                ...this.recalculateForLastTouchedWallet()
            });
            this.props.updateBaseCurrency(this.walletFrom.currency);
        });
    }

    @boundMethod
    onWalletToChange(direction: DirectionType) {
        this.setState({
            walletToIndex: this.getNewWalletIndex('to', direction)
        }, () => {
            this.setState({
                ...this.recalculateForLastTouchedWallet()
            });
        });
    }

    getNewWalletIndex(walletType: WalletType, direction: DirectionType) {
        const currentIndex = walletType === 'from' ? this.state.walletFromIndex : this.state.walletToIndex;
        return direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    }

    isSubmitDisabled() {
        const { amountFrom } = this.state;
        return this.walletFrom.id === this.walletTo.id ||
            !amountFrom || amountFrom > this.walletFrom.amount ||
            amountFrom < 1;
    }

    @boundMethod
    submitExchange() {
        this.props.submitExchange({
            walletFromId: this.walletFrom.id,
            walletToId: this.walletTo.id,
            amount: this.state.amountFrom,
            rate: this.rateFrom
        });
    }
}

export const App = appConnector(AppPresenter);
