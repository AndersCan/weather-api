import * as models from "./models/Messages";
import * as http from "http";

const api_key = process.argv[2];
var sent = false;

// Set eventhandler for Worker. 
process.on('message', function(msg) {

  handleMessage(msg);
  // Incase HTTP request crashes without giving an error. Might be because
  // of too many workers making http request?
  setTimeout(() => {
    handleMessage(msg)
  }, 1000)
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
