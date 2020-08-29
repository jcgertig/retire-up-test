import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'antd/dist/antd.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import returns from './returns.json';
import * as serviceWorker from './serviceWorker';
import { minAndMaxYearFromReturns } from './utils';

const { max, min } = minAndMaxYearFromReturns(returns);

ReactDOM.render(
  <React.StrictMode>
    <App returns={returns} maxYear={max} minYear={min} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
