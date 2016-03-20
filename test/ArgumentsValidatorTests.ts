import * as validator from "../Validator";
// import * as expect from "chai";
var expect = require('chai').expect;

describe('ArgumentValidator', () => {
  var subject: validator.ArgumentsValidator;

  beforeEach(function() {
    subject = new validator.ArgumentsValidator();
  });

  describe('#isValid', () => {
    it('Should return true for valid cities', () => {
      expect(
        subject.isValid(["node", "filename", "london", "paris"])
        ).to.be.true;
    });
    it('Should return false no cities', () => {
      expect(
        subject.isValid(["node", "filename"])
        ).to.be.false;
    });
    it('Should return false for only sortBy', () => {
      expect(
        subject.isValid(["node", "filename", "--sortBy", "temperature"])
        ).to.be.false;
    });
    it('Should return true for specific sortBy paramenter', () => {
      expect(
        subject.isValid(["node", "filename", "London", "--sortBy", "some.random.element"])
      ).to.be.true;
    });

  });

  describe('#getArgumentsObject', () => {
    it('Should return correct size cities', () => {
      expect(
        subject.getArgumentsObject(["node", "filename", "london", "paris"]).cities.length
      ).to.equal(2);
    });
    it('Should return correct city', () => {
      expect(
        subject.getArgumentsObject(["node", "filename", "london"]).cities[0]
      ).to.equal("london");
    });

    it('Sets sortBy property based on input', () => {
      expect(
        subject.getArgumentsObject(["node", "filename", "paris", "--sortBy", "some.random.element"]).sortBy
      ).to.equal("some.random.element");
    });

    it('Default value for sortBy is main.temp', () => {
      expect(
        subject.getArgumentsObject(["node", "filename", "paris"]).sortBy
      ).to.equal("main.temp");
    });

  });
});
