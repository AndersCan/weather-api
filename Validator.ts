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
  getArgumentsObject(args: string[]): minimist.ParsedArgs {
    return minimist(
      this.removeNodeAndFilename(args)
      );
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
