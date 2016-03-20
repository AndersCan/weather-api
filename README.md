# Weather-API
Simple weather-api written in TypeScript using node.js cluster for multi-threading. The API used is provided by  http://openweathermap.org/current

## Setup
### TypeScript
To compile the app the TypeScript compiler is required. Also the typings module is required. Both can be installed by running

    npm install tsc -g
    npm install typings -g
Also we need to download the definition files. (Run in the application root folder)

    typings install
Now you should be able to compile the .ts files.
To run the project we will also need to download the required dependencies which can be installed by running:

    npm install

## Running the program
To make a request for London, Paris, New York...(type as many cities as you want):

    node app.js london paris 'new york'
Notice that 'new york' need to be enclosed in quotes.

If you want to sort the output, add the flag `--sortBy [property]`. This property is based on the sample request shown at the bottom of this document.

###Some examples:
To sort on name:

    nodejs app.js London Paris --sortBy name
To sort on temperature,

    nodejs app.js London Paris --sortBy main.temp

To sort on wind speed:

    nodejs app.js London Paris --sortBy wind.speed

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
