import * as models from "./models/Messages";
import * as http from "http";

process.on('message', function(msg) {
  const api_key = process.argv[2];
  if (msg.city) {
    var url = 'http://api.openweathermap.org/data/2.5/weather?';
    url += `q=${msg.city}&`;
    url += `appid=${api_key}&`;
    url += "units=metric";
    http.get(url, (res) => {
      res.on("data", function(chunk) {
        let response = JSON.parse(chunk);
        console.dir(response);
        process.send(new models.Messages.WeatherResponse(response.name, response.main.temp));
        process.exit(0);
      });
      // consume response body
      res.resume();
    }).on('error', (e) => {
      console.log(`Got error: ${e.message}`);
      console.log(e);
    });

  }
});
