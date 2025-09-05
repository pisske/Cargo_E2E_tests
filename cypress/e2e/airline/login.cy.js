// import AirlineLoginPage from "../../../pageObjects/AirlineLoginPage";

// describe("Airline Login with POM", () => {
//   it("logs in successfully and lands on airline dashboard", () => {
//     const email = Cypress.env("AIRLINE_EMAIL");
//     const password = Cypress.env("AIRLINE_PASSWORD");

//     AirlineLoginPage.login(email, password);

//     cy.url({ timeout: 10000 }).should("include", "/airline/quote/quote-list");
//   });
// });

describe("Airline Positive Login", () => {
  beforeEach(() => {
    cy.loginAsAirline(); // ✅ Session-based login
  });

  it("lands on airline dashboard", () => {
    cy.url({ timeout: 10000 }).should("include", "/airline/quote/quote-list");
  });
});
