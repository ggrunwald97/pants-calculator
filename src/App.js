import React, { Component } from 'react';
import '@material/react-button/dist/button.css';
import TextField, {Input} from '@material/react-text-field';
import '@material/react-text-field/dist/text-field.css';
import './App.css';
import 'react-open-weather/lib/css/ReactWeather.css';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Spacer from 'terra-spacer';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  }
});

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
  const API_CALL = 'http://api.weatherstack.com/current?access_key='+OPENWEATHER_KEY+'&query='+city+'&units=f'

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
  console.log(tempData.current.feelslike);
  this.setState({hits: tempData.current.feelslike})
  this.setData()
}

setData() {
  const FTemp = this.state.hits
  var message = ''
  this.setState({temperature: FTemp})
  if(this.state.city === '')
    message = 'To get a pants prediction, enter your current city in the box above.'
  else if(FTemp < 50 && FTemp >= 40)
    message = "You should wear/bring pants today. Just in case."
  else if(FTemp < 40 && FTemp >= 30)
    message = "You should wear the pant."
  else if(FTemp <= 10)
    message = "You sure you wanna practice today??? Wear a s***load of clothes"
  else if(FTemp < 30 && FTemp > 10)
    message = "You should definitely wear pants today. Lots of pant."
  else if(FTemp >= 50 && FTemp <= 58)
    message = "You don't need pants today! Hooray!"
  else if (FTemp > 58 && FTemp <= 85)
    message = "It's shorts weather, boiiiiiii!"
  else if(FTemp > 85 && FTemp <=90)
    message = "It's hot as balls. You don't need pants."
  else if(FTemp > 90)
    message = "Achievement unlocked: Roasty Toasty"
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
    let {
          displayCity,
          displayMessage,
          hits
        } = this.state;
    const text =  hits ? `Today's temperature is ${hits}° F.` : ''

    return (
      <ThemeProvider theme={darkTheme}>
        <div className="App">
          <Spacer padding="large+1">
            <Paper elevation={0}>
                <p className="Header-text">
                  Pants Calculator v2.1
                </p>
                <link rel="stylesheet"
                  href="https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.9/css/weather-icons.min.css"
                  type="text/css"/>
                <div>
                  {text}
                </div>
                <Spacer paddingBottom="large+1">
                  <Spacer isInlineBlock paddingRight="large+1">
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
                  </Spacer>
                  <Spacer isInlineBlock>
                    <Button
                      onClick={() => this.manipulateCity()}
                      variant="contained"
                      color="primary"
                    >
                      Submit
                    </Button>
                  </Spacer>
                </Spacer>
          <Spacer paddingLeft="large+2" paddingRight="large+2" paddingBottom="large">
            <p className="Output">{displayMessage}</p>
            <p className="contact">contact: greggrunwald@gmail.com</p>
          </Spacer>
          </Paper>
          </Spacer>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
