import React from 'react';
import { render } from 'react-dom';
import App from './App';
// satisfy buffer requirement for rsocket
import 'babel-polyfill';

render(<App />, document.getElementById('root'));
