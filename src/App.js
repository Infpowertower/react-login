import React, { Component } from 'react';
import './App.css';

const URL = "http://localhost:8001/";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    testRequest()
      .then((xhr) => {
        console.log(xhr.response);
        const data = xhr.response;
        this.setState({data: data});
      })
      .catch((error) => console.error(error));
  }

  render() {
    console.log(this.state.data);
    return (
      <div className="App">
        {this.state.data ? <table><tbody>
          {this.state.data.map((element, index) => {
            return(
            <tr key={index}>
              {Object.entries(element).map((element, index) => {
                if (typeof element[1] !== 'object') {
                  return(<td key={index}>{element[1]}</td>)
                }
                else {
                  let date = "";
                  Object.entries(element[1]).map((element, index) => {
                    date += element[1];
                    if (index < 2) {
                      date += ".";
                    }
                  })
                  return(<td key={index}>{date}</td>)
                }
                }
              )}
            </tr>
            )
            }
          )}
        </tbody></table>: <p>No data!</p>}
      </div>
    )
  }
}

async function testRequest() {
  const result = await doRequest("GET", "data");
  return result;
}

function doRequest(method, url, data) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status.toString().charAt(0) === '2') {
          resolve(xhr);
        }
        else {
          reject(xhr);
        }
      }
    }
    xhr.open(method, URL+url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.responseType ="json";
    xhr.send(JSON.stringify(data));
  })
}

export default App;
