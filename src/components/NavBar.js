import React, { Component } from 'react';
import './NavBar.css';
import Logo from '../media/logo_crop.png';

// implementiert die Navigationsbar
export class NavBar extends Component {
    render() {
      return (
        <section className="NavBar">
          <img id="logo" src={Logo} alt="lame"/>
          <Dropdown item={this.props.item} tables={this.props.tables} handleButton={this.props.handleButton}/>
          <h1 id="help"><a href="http://localhost:8080/help.html" id="help-link">Help</a></h1>
        </section>
      )
    }
}

// implementiert das Dropdown-Menü
class Dropdown extends Component {
    handleButton(id, sender) {
      sender.preventDefault();
      this.props.handleButton(id);
    }
    createButtons() {
      let list = [];
      if (this.props.tables) {
        for (let i = 0; i < this.props.tables.length; i++) {
          list.push(
            <li key={i}>
              <button onClick={this.handleButton.bind(this,i)}>{this.props.tables[i].name}</button>
            </li>
          )
        }
      }
      return list
    }
    render() {
      return (
        <div className="Dropdown">
          <h1>{this.props.tables[this.props.item].name} <i className="arrow down"/></h1>
          <ul className="Dropdown-content">
            {this.createButtons()}
          </ul>
        </div>
      )
    }
}
