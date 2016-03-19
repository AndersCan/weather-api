export module Messages {
  export enum MessageType {
    Request,
    Response
  };

  export abstract class Message {
    msgType: MessageType;

    constructor(mt: MessageType){
      this.msgType = mt;
    }

  }
  export class WeatherRequest extends Message{
    city: string;
    constructor(city: string) {
      super(MessageType.Request);
      this.city = city;
    }
  }

  export class WeatherResponse extends Message{
    city: string;
    temperature: number;

    constructor(city: string, temperature: number) {
      super(MessageType.Response);
      this.city = city;
      this.temperature = temperature;

    }
  }

}
