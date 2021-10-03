import React from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment'

import './App.css';
import { CurrencyList } from './features/currencies/CurrencyList';

function App() {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
        <CurrencyList></CurrencyList>
    </MuiPickersUtilsProvider>
  );
}

export default App;
