import * as React from "react";
import * as ReactDOM from 'react-dom';

import { App } from './components/App/App';

const title = 'Currency exchange app 2';

ReactDOM.render(
    <App title={title} />,
    document.getElementById('app')
);
