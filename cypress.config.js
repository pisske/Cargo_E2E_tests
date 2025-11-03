const { defineConfig } = require("cypress");
require("dotenv").config();
const allureWriter = require("@shelex/cypress-allure-plugin/writer");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://app.dev.cargoai.co/",
    specPattern: "cypress/e2e/**/*.js",
    viewportWidth: 1280,
    // Example optional settings you can safely add here:
    viewportWidth: 1280,
    viewportHeight: 720,
    // reporter: "cypress-mochawesome-reporter",
    // reporterOptions: {
    //   reportDir: "cypress/reports/html",
    //   embeddedScreenshots: true,
    //   inlineAssets: true,
    //   charts: true,
    //   reportPageTitle: "Cypress Test Report",
    // },

    setupNodeEvents(on, config) {
      // implement node event listeners here
      allureWriter(on, config);
      return config;
    },
    env: {
      FORWARDER_EMAIL: process.env.FORWARDER_EMAIL,
      FORWARDER_PASSWORD: process.env.FORWARDER_PASSWORD,
      AIRLINE_EMAIL: process.env.AIRLINE_EMAIL,
      AIRLINE_PASSWORD: process.env.AIRLINE_PASSWORD,
    },
  },
});
