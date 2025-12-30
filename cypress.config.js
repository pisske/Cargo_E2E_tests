// const { defineConfig } = require("cypress");
// require("dotenv").config();
// const allureWriter = require("@shelex/cypress-allure-plugin/writer");

// module.exports = defineConfig({
//   e2e: {
//     baseUrl: "https://app.dev.cargoai.co/",
//     specPattern: "cypress/e2e/**/*.js",
//     viewportWidth: 1280,
//     // Example optional settings you can safely add here:
//     viewportWidth: 1280,
//     viewportHeight: 720,
//     // reporter: "cypress-mochawesome-reporter",
//     // reporterOptions: {
//     //   reportDir: "cypress/reports/html",
//     //   embeddedScreenshots: true,
//     //   inlineAssets: true,
//     //   charts: true,
//     //   reportPageTitle: "Cypress Test Report",
//     // },

//     setupNodeEvents(on, config) {
//       // implement node event listeners here
//       allureWriter(on, config);
//       return config;
//     },
//     env: {
//       FORWARDER_EMAIL: process.env.FORWARDER_EMAIL,
//       FORWARDER_PASSWORD: process.env.FORWARDER_PASSWORD,
//       AIRLINE_EMAIL: process.env.AIRLINE_EMAIL,
//       AIRLINE_PASSWORD: process.env.AIRLINE_PASSWORD,
//     },
//   },
// });
const { defineConfig } = require("cypress");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");
require("dotenv").config();

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.js",
    viewportWidth: 1280,
    viewportHeight: 720,

    setupNodeEvents(on, config) {
      // 1️⃣ Determine environment dynamically
      const environment =
        config.env.ENVIRONMENT || process.env.CYPRESS_ENVIRONMENT || "dev";

      // 2️⃣ Base URLs per environment
      const baseUrls = {
        dev: process.env.CYPRESS_DEV_BASE_URL,
        stg: process.env.CYPRESS_STG_BASE_URL,
      };
      config.baseUrl = baseUrls[environment];

      // 3️⃣ Credentials
      config.env.ENVIRONMENT = environment;
      config.env.FORWARDER_EMAIL =
        environment === "dev"
          ? process.env.CYPRESS_FORWARDER_EMAIL_DEV
          : process.env.CYPRESS_FORWARDER_EMAIL_STG;

      config.env.FORWARDER_PASSWORD =
        environment === "dev"
          ? process.env.CYPRESS_FORWARDER_PASSWORD_DEV
          : process.env.CYPRESS_FORWARDER_PASSWORD_STG;

      config.env.AIRLINE_EMAIL =
        environment === "dev"
          ? process.env.CYPRESS_AIRLINE_EMAIL_DEV
          : process.env.CYPRESS_AIRLINE_EMAIL_STG;

      config.env.AIRLINE_PASSWORD =
        environment === "dev"
          ? process.env.CYPRESS_AIRLINE_PASSWORD_DEV
          : process.env.CYPRESS_AIRLINE_PASSWORD_STG;

      // 4️⃣ Allure plugin
      allureWriter(on, config);

      // 5️⃣ IMPORTANT: return config
      return config;
    },
  },
});
