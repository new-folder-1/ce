import * as React from "react";
import { boundMethod } from 'autobind-decorator';

import { appConnector } from "./connectors";
import { Wallet, Currency } from "../../types";
import { WalletPicker, WalletType, DirectionType } from "../WalletPicker/WalletPicker";
import { Button } from '../Button/Button';
import { ExchangeSubmit } from "../../store/wallets/actions";
import { formatNumber } from "../../utils";

import './App.scss';

interface AppProps {
    rates: Record<Currency, number>,
    wallets: Wallet[];
    fetchWallets: () => void;
    updateBaseCurrency: (currency: Currency) => void;
    submitExchange: (data: ExchangeSubmit) => void;
}

type AppState = {
    walletFromIndex: number;
    walletToIndex: number;
} & AppAmounts

interface AppAmounts {
    amountFrom?: number;
    amountTo?: number;
}

class AppPresenter extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        this.state = {
            walletFromIndex: 0,
            walletToIndex: 1,
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
        if (!rates || !walletFrom || !walletTo) {
            return null;
        }
        return rates[walletTo.currency];
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
        // deepEqual
        if (prevProps.rates !== this.props.rates) {
            this.setState({
                ...this.recalculateMoney('from', this.state.amountFrom)
            });
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

    @boundMethod
    onAmountChange(type: WalletType, value: number) {
        this.setState({
            ...this.recalculateMoney(type, value)
        });
    }

    @boundMethod
    onWalletFromChange(direction: DirectionType) {
        this.setState({
            walletFromIndex: this.getNewWalletIndex('from', direction)
        }, () => {
            this.setState({
                ...this.recalculateMoney('from', this.state.amountFrom)
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
                ...this.recalculateMoney('to', this.state.amountTo)
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
