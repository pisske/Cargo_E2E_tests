import ForwarderLoginPage from "../../../pageObjects/ForwarderLoginPage";

describe("Forwarder negative login with email", () => {
  it("shows error for invalid email format", () => {
    const email = "tester@.com";
    const password = Cypress.env("FORWARDER_PASSWORD");

    ForwarderLoginPage.login(email, password);
    ForwarderLoginPage.getErrorMessageEmail()
      .should("be.visible")
      .and("contain", "Please enter a valid email address");
  });
  it("shows error for invalid passwrod format", () => {
    const email = Cypress.env("FORWARDER_EMAIL");
    const password = "test";

    ForwarderLoginPage.login(email, password);
    ForwarderLoginPage.getErrorMessagePassword()
      .should("be.visible")
      .and("contain", "Please enter a valid password");
  });
});
