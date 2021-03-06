// minimist is a library for transforming an array to a object with
// support for options such as '--sortBy'
import * as minimist from "minimist"

interface IArgumentsValidator {
  isValid(args: string[]): boolean;
  getArgumentsObject(args: string[]): any;
}
export class ArgumentsValidator implements IArgumentsValidator {
  isValid(args: string[]) {
    let trimmed = this.removeNodeAndFilename(args)
    return this.isNotEmpty(trimmed) && this.containsCities(trimmed);
  }
  getArgumentsObject(args: string[]): Arguments{
    let obj : any = minimist(this.removeNodeAndFilename(args));
    let sortBy = "main.temp";
    if('sortBy' in obj){
      sortBy = obj.sortBy
    }
    return new Arguments(obj._, sortBy)
  }

  isNotEmpty(args: string[]) {
    return args.length > 0
  }

  removeNodeAndFilename(args: string[]): string[] {
    return args.filter((element, index) => index > 1)
  }

  containsCities(args: string[]): boolean {
    let argObject = minimist(args);
    return '_' in argObject && argObject._.length > 0
  }
}

export class Arguments {
  cities: string[];
  sortBy: string;

  constructor(cities: string[], sortBy: string) {
    this.cities = cities;
    this.sortBy = sortBy;
  }

}
