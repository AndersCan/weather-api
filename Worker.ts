import * as models from "./models/Messages";
import * as http from "http";

console.log("Alive");
process.on('message', function(msg) {
  const api_key = process.argv[2];
  if (msg.city) {
    // console.log('Master to worker: ', msg);
    // process.send("Okay, Getting data for " + msg.city);
    //console.log(`api.openweathermap.org/data/2.5/weather?q=${msg.city}&appid=${api_key}`);

    var url = 'http://api.openweathermap.org/data/2.5/weather?';
    url += `q=${msg.city}&`;
    url += `appid=${api_key}&`;
    url += "units=metric";
    // console.log(url);
    url = "http://www.google.com";
    http.get(url, (res) => {
      res.on("data", function(chunk) {
        // let response = JSON.parse(chunk);
        // process.send({ name: response.name, result: response.main.temp });
        process.send(new models.Messages.WeatherResponse(msg.city, 100));
        // process.send({test : "fail"});
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
