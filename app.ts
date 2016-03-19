import * as cluster from "cluster";
import * as os from "os";
import * as http from "http";
import * as validator from "./Validator";
import * as models from "./models/Messages";
const api_key = "";


if (cluster.isMaster) {
  const cmdLineArguments = process.argv;
  const argValidator = new validator.ArgumentsValidator();

  if (!argValidator.isValid(process.argv)) {
    console.error("Invalid arguments given");
    console.error("Correct format is...");
    process.exit(0);
  }

  configureCluster(cluster);
  const cmdLineObjArguments = argValidator.getArgumentsObject(process.argv);
  const requested_cities = cmdLineObjArguments._;
  console.log(requested_cities);
  requested_cities.forEach(cityname => {
    let worker = cluster.fork();
    // worker.on("message", (msg) => console.log("Worker got: " + msg))
    worker.send({ city: cityname });

  })
}

function configureCluster(cluster): void {
  configureClusterWorkers(cluster);
  configureMasterMessageListener(cluster);
}

function configureClusterWorkers(cluster): void {
  const clusterSettings = {
    exec: "Worker.js",
    args: [api_key],
    silent: false
  }
  cluster.setupMaster(clusterSettings);
}

function configureMasterMessageListener(cluster): void {
  cluster.on("message", (msg) => {
    if (! ('msgType' in msg) ){
      console.error("Unknown message received");
      console.error(msg);
    } else {
      handleMessage(msg)
    }
  })
}

function handleMessage(msg: models.Messages.Message) {
  if(msg.msgType === models.Messages.MessageType.Request) {
    console.error("Request sent to master");
  } else if (msg.msgType === models.Messages.MessageType.Response) {
    console.log(msg)
  } else {
    console.error("Unknown message type")
  }
}
