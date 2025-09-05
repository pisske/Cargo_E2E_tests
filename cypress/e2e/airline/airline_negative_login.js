import AirlineLoginPage from "../../../pageObjects/AirlineLoginPage";

describe("Airline negative login with email", () => {
  it("shows error for invalid email format", () => {
    const email = "tester@.com";
    const password = Cypress.env("AIRLINE_PASSWORD");

    AirlineLoginPage.login(email, password);
    AirlineLoginPage.getErrorMessageEmail()
      .should("be.visible")
      .and("contain", "Please enter a valid email address");
  });
  it("shows error for invalid passwrod format", () => {
    const email = Cypress.env("AIRLINE_EMAIL");
    const password = "test";

    AirlineLoginPage.login(email, password);
    AirlineLoginPage.getErrorMessagePassword()
      .should("be.visible")
      .and("contain", "Please enter a valid password");
  });
});
