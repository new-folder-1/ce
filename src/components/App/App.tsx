import * as React from "react";

import './App.scss';

interface AppProps {
    title: string;
}

export const App = (props: AppProps) => {
    const currencies = new Set(['GBP', 'USD', 'EUR']);
    return (
        <div>
            {props.title}
            {[...currencies].map(curr => curr)}
        </div>
    );
};
