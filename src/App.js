import React, { Component } from 'react';
import './App.css';
import { NavBar } from './components/NavBar';
import { InterfacePanel } from './components/interfacePanel';
import * as helper from './helpers';
import LoadingGif from './media/Pacman.gif';
import DeleteIcon from './media/icon_delete.png'

/*
Dies ist die Hauptkomponente. Sie ist dafür da, die Unterkomponenten (NavBar und Main) aufzurufen.
Außerdem kümmert sie sich um die Verwaltung von Daten und dem Backend quasi das Kernstück der Anwendung.
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: 0,
      tables: [{url: "index", name: "index"}],
      getData: null,
      currentData: null,
      interfaceActive: false,
      interfaceId: 10,
      response: null,
      loading: false,
    };
    //Binding wird benötigt, um mit "this" auf Unterfunktionen von App zuzugreifen.
    this.handleButton = this.handleButton.bind(this);
    this.handleNewButton = this.handleNewButton.bind(this);
    this.toggleInterface = this.toggleInterface.bind(this);
    this.getData = this.getData.bind(this);
    this.loadData = this.loadData.bind(this);
    this.doRequest = this.doRequest.bind(this);
    this.handleNewSubmit = this.handleNewSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAlter = this.handleAlter.bind(this);
    this.disableLoading = this.disableLoading.bind(this);
    this.getTables = this.getTables.bind(this);
    this.loadTables = this.loadTables.bind(this);
  }

  //Wird beim ersten Aufrufen der Webseite ausgeführt und fordert Daten an.
  componentDidMount() {
    this.getTables();
  }

  getTables() {
    this.doRequest("GET", this.loadTables);
  }

  loadTables(response) {
    let data = response;
    let result = [];
    for (let i = 0; i < data.length; i++) {
      result.push({url: Object.entries(data[i])[0][1], name: Object.entries(data[i])[0][1]});
    }
    this.setState({tables: result, loading: false}, () => {
      this.getData();
    });
  }

  //Wenn man im Dropdownmenü einen neuen Unterpunkt auswählt, wird diese Funktion aktiv und fordert neue Daten an.
  handleButton(id, data) {
    if (!data) {
      this.setState({getData: null});
    }
    else {
      this.setState({getData: data});
    }
    this.setState({item: id}, function() {
      this.getData();
    });
  }

  //Schaltet das Interface an, wenn der Neu-Button gedrückt wird.
  handleNewButton(id) {
    this.setState({interfaceId: id}, function() {
      this.toggleInterface();
    });
  }

  //Schaltet ein Interface an oder aus, welches wie ein Pop-up funktioniert. S. class interfacePanel
  toggleInterface() {
    this.setState({interfaceActive: !this.state.interfaceActive});
  }

  //Loggt, wenn die Kommunikation mit dem Backend nicht wie geplant verläuft.
  reqListener (evt) {
    if (this.status.toString().charAt(0) !== '2') {
      console.log("RequestError: "+this.status+" - "+this.statusText);
      console.log(this);
    }
  }

  //Loggt, wenn die Kommunikation mit dem Backend abbricht.
  transferFailed (evt) {
    console.log("Something went terribly wrong! Please consult a backend-developer!")
  }

  //Wird ausgelöst, wenn das Neu-Formular ausgefüllt abgeschickt wird und sendet die Daten ans Backend.
  handleNewSubmit(data) {
    this.toggleInterface();
    console.log("data: " + JSON.stringify(data));
    if (data) {
      this.doRequest("POST", this.getData, data);
    }
  }

  //Teilt dem Backend mit, dass Daten geändert werden sollen
  handleAlter(data) {
    console.log("handleAlter with data: " + JSON.stringify(data));
    this.doRequest("PUT", this.getData, data);
  }

  //Wird von einem Button ausgelöst und schickt eine DELETE-Anfrage ans Backend.
  handleDelete (evt) {
    const id = evt.target.id;
    const idKey = helper.getIdKey(this.state.currentData);
    console.log("data: "+JSON.stringify([{[idKey]: id}]));
    if (id) {
      this.doRequest("DELETE", this.getData, [{[idKey]: id}]);
    }
  }

  //Daten aus dem Backend anfordern.
  getData(data) {
    if (!this.state.getData) {
      this.doRequest("GET", this.loadData);
    }
    else {
      this.doRequest("GET", this.loadData, this.state.getData);
    }
  }

  //Empfangene Daten aus dem Backend in Tabelle laden
  loadData (response) {
    this.setState(
      {currentData: response,
        loading: false,
      }
    );
  }

  /*
	Diese Funktion formalisiert die Kommunikation mit dem Backend. Sie kann benutzt werden, um Daten zu senden
	oder diese anzufordern.
	 */
  doRequest(method, callback, data) {
    let url = this.state.tables[this.state.item].url;
    console.log(url);
    if (url) {
      if (method === "GET") {
        this.setState(
          {loading: true,
            currentData: null,
          }
        );
        if (data) {
          url = url + "?" + Object.keys(data)[0]+"="+Object.values(data)[0];
          data = null;
        }
      }
      else {
        this.setState({loading: true});
      }
      let xhr = new XMLHttpRequest();
      xhr.addEventListener("load", this.reqListener);
      xhr.addEventListener("error", this.transferFailed);
      const disableLoading = this.disableLoading;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status.toString().charAt(0) === '2') {
            //console.log(xhr.response);
            callback(xhr.response);
          }
          else {
            disableLoading();
          }
        }
      };
      //xhr.open(method, "/api/"+url);
      xhr.open(method, "http://localhost:8080/api/"+url);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.responseType ="json";
      xhr.send(JSON.stringify(data));
      return xhr;
    }
    return null;
  }

  //Schaltet die Ladeanimation aus
  disableLoading() {
    this.setState({loading: false});
  }

  render() {
    return (
      <div className="App">
        <NavBar
          item={this.state.item}
          tables={this.state.tables}
          handleButton={this.handleButton}
        />
        <Main
          item={this.state.item}
          data={this.state.currentData}
          loading={this.state.loading}
          handleNewButton={this.handleNewButton}
          handleAlter={this.handleAlter}
          handleDelete={this.handleDelete}
          handleSwitchIdButton={this.handleButton}
        />
        {this.state.interfaceActive ?
          <InterfacePanel
            toggleInterface={this.toggleInterface}
            id={this.state.interfaceId}
            item={this.state.item}
            data={this.state.currentData}
            handleNewSubmit={this.handleNewSubmit}
          />
          : null}
      </div>
    );
  }
}

