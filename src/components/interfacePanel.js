import React, { Component } from 'react';
import './interfacePanel.css';
import * as helper from '../helpers';

/*
Interface stellt eine Umgebung für Nachrichten direkt an den Nutzer bereit und kann auch für Formulare zum
Erstellen und Löschen von Daten benutzt werden.
Was dargestellt wird, entscheidet eine übergebene Variable (id/this.props.id).
 */
export class InterfacePanel extends Component {
	constructor(props) {
		super(props);
		this.initPanel = this.initPanel.bind(this);
	}

	initPanel() {
		switch (this.props.id) {
			case "0":
				return(<NewPanel item={this.props.item} keys={helper.getKeys(this.props.data, false)} handleSubmit={this.props.handleNewSubmit}/>);
			default:
				return(<ErrorPanel/>);
		}
	}

	render() {
		return(
			<div id="InterfacePanel">
				<div id="panelBackground" onClick={this.props.toggleInterface}/>
				{this.initPanel()}
			</div>
		)
	}
}

/*
Das NewPanel ist für das Erstellen von neuen Daten und erzeugt ein Formular, in dem der Nutzer Eingaben machen kann.
Um das tatsächliche Schicken von Daten kümmert sich aber App.
 */
class NewPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	_onFocus (evt) {
		evt.currentTarget.type = "date";
	}

	_onBlur (evt) {
		if (!evt.currentTarget.value) {
			evt.currentTarget.type = "text";
		}
	}

	fillForm(keys) {
		let form = [];
		keys.forEach(
			(key, index) => {
				let min = null;
				let type = "text";
				let step = null;
				let required = true;
				let onFocus = null;
				let onBlur = null;
				let placeholderSuffix = "";
				let skippy = false;
				switch (helper.resolveDataType(key)) {
					case "id":
						if (!(key === "RaumNr") && !(key.includes("F_Key_"))) {
							required = false;
							placeholderSuffix = " (optional)";
						}
						type = "number";
						min = "0";
						step = "1";
						break;
					case "price":
						step = "0.01";
					case "number":
						type="number";
						break;
					case "date":
						onFocus=this._onFocus;
						onBlur=this._onBlur;
						break;
					default:
						break;
				}
				if (!skippy) {
					form.push(
						<input
							key={index}
							className="New-input"
							type={type}
							min={min}
							step={step}
							name={key}
							placeholder={helper.formatKey(key)+placeholderSuffix}
							onChange={this.handleChange}
							onFocus={onFocus}
							onBlur={onBlur}
							required={required}
						/>
					)
				}
			}
		);
		form.push(<input key={form.length+1} className="Button New-input" type="submit" value="Abschicken"/>);
		return form
	}

	handleChange(evt) {
		this.setState({[evt.target.name]: evt.target.value}, () => {
			//console.log(this.state);
		});
	}

	handleSubmit(evt) {
		evt.preventDefault();
		let data = [];
		const state = {};
		for (let key in this.state) {
			state[key] = this.state[key];
		}
		data.push(state);
		this.props.handleSubmit(data);
	}

	render() {
		return(
			<div className="panel">
				<h2>Neu</h2>
				<form onSubmit={this.handleSubmit}>
					{this.props.keys && this.props.keys.length > 0 ? this.fillForm(this.props.keys):
					<h3>Zugriff auf die Datenbank nicht möglich.</h3>}
				</form>
			</div>
		)
	}
}

/*
Für die Darstellung von Fehlermeldungen.
 */
//toDo Einfügen von dynamischen Fehlermeldungen.
class ErrorPanel extends Component {
	render() {
		return(
			<div className="panel">
				<h2>Ups, da ist etwas schief gelaufen.</h2>
				<p>Was hat da der Frontendentwickler verbockt... -.-</p>
			</div>
		)
	}
}
