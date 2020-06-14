const request = require("supertest");
const server = require("../server");

// arrange - set up initial app state
describe("Sanity Check", function () {
  // act - take an action
  it("Checks to see if jest is working", function () {
    // assert - make an assertion
    expect(true).toBe(true);
  });
});

describe("Environment Sanity Check", function () {
  it("Checks to see if the environment is in testing", function () {
    expect(process.env.DATABASE_ENV).toBe("testing");
  });
});

describe("Server Sanity Check", function () {
  it("GET", function () {
    return request(server)
      .get("/")
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.text).toContain("World");
      });
  });
});
