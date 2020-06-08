// arrange - set up initial app state
describe("Sanity Check", function () {
  // act - take an action
  it("Checks to see if cypress is working", function () {
    // assert - make an assertion
    expect(true).to.equal(true);
  });
});

describe("Environment Sanity Check", function () {
  it("Checks to see if the environment is in testing", function () {
    expect(Cypress.env('DATABASE_ENVIRONMENT')).to.equal('testing');
  });
});

describe("Server Sanity Check", function () {
  it("GET", function () {
    cy.visit("/");

    cy.request("/").then((response) => {
      expect(response.status).to.eq(200);
    });

    cy.contains("World");
  });
});