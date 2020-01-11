import * as React from "react";
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { App } from './components/App/App';
import { store } from "./store";

const title = 'Currency exchange app 2';

ReactDOM.render(
    <Provider store={store}>
        <App title={title} />
    </Provider>,
    document.getElementById('app')
);
