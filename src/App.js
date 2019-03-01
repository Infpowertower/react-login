import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';

import './App.css';

import logo from './media/logo-temp.png'

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
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      name: null,
      password: null,
      errorName: false,
      errorPassword: false,
      helperName: null,
      helperPassword: null,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkFields = this.checkFields.bind(this);
    this.handleTab = this.handleTab.bind(this);
  }

  handleChange(evt) {
    this.setState({[evt.target.name]: evt.target.value});
    this.setState({errorName: false, errorPassword: false})
    this.setState({helperName: null, helperPassword: null})
  }

  handleTab(evt, tab) {
    this.setState({ tab });
  }

  handleSubmit() {
    this.checkFields();
    doRequest("http://localhost:8001/login", "POST", {name: this.state.name, password: this.state.password}, console.log);
  }

  checkFields() {
    if (!this.state.name) {
      this.setState({errorName: true, helperName: "required"});
    }
    else if (!this.state.password) {
      this.setState({errorPassword: true, helperPassword: "required"});
    }
  }

  render() {
    const { tab } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <Paper className="Panel">
          <img id="logo" src={logo} alt="logo"/>
          <h2
            >Enter credentials:</h2>
          {tab === 0 && <div><TextField
            label="Name"
            name="name"
            required
            error={this.state.errorName}
            helperText={this.state.helperName}
            autoFocus
            autofill="username"
            fullWidth
            margin="dense"
            variant="outlined"
            onChange={this.handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            required
            error={this.state.errorPassword}
            helperText={this.state.helperPassword}
            autofill="current-password"
            fullWidth
            margin="dense"
            variant="outlined"
            onChange={this.handleChange}
          /></div>}
          {tab === 1 && <h1>test</h1>}
          {/*<div className="Buttons">
              <Button
                fullWidth
                variant='text'
                disabled
                >Register</Button>
              <Button
                color='secondary'
                variant='contained'
                fullWidth
                onClick={this.handleSubmit}
              >Login
            </Button>
          </div>*/}
            <Tabs tab={tab} onChange={this.handleTab}>
              <Tab label="Register" />
              <Tab label="Login" />
            </Tabs>
        </Paper>
      </MuiThemeProvider>
    )
  }
}

function doRequest(url, method, data, callback) {
			let xhr = new XMLHttpRequest();
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status.toString().charAt(0) === '2') {
						if (callback) callback(xhr);
					}
				}
			};
			xhr.open(method, url);
			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhr.responseType ="json";
			xhr.send(JSON.stringify(data));
			return xhr;
	}

export default App;
