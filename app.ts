import * as cluster from "cluster";
import * as validator from "./Validator";
import * as models from "./models/Messages";
import * as config from "./config/Config";

// Global
const RESULTS: models.Messages.WeatherResponse[] = [];
var cmdLineObjArguments: validator.Arguments;

const argValidator = new validator.ArgumentsValidator();


// Make sure given arguments are valid
const CMD_LINE_ARGS = process.argv;
if (!argValidator.isValid(CMD_LINE_ARGS)) {
  console.error("Invalid arguments given");
  console.error("Syntax: [cities...] [option]");
  console.error("example: london paris oslo --sortBy [name, main.temp]");
  process.exit(0);
}
cmdLineObjArguments = argValidator.getArgumentsObject(process.argv);

configureCluster(cluster);
// Spawn a worker for all the requested cities
var requested_cities = cmdLineObjArguments.cities;
requested_cities.forEach(cityname => {
  let worker = cluster.fork();
  worker.send(new models.Messages.WeatherRequest(cityname));
})

function configureCluster(cluster): void {
  configureClusterWorkers(cluster);
  configureMasterMessageListener(cluster);
}

// Set config for Workers spawned by forks.
function configureClusterWorkers(cluster): void {
  const clusterSettings = config.Config.getWorkerSettings();
  cluster.setupMaster(clusterSettings);
}

// Set eventhandler for when Master receives messages
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

// Add messages to RESULTS if it is a valid message
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

// Activate FinalEvent if we have received all requested cities from workers.
function tryFinalEvent() {
  if (RESULTS.length === requested_cities.length) {
    handleFinalEvent();
  }
}
// Sort and print results. Program should terminate after this method is called.
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
  })
}
// Check that object has property 'msgType'
function hasMessageType(msg: any): boolean {
  return 'msgType' in msg;
}
