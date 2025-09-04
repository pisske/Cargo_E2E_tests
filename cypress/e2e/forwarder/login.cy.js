// import ForwarderLoginPage from "../../../pageObjects/ForwarderLoginPage";

// describe("Forwarder Login with POM", () => {
//   it("logs in successfully and lands on search page", () => {
//     const email = Cypress.env("FORWARDER_EMAIL");
//     const password = Cypress.env("FORWARDER_PASSWORD");

//     ForwarderLoginPage.login(email, password);

//     cy.url({ timeout: 10000 }).should(
//       "include",
//       "/forwarder/search/forwarder-search"
//     );
//     cy.get(".select-trigger", { timeout: 10000 }).should("be.visible");
//   });
// });
describe("Forwarder Login with POM", () => {
  beforeEach(() => {
    cy.loginAsForwarder(); // Use session-based login command here
  });

  it("lands on search page after login", () => {
    cy.url({ timeout: 10000 }).should(
      "include",
      "/forwarder/search/forwarder-search"
    );
    cy.get(".select-trigger", { timeout: 10000 }).should("be.visible");
  });
});
