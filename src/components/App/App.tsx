import * as React from "react";

import { appConnector } from "./connectors";
import { Wallet } from "../../types";

import './App.scss';

interface AppProps {
    title: string;

    wallets: Wallet[];
    fetchWallets: () => void;
}

const AppBase = (props: AppProps) => {
    const { title, wallets, fetchWallets } = props;

    React.useEffect(() => {
        fetchWallets();
    });

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
};

export const App = appConnector(AppBase);