import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import './index.css'
import "antd/dist/antd.css"
import 'mdb-react-ui-kit/dist/css/mdb.min.css'

import App from './App';
import reportWebVitals from './reportWebVitals';
import rootReducer from './redux';

// Store
const store = createStore(rootReducer,composeWithDevTools())

ReactDOM.render(
  <Provider store = {store}>
    {/* <React.StrictMode> */}
    <BrowserRouter>
     <App />
    </BrowserRouter>
  {/* </React.StrictMode> */}
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
