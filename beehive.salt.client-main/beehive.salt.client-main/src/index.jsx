import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { red, blue } from '@material-ui/core/colors';
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2196f3',
      secondary: '#ff8a80',
    },
    secondary: {
      main: '#e3f2fd',
      secondary: '#f50057',
    },
  },
});

require('dotenv').config();

ReactDOM.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </BrowserRouter>,

  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