/*
Main ist die Hauptfunktion dieser App. Sie zeigt die Daten aus dem Backend an und stellt Buttons bereit, um diese zu
erstellen, löschen und zu verändern. Dabei gibt sie aber alle Anfragen an App (ihr Elternteil) weiter.
 */
class Main extends Component {

  render() {
    let keys = helper.getKeys(this.props.data);
    let colSpan = keys.length + 1;
    return (
      <div className="Main">
        {
          // Prüft, ob Daten noch geladen werden und Daten da sind. Zeigt entweder Ladeanimation, Fehlermeldung oder
          // die Daten in einer Tabelle an.
        }
        {!this.props.loading ?
          (keys.length > 0 ?
            <table className="Datatable">
              {!(Object.keys(this.props.data[0])[0] === 'column_name') ? <thead>
                {
                  // Zeigt die (formatierten) Überschriften der Datentabelle aus dem Backend an.
                }
                <tr>
                  {keys.map((element, index) => {
                    return(<td className="Table-head" key={index}>{element}</td>)
                  })}
                  <td className="Table-item" key={keys.length+1}> </td>
                </tr>
                </thead>:
                <thead>
                <tr><td className="Table-item Table-id">Es sind noch keine Daten vorhanden.</td></tr>
                </thead>
              }
              <tbody>
              {
                // Hier werden die Daten ausgepackt und in einzelne Tabellenreihen eingefügt.
              }
              {!(Object.keys(this.props.data[0])[0] === 'column_name') ? this.props.data.map(
                (arrayElement, arrayIndex) => {
                  return(
                    <Tablerow
                      className="Table-row"
                      key={arrayIndex}
                      item={this.props.item}
                      data={arrayElement}
                      handleAlter={this.props.handleAlter}
                      handleDelete={this.props.handleDelete}
                      handleSwitchIdButton={this.props.handleSwitchIdButton}
                    />
                  )
                }
              ): null}
              <tr>
                <td colSpan={colSpan} align="center">
                  <button id="New-button" onClick={this.props.handleNewButton.bind(this, "0")}>
                    Neu
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
            : <table className="Datatable"><thead><tr><td className="Table-item Table-id">Verbindung zum Server fehlgeschlagen ;-(</td></tr>
            </thead></table>)
          : <img id="loading" src={LoadingGif} alt="loading..."/>}
      </div>
    )
  }
}


//Füllt eine Tabellenreihe mit den Daten.
class Tablerow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.data,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickPortsButton = this.handleClickPortsButton.bind(this);
    this.handleClickNetworkButton = this.handleClickNetworkButton.bind(this);
  }

  //Wenn das bearbeitete Feld verlassen wird, durch Enter o.Ä.
  handleSubmit(evt, datakey) {
    let value = evt.target.value;
    const type = helper.resolveDataType(datakey);
    if (type === "number" || type === "price") {
      value = parseInt(value);
    }
    if (value !== this.state[datakey]) {
      this.setState(
        {[datakey]: value},
        () =>
        {
          let data = [];
          let id = helper.getIdKey(this.props.data);
          if (id) {
            data.push({[id]: this.props.data[id]});
            data.push({[datakey]: value});
            this.props.handleAlter(data);
          }
          else {
            console.log("ERROR: ID not found!");
          }
        }
      );
    }
  }

  // Funktion für Ports-Knopf bei Geräte und Switch. Macht es möglich, auf Switchports zuzugreifen.
  handleClickPortsButton(evt) {
    let id = helper.getIdKey(this.props.data);
    this.props.handleSwitchIdButton(35, {"F_Key_GeraeteId": this.props.data[id]});
  }

  // Funktion für Ports-Knopf bei Geräte. Macht es möglich, auf Netzwerkkarten zuzugreifen.
  handleClickNetworkButton(evt) {
    let id = helper.getIdKey(this.props.data);
    this.props.handleSwitchIdButton(40, {"F_Key_GeraeteId": this.props.data[id]});
  }

  // Füllt die Tabellenzeile mit Daten und erstellt den Lösch-button
  fillRow(data) {
    let dataArray = [];
    try {
      dataArray = Object.entries(data);
    }
    catch(err) {
      console.log("ERROR: Can't read data");
      console.log(data);
      return [];
    }
    let row = [];
    dataArray.forEach((element, index) => {
      row.push(
        <Tableitem
          item={this.props.item}
          handleSwitchIdButton={this.handleSwitchIdButton}
          type={element[0]}
          handleSubmit={this.handleSubmit}
          key={index}
          content={element[1]}
        />
      );
    });
    let buttonStyle = {backgroundImage: DeleteIcon};
    if (row.length > 0) {
      row.push(
        <td
          className="Table-item"
          key={row.length}
        >
          <button
            className="Delete-button"
            style= {buttonStyle}
            id={Object.entries(data)[0][1]}
            onClick={this.props.handleDelete}
          >X</button>
        </td>)
    }
    return row
  }

  render() {
    return(
      <tr className={this.props.className}>
        {this.fillRow(this.props.data)}
      </tr>
    )
  }
}

