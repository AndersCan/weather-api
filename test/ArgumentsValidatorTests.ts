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
  });
});
