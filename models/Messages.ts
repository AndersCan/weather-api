export module Messages {
  export enum MessageType {
    Request,
    Response
  };

  export abstract class Message {
    msgType: MessageType;

    constructor(mt: MessageType) {
      this.msgType = mt;
    }

  }
  export class WeatherRequest extends Message {
    city: string;
    constructor(city: string) {
      super(MessageType.Request);
      this.city = city;
    }
  }

  export class WeatherResponse extends Message {
    response: Response;

    constructor(response: Response) {
      super(MessageType.Response);
      this.response = response;

    }
    public getMain(): Main {
      return this.response.main;
    }

    private getProperty(prop: string) {
      var tmp: any = this.response;
      prop.split(".").forEach(p => tmp = tmp[p])
      return tmp;
    }
    // a - b ==> acending
    // b - a ==> decending
    public compareTo(other: WeatherResponse, property: string) {
      return this.getProperty(property) - other.getProperty(property)
    }
  }

  interface Coord {
    lon: number;
    lat: number;
  }

  interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
  }

  interface Main {
    temp: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  }

  interface Wind {
    speed: number;
    deg: number;
    gust: number;
  }

  interface Clouds {
    all: number;
  }

  interface Sys {
    type: number;
    id: number;
    message: number;
    country: string;
    sunrise: number;
    sunset: number;
  }

  export interface Response {
    coord: Coord;
    weather: Weather[];
    base: string;
    main: Main;
    visibility: number;
    wind: Wind;
    clouds: Clouds;
    dt: number;
    sys: Sys;
    id: number;
    name: string;
    cod: number;
  }
}
