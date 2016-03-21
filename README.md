# Weather-API
Simple weather-api written in TypeScript using node.js cluster for multi-threading. The API used is provided by  http://openweathermap.org/current

## Setup
### TypeScript
The TypeScript compiler is needed to compile the `.ts` files to `.js`. We also require the typings module. They can be installed by running

    npm install tsc -g
    npm install typings -g
Also we need to download the definition files. (Run in the application root folder)

    typings install
Now you should be able to compile the .ts files.

    tsc
To run the project we will also need to download the required dependencies which can be installed by running:

    npm install

## Running the program
Before running, must either edit the Config.ts file to include your API key or add it as an environmental variable:

        export OPENWEATHER_API_KEY=[Your API key]
Failure to give a valid API key will give a error of being unable to parse a HTML file as a Json document. There is no error checking code for the API key.

To make a request for London, Paris, New York...(type as many cities as you want):

    node app.js london paris 'new york'
Notice that 'new york' needs to be enclosed in quotes.

If you want to sort the output, add the flag `--sortBy [property]`. This property can be set to any of the properties shown in the sample request located at the bottom of this document.

###Some examples:
To sort on name:

    nodejs app.js London Paris --sortBy name
To sort on temperature,

    nodejs app.js London Paris --sortBy main.temp

To sort on wind speed:

    nodejs app.js London Paris --sortBy wind.speed
# Design
## Master
In its most basic form, the `app.ts`(master) file creates a worker for each requested city and outputs the final result returned from the workers. The master communicates with the workers through inter-process communication (IPC). All the results received by the master is stored in a list. Once all the requests have been received it will sort the output and print the result. (To not spam the console, it will only print the city name followed by the `main` object)

## Worker
The worker is created and waits for a request to be received. Once it receives a request it will make a HTTP request for the given city and send the result back to the master node. After having sent the response to the master the worker process will terminate.

## Quick description of additional files
### Config.ts
Used to configure the application. Sets what .js file should be used as the Worker for the Master and also contains a method for retrieving the API key.

### Validator.ts
Used for parsing the arguments given when running the application. It can validate the input and output an `Arguments` object that contains the requested cities and the sortBy parameter.

### Messages.ts
The message file contains the message types that are sent to and from the Worker and Master node. The master node send `WeatherRequest` while the worker returns a `WeatherResponse`. Messages sent through the IPC seem to lose their type, so the Enum class MessageType was created to seperate between there two types of messages. This file also contains the interface for the responses

### CurrentWeatherDataResponse.ts
Contains the Interfaces needed to model the response received from Openweathermap.


### Sample response
Use this response to determine what you want to sort by.

    { 
      coord: 
      { 
        lon: -0.13, 
        lat: 51.51 
      },
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
