import * as responses from './CurrentWeatherDataResponse';
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
    response: responses.Responses.CurrentWeatherDataResponse;

    constructor(response: responses.Responses.CurrentWeatherDataResponse) {
      super(MessageType.Response);
      this.response = response;

    }
    public getMain(): responses.Responses.Main {
      return this.response.main;
    }

    private getProperty(prop: string) {
      var tmp: any = this.response;
      prop.split(".").forEach(p => tmp = tmp[p])
      return tmp;
    }
    // a - b ==> acending
    // b - a ==> decending
    public compareTo(other: WeatherResponse, property: string) :any {
      let ourProperty = this.getProperty(property);
      let otherProperty = other.getProperty(property)
      if(typeof ourProperty === "string"){
        return ourProperty > otherProperty
      } else {
        return ourProperty - otherProperty
      }
    }
  }
}
