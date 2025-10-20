const SELECTORS = {
  originInput: 'input[placeholder="Origin"]',
  destinationInput: 'input[placeholder="Destination"]',
  pieceInput: "#pieces",
  weightInput: "#weight",
  volumeInput: "#volume",
  searchButton: "#search-button",
  modal: ".modal",
  closeButttonModal: "icon-close",
  expendFilightDetailsButton: "mat-expansion-panel-header",
  submitRequestBookingButton: "#submit-request-booking",
  requestBookingButton: "#btn-request-booking",
  requestBookingConfirationModal: ".swal2-confirm.swal2-styled",
  historyPageInfoButton: 'button[id^="quote-info-"]',
  airlineButtonPrimary: "a[id^='quote-info-'] em.la.la-info-circle",
};
class ForwarderRequestBookingPage {
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
    cy.get(SELECTORS.searchButton).click();
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
  extendFlightDetails() {
    cy.url().should("include", "/forwarder/search/search-result");
    cy.wait(30000);

    cy.get("em.la.la-angle-down")
      .first()
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.get(".actions-container", { timeout: 10000 }).should("be.visible");
  }

  submitRequsetBooking() {
    cy.get(SELECTORS.submitRequestBookingButton, { timeout: 10000 })
      .first()
      .scrollIntoView({ block: "center" })
      .should("be.visible")
      .click({ force: true });
  }
  RequsetBooking() {
    cy.get(SELECTORS.requestBookingButton, { timeout: 10000 })
      .should("be.visible")
      .click({ force: true });
  }
  confirmationRequestBooking() {
    cy.get(SELECTORS.requestBookingConfirationModal, { timeout: 10000 })
      .should("be.visible")
      .click({ force: true });
  }

  ClickInfoButtonHistoryPage() {
    cy.get(SELECTORS.historyPageInfoButton, { timeout: 100000 })
      .first()
      .invoke("attr", "id")
      .then((buttonId) => {
        const bookingId = buttonId.replace("quote-info-", "");
        const url = `/shipment-details/${bookingId}`;

        cy.visit(url);
      });
  }
  verifyBookingRequestedStatus() {
    const expectedStatus = "BOOKING REQUESTED";

    cy.log(`⏳ Waiting for status: ${expectedStatus}`);

    cy.get("span[placement='bottom'] span.text-uppercase", { timeout: 10000 })
      .should("be.visible")
      .invoke("text")
      .then((text) => {
        const actual = text.replace(/\s+/g, " ").trim().toUpperCase();
        expect(actual).to.eq(expectedStatus);
        cy.log(`✅ Status matched: ${actual}`);
      });
  }

  clickAirlinePrimaryButton() {
    cy.get(SELECTORS.airlineButtonPrimary, { timeout: 10000 }) // Get the element using the updated selector
      .first() // Get the first matching element
      .should("have.attr", "id") // Assert that the button has an "id" attribute
      .invoke("attr", "id") // Get the "id" attribute of the button
      .then((buttonId) => {
        if (!buttonId) {
          throw new Error('Button does not have an "id" attribute');
        }
        const bookingId = buttonId.replace("quote-info-", ""); // Extract the booking ID by removing the "quote-info-" part
        const url = `/shipment-details/${bookingId}`; // Create the URL for the shipment details page

        cy.visit(url); // Navigate to the shipment details page
        cy.get(".shipment-details").should("be.visible"); // Ensure the shipment details page loads
      });
  }
}
export default new ForwarderRequestBookingPage();
