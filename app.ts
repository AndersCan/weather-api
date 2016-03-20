import * as cluster from "cluster";
import * as validator from "./Validator";
import * as models from "./models/Messages";
import * as config from "./config/Config";

// Global
const RESULTS: models.Messages.WeatherResponse[] = [];
var cmdLineObjArguments: validator.Arguments;

if (cluster.isMaster) {
  const cmdLineArguments = process.argv;
  const argValidator = new validator.ArgumentsValidator();

  if (!argValidator.isValid(process.argv)) {
    console.error("Invalid arguments given");
    console.error("Syntax: [option] [cities...]");
    console.error("example: london paris oslo --sortBy [temp, humidity, temp_min, temp_max]");
    process.exit(0);
  }

  configureCluster(cluster);
  cmdLineObjArguments = argValidator.getArgumentsObject(process.argv);
  var requested_cities = cmdLineObjArguments.cities;
  requested_cities.forEach(cityname => {
    let worker = cluster.fork();
    worker.send(new models.Messages.WeatherRequest(cityname));
  })
}

function configureCluster(cluster): void {
  configureClusterWorkers(cluster);
  configureMasterMessageListener(cluster);
}

function configureClusterWorkers(cluster): void {
  const clusterSettings = config.Config.getWorkerSettings();
  cluster.setupMaster(clusterSettings);
}

function configureMasterMessageListener(cluster): void {
  cluster.on("message", (msg) => {
    if (hasMessageType(msg)) {
      handleMessage(msg)
    } else {
      console.error("Unknown message received");
      console.error(msg);
    }
  })
}

function handleMessage(msg: any) {
  if (msg.msgType === models.Messages.MessageType.Request) {
    console.error("Request sent to master");
  } else if (msg.msgType === models.Messages.MessageType.Response) {
    RESULTS.push(new models.Messages.WeatherResponse(msg.response));
    tryFinalEvent();
  } else {
    console.error("Unknown message type")
  }
}

function tryFinalEvent() {
  if (RESULTS.length === requested_cities.length) {
    handleFinalEvent();
  }
}

function handleFinalEvent() {
  // Sort and print
  sortResult();
  printResult();
}

function sortResult() {
  RESULTS.sort((a, b) => a.compareTo(b, cmdLineObjArguments.sortBy));
}
function printResult() {
  RESULTS.forEach(wr => {
    console.log(wr.response.name);
    console.log(wr.getMain());
    // console.log(wr.response.name + " : " + wr.response.main.temp + " : " + wr.response.main.humidity)
  })
}

function hasMessageType(msg: any): boolean {
  return 'msgType' in msg;
}
