import * as cluster from "cluster";
import * as os from "os";
import * as http from "http";
import * as validator from "./Validator";

const api_key = "a624b84a21d994479496009e79db8824";

const clusterSettings =  {
    exec: "Worker.js",
    args: [api_key],
    silent: false
}
cluster.setupMaster(clusterSettings);

cluster.on("message", (msg) => {
  console.log("Master got");
  console.log(msg);
})

if (cluster.isMaster) {
  const cmdLineArguments = process.argv;
  const argValidator = new validator.ArgumentsValidator();

  if (!argValidator.isValid(process.argv)) {
    console.error("Invalid arguments given");
    console.error("Correct format is...");
    process.exit(0);
  }

  const cmdLineObjArguments = argValidator.getArgumentsObject(process.argv);
  const requested_cities = cmdLineObjArguments._;
  console.log(requested_cities);
  requested_cities.forEach(cityname => {
    let worker = cluster.fork();
    // worker.on("message", (msg) => console.log("Worker got: " + msg))
    worker.send({city: cityname});

  })
}
