import * as React from "react";
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { App } from './components/App/App';
import { store } from "./store";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";

import './assets/styles/normalize.css';

ReactDOM.render(
    <Provider store={store}>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </Provider>,
    document.getElementById('app')
);
