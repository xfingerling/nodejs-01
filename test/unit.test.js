const should = require("should");
var sinon = require("sinon");

const AuthController = require("../api/auth/auth.controller");
const jwt = require("jsonwebtoken");

describe("Unit Tests", () => {
  describe("Authentication", () => {
    let sandbox;
    let jwtVerifyStub;

    let actualResult;

    const testEmail = "email@email.com";
    const testPass = "password";
    const testToken = "token";
    const testJvtSecret = "secret";

    before(async () => {
      sandbox = sinon.createSandbox();
      jwtVerifyStub = sandbox.stub(jwt, "verify").callsFake(() => {
        return Promise.resolve({ success: "Token is valid" });
      });

      try {
        await AuthController.auth(testEmail, testPass);
      } catch (err) {
        actualResult = err;
      }
    });

    after(() => {
      sandbox = sinon.restore();
    });

    it("should call jwt verify", () => {});
  });
});
