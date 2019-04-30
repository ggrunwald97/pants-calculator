import React, { Component } from 'react';
import Button from '@material/react-button';
import '@material/react-button/dist/button.css';
import TextField, {Input} from '@material/react-text-field';
import '@material/react-text-field/dist/text-field.css';
import './App.css';
import ReactWeather from 'react-open-weather';
import 'react-open-weather/lib/css/ReactWeather.css';
class App extends Component {
  state = { 
    hits: '',
    temperature: '',
    displayMessage: 'To get a pants prediction, enter a city or zip code in the box above.',
    city: '',
    displayCity: '',
  };

handleErrors(response) {
  if (!response.ok) {
    window.alert("Sorry! That city or zip code was not found. Try another.")
    throw Error(response.statusText);
  }
  return response;
}

update(city){
  const OPENWEATHER_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

  var API_CALL;
  if (!(isNaN(city))) { // If the user enters a zip code (integer)
    API_CALL = 'https://api.openweathermap.org/data/2.5/weather?zip='+city+',us&APPID='+OPENWEATHER_KEY
  }
  else { // if the user enters a city (string)
    API_CALL = 'https://api.openweathermap.org/data/2.5/weather?q='+city+',usa&APPID='+OPENWEATHER_KEY
  }
  fetch(API_CALL)
    .then(this.handleErrors)
    .then(response => { return response.json()
    })
    .then(responseJson => {this.printfunc(responseJson)
    }).catch(function(error) {
      console.log(error);
    })
  }
  
printfunc(tempData) {
  console.log(tempData)
  this.setState({hits: tempData["main"]["temp"]})
  console.log(JSON.stringify(tempData,null, "\t"))
  this.setData()
}

setData() {
  const KTemp = this.state.hits
  let FTemp = (KTemp -273.15)*(9/5) +32
  var message = ''
  FTemp = Math.round(FTemp)

  this.setState({temperature: FTemp})
  console.log(FTemp)
  if(this.state.city === '')
    message = 'To get a pants prediction, enter your current city in the box above.'
  else if(FTemp < 50 && FTemp >= 32)
    message = "You should wear pants today."
  else if(FTemp <= 10)
    message = "You sure you wanna practice today??? Wear a s***load of clothes"
  else if(FTemp < 32 && FTemp > 10)
    message = "You should definitely wear pants today, and bring multiple layers."
  else if(FTemp >= 50 && FTemp <= 85)
    message = "You don't need pants today! Hooray!"
  else if(FTemp > 85)
    message = "It's hot as balls. You don't need pants."
  this.setState({displayMessage: message})
}

manipulateCity(){
  var theCity = this.state.displayCity
  if(theCity === 'null' || '')
    theCity = ''
  var shortCity = theCity.split(' ').join('');
  this.setState({city: shortCity})
  this.update(shortCity)
}

  render() {
    let { displayCity,
          displayMessage } = this.state;
  
    return (
      <div className="App">
        <p className="Header-text">
          Pants Calculator v2.0
        </p>
        <link rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.9/css/weather-icons.min.css" 
          type="text/css"/>
        <ReactWeather
          forecast="5days"
          unit="imperial"
          apikey={process.env.REACT_APP_WEATHERCOMPONENT_API_KEY}
          type="auto"
        />
        <TextField 
          className="Textbox"
          label="Enter city or zip code" 
        >
          <Input
            className="Textfield"
            value={displayCity}
            onChange={(e) => this.setState({displayCity: e.currentTarget.value})}
          />
        </TextField>
        <Button onClick={() => this.manipulateCity()}>Submit</Button>
        <p className="Output">{displayMessage}</p>
        <p className="contact">contact: greggrunwald@gmail.com</p>
      </div>
    );
  }
}

export default App;