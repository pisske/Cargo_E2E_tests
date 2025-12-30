// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Cypress.Commands.add("loginAsForwarder", () => {
//   const email = Cypress.env("FORWARDER_EMAIL");
//   const password = Cypress.env("FORWARDER_PASSWORD");
//   cy.session([email, password, "forwarder"], () => {
//     cy.visit("/forwarder/login");
//     cy.get("#login-email-input").type(email);
//     cy.get("#login-password-input").type(password);
//     cy.get("#login_signin_submit").click();
//     cy.url({ timeout: 15000 }).should(
//       "include",
//       "/forwarder/search/forwarder-search"
//     );
//   });
//   cy.visit("/forwarder/search/forwarder-search");
// });

// Cypress.Commands.add("loginAsAirline", () => {
//   const email = Cypress.env("AIRLINE_EMAIL");
//   const password = Cypress.env("AIRLINE_PASSWORD");
//   cy.session([email, password, "airline"], () => {
//     cy.visit("/airline/login");
//     cy.get("#login-email-input").type(email);
//     cy.get("#login-password-input").type(password);
//     cy.get("#login_signin_submit").click();
//     cy.url({ timeout: 10000 }).should("include", "/airline/quote/quote-list");
//   });
//   cy.visit("/airline/quote/quote-list");
// });
Cypress.Commands.add("loginAsForwarder", () => {
  const email = Cypress.env("FORWARDER_EMAIL");
  const password = Cypress.env("FORWARDER_PASSWORD");

  if (!email || !password) {
    throw new Error(
      `Forwarder credentials are missing for env: ${Cypress.env("ENVIRONMENT")}`
    );
  }

  cy.session([email, password, "forwarder"], () => {
    cy.visit("/forwarder/login");
    cy.get("#login-email-input").type(email);
    cy.get("#login-password-input").type(password);
    cy.get("#login_signin_submit").click();
    cy.url({ timeout: 15000 }).should(
      "include",
      "/forwarder/search/forwarder-search"
    );
  });

  cy.visit("/forwarder/search/forwarder-search");
});

Cypress.Commands.add("loginAsAirline", () => {
  const email = Cypress.env("AIRLINE_EMAIL");
  const password = Cypress.env("AIRLINE_PASSWORD");

  if (!email || !password) {
    throw new Error(
      `Airline credentials are missing for env: ${Cypress.env("ENVIRONMENT")}`
    );
  }

  cy.session([email, password, "airline"], () => {
    cy.visit("/airline/login");
    cy.get("#login-email-input").type(email);
    cy.get("#login-password-input").type(password);
    cy.get("#login_signin_submit").click();
    cy.url({ timeout: 10000 }).should("include", "/airline/quote/quote-list");
  });

  cy.visit("/airline/quote/quote-list");
});
