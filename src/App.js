import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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
  }

  handleChange(evt) {
    this.setState({[evt.target.name]: evt.target.value});
    this.setState({errorName: false, errorPassword: false})
    this.setState({helperName: null, helperPassword: null})
  }

  handleSubmit() {
    this.checkFields();
    doRequest("http://localhost:8001/login", "GET", {name: this.state.name, password: this.state.password}, console.log);
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
    return (
      <MuiThemeProvider theme={theme}>
        <Paper className="Panel">
          <img id="logo" src={logo} alt="logo"/>
          <DialogTitle
            >Enter credentials:</DialogTitle>
          <TextField
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
          />
          <div className="Buttons">
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
          </div>
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
