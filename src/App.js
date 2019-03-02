import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SwipeableViews from 'react-swipeable-views';
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
      value: 1,
      name: null,
      password: null,
      errorName: false,
      errorPassword: false,
      helperName: null,
      helperPassword: null,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleTabs = this.handleTabs.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkFields = this.checkFields.bind(this);
    this.handleButton = this.handleButton.bind(this);
  }

  handleChange(evt) {
    this.setState({[evt.target.name]: evt.target.value});
    this.setState({errorName: false, errorPassword: false})
    this.setState({helperName: null, helperPassword: null})
  }

  handleButton(evt) {
    console.log('Button press');
  }

  handleTabs = (event, value) => {
    this.setState({ value });
  };

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
    const { value } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <Paper className="Panel">
          <img id="logo" src={logo} alt="logo"/>
            <Tabs
              value={value}
              onChange={this.handleTabs}
              indicatorColor="primary"
              textColor="primary"
              variant="fullwidth"
            >
              <Tab label="Register" />
              <Tab label="Login" />
            </Tabs>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={this.handleChangeIndex}
          >
            <Register
              errorName = {this.state.errorName}
              helperName = {this.state.helperText}
              errorPassword = {this.state.errorPassword}
              helperPassword = {this.state.helperPassword}
              handleChange = {this.handleChange}
              handleSubmit = {this.handleSubmit}
            />
            <Login
              errorName = {this.state.errorName}
              helperName = {this.state.helperText}
              errorPassword = {this.state.errorPassword}
              helperPassword = {this.state.helperPassword}
              handleChange = {this.handleChange}
              handleSubmit = {this.handleSubmit}
            />
          </SwipeableViews>
        </Paper>
      </MuiThemeProvider>
    )
  }
}

class Register extends Component {
  render() {
    return(
      <div className='inputForm'>
        <TextField
          label="Name"
          name="name"
          required
          error={this.props.errorName}
          helperText={this.props.helperName}
          autoFocus
          autofill="username"
          fullWidth
          margin="dense"
          variant="outlined"
          onChange={this.props.handleChange}
          />
        <TextField
          label="Password"
          name="password"
          type="password"
          required
          error={this.props.errorPassword}
          helperText={this.props.helperPassword}
          autofill="current-password"
          fullWidth
          margin="dense"
          variant="outlined"
          onChange={this.props.handleChange}
          />
        <TextField
          label="Repeat Password"
          name="password"
          type="password"
          required
          error={this.props.errorPassword}
          helperText={this.props.helperPassword}
          autofill="current-password"
          fullWidth
          margin="dense"
          variant="outlined"
          onChange={this.props.handleChange}
        />
        <Button
          color='secondary'
          variant='contained'
          margin='normal'
          fullWidth
          onClick={this.props.handleSubmit}
        >Submit
        </Button>
      </div>
    )
  }
}

class Login extends Component {
  render() {
    return(
      <div className='inputForm'>
        <TextField
          label="Name"
          name="name"
          required
          error={this.props.errorName}
          helperText={this.props.helperName}
          autoFocus
          autofill="username"
          fullWidth
          margin="dense"
          variant="outlined"
          onChange={this.props.handleChange}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          required
          error={this.props.errorPassword}
          helperText={this.props.helperPassword}
          autofill="current-password"
          fullWidth
          margin="dense"
          variant="outlined"
          onChange={this.props.handleChange}
        />
        <Button
          color='secondary'
          variant='contained'
          margin='normal'
          fullWidth
          onClick={this.props.handleSubmit}
        >Submit
        </Button>
      </div>
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
