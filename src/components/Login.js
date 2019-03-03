import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import * as Request from '../helper/Request.js';

import './Login.css';

import logo from '../media/logo-temp.png'

class Login extends Component {
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
    }

    handleChange(evt) {
        this.setState({[evt.target.name]: evt.target.value});
        this.setState({errorName: false, errorPassword: false})
        this.setState({helperName: null, helperPassword: null})
    }

    handleTabs = (event, value) => {
        this.setState({ value });
    };

    handleChangeIndex = index => {
        this.setState({ value: index });
    };

    handleSubmit() {
        this.checkFields();
        if (this.state.value === 1) {
            Request.doRequest("http://localhost:8001/login", "POST", {name: this.state.name, password: this.state.password}, console.log);
        }
        else {
            Request.doRequest("http://localhost:8001/register", "POST", {name: this.state.name, password: this.state.password}, console.log);
        }
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
                <Paper className="Panel">
                    <img id="logo" src={logo} alt="logo"/>
                    <Tabs
                        value={value}
                        onChange={this.handleTabs}
                        indicatorColor="primary"
                        textColor="primary"
                        variant='fullWidth'
                    >
                        <Tab label="Register" />
                        <Tab label="Login" />
                    </Tabs>
                    <SwipeableViews
                        axis={this.props.theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={value}
                        onChangeIndex={this.handleChangeIndex}
                    >
                        <RegisterForm
                            errorName = {this.state.errorName}
                            helperName = {this.state.helperText}
                            errorPassword = {this.state.errorPassword}
                            helperPassword = {this.state.helperPassword}
                            handleChange = {this.handleChange}
                            handleSubmit = {this.handleSubmit}
                        />
                        <LoginForm
                            errorName = {this.state.errorName}
                            helperName = {this.state.helperText}
                            errorPassword = {this.state.errorPassword}
                            helperPassword = {this.state.helperPassword}
                            handleChange = {this.handleChange}
                            handleSubmit = {this.handleSubmit}
                        />
                    </SwipeableViews>
                </Paper>
        )
    }
}

class RegisterForm extends Component {
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
                    fullWidth
                    onClick={this.props.handleSubmit}
                >Submit
                </Button>
            </div>
        )
    }
}

class LoginForm extends Component {
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
                    fullWidth
                    onClick={this.props.handleSubmit}
                >Submit
                </Button>
            </div>
        )
    }
}

export default Login;
