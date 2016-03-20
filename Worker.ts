import * as models from "./models/Messages";
import * as responses from './models/CurrentWeatherDataResponse';
import * as http from "http";
const api_key = process.argv[2];
var sent = false;

process.on('message', function(msg) {

  handleMessage(msg);
  // Incase HTTP request crashes for a unknown reason
  setTimeout(() => {
    handleMessage(msg)
  }, 2000)
});

function handleMessage(msg) {
  if (!sent && msg.msgType === models.Messages.MessageType.Request) {
    let request: models.Messages.WeatherRequest = <models.Messages.WeatherRequest>msg;
    var url = 'http://api.openweathermap.org/data/2.5/weather?';
    url += `q=${request.city}&`;
    url += `appid=${api_key}&`;
    url += "units=metric";

    http.get(url, (res) => {
      res.on("data", function(chunk) {
        let response = JSON.parse(chunk);
        //console.dir(response);
        sent = true;
        process.send(new models.Messages.WeatherResponse(response));
        process.exit(0);
      });

      // consume response body
      res.resume();
    }).on('error', (e) => {
      console.log(`HTTP error: ${e.message}`);
      console.log(e);
    });
  }


}

var testResponse: responses.Responses.CurrentWeatherDataResponse = {
  coord: { lon: -0.13, lat: 51.51 },
  weather: [{ id: 1, main: "", description: "", icon: "" }],
  base: 'cmc stations',
  main:
  {
    temp: 8.29,
    pressure: 1025,
    humidity: 57,
    temp_min: 7,
    temp_max: 10.1
  },
  visibility: 0,
  wind: { speed: 4.6, deg: 70, gust: 0 },
  clouds: { all: 75 },
  dt: 1458477691,
  sys:
  {
    type: 1,
    id: 5091,
    message: 0.0047,
    country: 'GB',
    sunrise: 1458453672,
    sunset: 1458497708
  },
  id: 2643743,
  name: 'London',
  cod: 200
}