//Zuständig für ein einzelnes Feld in der Tabelle
class Tableitem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
    };
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleKeyPress(evt) {
    if (evt.key === 'Enter') {
      this.handleSubmit(evt);
    }
  }

  handleClick(evt) {
    this.setState({edit: true});
  }

  handleSubmit(evt) {
    this.setState({edit: false});
    this.props.handleSubmit(evt, this.props.type);
  }

  render() {
    let additionalClass = "";
    let content = this.props.content;
    if (!content && content !== 0 && content !== "0") {
      content = "";
    }
    let additionalContent= "";
    let editable = true;
    let type = "text";
    let min = null;
    let step = null;
    let handleClickFunction = this.handleClick;
    switch(helper.resolveDataType(this.props.type)) {
      case "date":
        additionalClass = "align-right";
        content = helper.formatData(content);
        type = "date";
        editable = true;
        break;
      case "price":
        additionalContent = "€";
        step = "0.01";
      case "id":
        if (this.props.type.includes("F_Key_")) {
          additionalClass = "Table-id align-right";
          editable = false;
          min="0";
          break;
        }
        additionalClass = "align-right";
        type = "number";
        min= "0";
        break;
      case "number":
        additionalClass = "align-right";
        type = "number";
        min= "0";
        if (step) {
          step = "1";
        }
        break;
      default:
        break;
    }
    if (!this.state.edit) {
      return (
        <td
          onClick={editable ? handleClickFunction: null}
          className={"Table-item "+ additionalClass}
        >
          {content+additionalContent}
        </td>
      )
    }
    else {
      return(
        <td className={additionalClass}>
          <input
            defaultValue={this.props.content}
            type={type}
            min={min}
            step={step}
            onBlur={type === 'number' || type === 'price' ? null: this.handleSubmit} // workaround for Firefox-Bug
            onKeyPress={this.handleKeyPress}
            autoFocus
          />
        </td>
      )
    }
  }
}

export default App;
