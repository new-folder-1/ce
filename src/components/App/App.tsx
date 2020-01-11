import * as React from "react";

import { appConnector } from "./connectors";
import { Wallet } from "../../types";

import './App.scss';

interface AppProps {
    title: string;

    wallets: Wallet[];
    fetchWallets: () => void;
}

class AppPresenter extends React.Component<AppProps> {
    componentDidMount() {
        this.props.fetchWallets();
    }
    
    render() {
        const { title, wallets } = this.props;
        return (
            <div>
                {title}
                {wallets.map(wallet => (
                    <div>
                        <span>wallet: {wallet.id} --- </span>
                        <span>amount: {wallet.amount}{wallet.currency}</span>
                        <br />
                    </div>
                ))}
            </div>
        );
    }
}

export const App = appConnector(AppPresenter);
