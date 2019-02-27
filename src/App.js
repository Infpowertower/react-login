import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <section className="Panel">
          <form>
            <input
              placeholder="Name"
              type="text"
              required
            />
          <input
              placeholder="Password"
              type="password"
              required
            />
          <input type="submit" value="Submit"/>
          </form>
          <div><Button>Sign in</Button><Button>Sign up</Button></div>
        </section>
    )
  }
}

export default App;
