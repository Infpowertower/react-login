import React, { Component } from 'react';

import Login from './components/Login.js';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';

import './App.css';

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: blue,
    error: red,
    contrastThreshold: 3,
    tonalOffset: 0.2
  },
  typography: {
    useNextVariants: true,
  },
})

class App extends Component {

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Login theme={theme}/>
      </MuiThemeProvider>
    )
  }
}

export default App;
