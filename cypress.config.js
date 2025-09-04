const { defineConfig } = require("cypress");
require("dotenv").config();

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://app.dev.cargoai.co/",
    specPattern: "cypress/e2e/**/*.js",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      FORWARDER_EMAIL: process.env.FORWARDER_EMAIL,
      FORWARDER_PASSWORD: process.env.FORWARDER_PASSWORD,
      AIRLINE_EMAIL: process.env.AIRLINE_EMAIL,
      AIRLINE_PASSWORD: process.env.AIRLINE_PASSWORD,
    },
  },
});
