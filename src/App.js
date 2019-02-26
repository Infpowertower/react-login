import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <section className="Panel">
          <form>
          <input placeholder="Name" type="text"></input>
          <input placeholder="Password" type="password"></input>
          <input type="submit" value="Submit"/>
          </form>
          <div><button>Sign in</button><button>Sign up</button></div>
        </section>
    )
  }
}

export default App;
