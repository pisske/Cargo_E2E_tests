// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import "cypress-plugin-xhr-toggle";
import "@testing-library/cypress/add-commands";
import "cypress-xpath";
import "@shelex/cypress-allure-plugin";
// cypress/support/e2e.js

// cypress/support/e2e.js
// cypress/support/e2e.js
// cypress/support/e2e.js
Cypress.on("uncaught:exception", (err, runnable) => {
  // err.message may contain the error string
  const msg = err?.message || "";

  // Ignore /subscribers Forbidden errors
  if (msg.includes("/subscribers") && msg.includes("Forbidden")) {
    return false;
  }

  // Ignore 500 errors from /quotes/* endpoints
  if (msg.includes("/quotes/") && msg.includes("Internal Server Error")) {
    return false;
  }

  // Let other errors fail the test
});

// Let other errors fail the test
