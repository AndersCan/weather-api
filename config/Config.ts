export module Config {
  export function getWorkerSettings() : any {
    return {
      exec: "Worker.js",
      args: [getApiKey()],
      silent: false
    }
  }

  export function getApiKey() : string{
    return process.env.OPENWEATHER_API_KEY || "Your API Key Here";
  }
}
