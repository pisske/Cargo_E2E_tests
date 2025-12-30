const SELECTORS = {
  originInput: 'input[placeholder="Origin"]',
  destinationInput: 'input[placeholder="Destination"]',
  pieceInput: "#pieces",
  weightInput: "#weight",
  volumeInput: "#volume",
  searchButton: "#search-button",
  modal: ".modal",
  closeButttonModal: "icon-close",
  bookNowButotn: "#btn-primary-book",
  bookButton: "#btn-book",
  historyPageInfoButton: 'button[id^="quote-info-"]',
  searchResultCheckbox: "#checkbox-00",
  quoteReqiestBittpm: "#quote-request-button",
  inputTargetRateField: "#mat-input-quote-rate",
  submitQuoteButton: "#submit-btn",
  bookButton: "#btn-book",
};
class QuoteRequestPage_Accepted {
  navigateToNewBooking() {
    cy.visit("/forwarder/search/forwarder-search");
  }

  changeLoadType() {
    cy.get(".icon-total").click();
  }

  typeDestination(destination) {
    const expectedOrigin = "SIN - Singapore Changi";

    cy.get(SELECTORS.originInput, { timeout: 30000 })
      .should("be.visible")
      .should("have.value", expectedOrigin);

    cy.get(SELECTORS.destinationInput)
      .should("be.visible")
      .clear()
      .type(destination, { delay: 150 })
      .then(($input) => {
        $input[0].dispatchEvent(new Event("input", { bubbles: true }));
      });

    cy.wait(1500);

    cy.get("body").click(0, 0);
  }
  fillPieceWeightVolume() {
    cy.get(SELECTORS.pieceInput).should("be.visible").clear().type("1");

    cy.get(SELECTORS.weightInput).should("be.visible").clear().type("1");

    cy.get(SELECTORS.volumeInput).should("be.visible").clear().type("1");
  }
  clickSearchButton() {
    cy.get("kt-adhoc-search", { timeout: 15000 }).should("be.visible");

    // Now search for the second one
    cy.get("kt-search-button")
      .should("have.length.at.least", 2)
      .eq(1)
      .find("button#search-button")
      .click();
  }
  closeRandomModalsIfPresent() {
    cy.get("body").then(() => {
      // Try to get the modal within a short timeout
      cy.get(".booking-details-popup", { timeout: 3000 }).then(($modal) => {
        if ($modal.length > 0) {
          cy.log("Modal is present, attempting to close...");
          cy.get("#booking-details-popup-close", { timeout: 5000 }).click({
            force: true,
          });
          cy.get(".booking-details-popup").should("not.exist");
        }
      });
    });
  }
  tickCheckboxBookNowForCargoAirline() {
    cy.get("#checkbox-00 svg", { timeout: 20000 })
      .first()
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
  }
  clickQuoteReqeustButton() {
    // Wait up to 2 minutes for the button to exist
    cy.get("#quote-request-button", { timeout: 120000 })
      .scrollIntoView({ offset: { top: -150, left: 0 } })
      .should("be.visible");

    // Retry until the button does NOT have the 'disabled' class
    cy.get("#quote-request-button", { timeout: 120000 })
      .should(($btn) => {
        if ($btn.hasClass("disabled")) {
          throw new Error("Button still disabled, retrying...");
        }
      })
      .click();
  }
  typeRateForQuote() {
    const randomNumber = Math.floor(Math.random() * 101);

    // Wait up to 30s for the input field to exist and be visible
    cy.get(SELECTORS.inputTargetRateField, { timeout: 30000 })
      .should("exist")
      .should("be.visible")
      .clear()
      .type(randomNumber.toString());
  }
  clickSubmitQuoteButton() {
    cy.get(SELECTORS.submitQuoteButton, { timeout: 10000 }) // optional: wait for element to appear
      .should("be.visible"); // ensure it’s visible

    cy.wait(3000); // wait 5 seconds

    cy.get(SELECTORS.submitQuoteButton).click();
  }
  clickFirstExpansionIndicator() {
    cy.get("span.mat-expansion-indicator", { timeout: 50000 }) // timeout inside get
      .first() // pick the first one
      .should("be.visible") // ensure visible
      .click({ force: true }); // click it;
  }
  clickOnTheQuoteInfoButton() {
    // Intercept window.open so Cypress stays in the same tab
    cy.window().then((win) => {
      cy.stub(win, "open").callsFake((url) => {
        cy.visit(url); // navigate in same tab instead of opening new tab
      });
    });

    // Click the button
    cy.get("div[aria-label='First group'] > button.btn.btn-success.btn-sm")
      .first()
      .should("be.visible")
      .click();
  }
  verifyQuoteRequestedStatus() {
    const expectedStatus = "QUOTE REQUESTED";

    const normalizeText = (text) =>
      text.replace(/\s+/g, " ").trim().toUpperCase();

    // Wait for the status text to appear and verify it
    cy.contains("span.text-uppercase", "Quote Requested", { timeout: 60000 })
      .should("be.visible")
      .scrollIntoView({ force: true })
      .invoke("text")
      .then((text) => {
        const actual = normalizeText(text);
        expect(actual).to.eq(normalizeText(expectedStatus));
        cy.log(`✅ Status matched: ${actual}`);
      });
  }
  acceptTheQuoteAndVerifyStatus() {
    const expectedStatus = "QUOTE ACCEPTED";

    const normalizeText = (text) =>
      text.replace(/\s+/g, " ").trim().toUpperCase();

    // Click the button ignoring visibility
    cy.get("button.btn.btn-action.btn-pill.action-accept.mb-3", {
      timeout: 20000,
    })
      .first()
      .click({ force: true });

    // Wait for the status to change
    cy.get("kt-quote-status-badge span.text-uppercase", { timeout: 60000 })
      .should("be.visible")
      .invoke("text")
      .then((text) => {
        const actual = normalizeText(text);
        expect(actual).to.eq(normalizeText(expectedStatus));
        cy.log(`✅ Status matched: ${actual}`);
      });
  }
  clickOnTheQuotePage() {
    // Step 1: Click the Quotes menu to open the dropdown
    cy.get("#menu_Quotes", { timeout: 20000 })
      .should("be.visible")
      .click({ force: true });

    // Step 2: Click the Airline option inside the dropdown
    cy.get("#menu_Airline", { timeout: 10000 })
      .should("be.visible")
      .click({ force: true });
  }
  clickOnTheBookButton() {
    cy.log("Clicking Book button (ignoring disabled state if needed)...");

    cy.get(".action-btn-container")
      .find("button#btn-book")
      .should("exist")
      .then(($btn) => {
        // if it's hidden, scroll it into view and force click
        cy.wrap($btn).scrollIntoView();
        cy.wait(500); // small wait for Angular change detection
        cy.wrap($btn).click({ force: true });
      });
  }
}
export default new QuoteRequestPage_Accepted();
