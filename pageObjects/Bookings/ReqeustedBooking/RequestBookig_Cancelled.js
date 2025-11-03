import { generateValidAWB } from "../../../cypress/support/helpers/gemerateAWB";

const SELECTORS = {
  originInput: 'input[placeholder="Origin"]',
  destinationInput: 'input[placeholder="Destination"]',
  pieceInput: "#pieces",
  weightInput: "#weight",
  volumeInput: "#volume",
  // searchButton: "#search-button",
  modal: ".modal",
  closeButttonModal: "icon-close",
  expendFilightDetailsButton: "mat-expansion-panel-header",
  submitRequestBookingButton: "#submit-request-booking",
  requestBookingButton: "#btn-request-booking",
  requestBookingConfirationModal: ".swal2-confirm.swal2-styled",
  historyPageInfoButton: 'button[id^="quote-info-"]',
  airlineButtonPrimaryHistory: 'button[id^="quote-info-"]',
  editAWBButton: "div[data-intercom-target='AWB_Card'] button.edit-button",
  awbInput: "#awb-number-input",
  saveAWBnumberButton: "#save-button",
  confirmCancelReason: "#cancellation-reason-confirm-btn",
  confirmCancelModal: "button.swal2-confirm.btn.btn-danger",
};
class ForwarderRequestBooking_Cancelled {
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
    cy.get("body").then(($body) => {
      const $modal = $body.find(".booking-details-popup");
      if ($modal.length) {
        cy.log("Modal is present, attempting to close...");
        cy.get("#booking-details-popup-close", { timeout: 5000 }).click({
          force: true,
        });
        cy.get(".booking-details-popup").should("not.exist");
      } else {
        cy.log("No modal found");
      }
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

  clickAirlineInfoButton() {
    cy.get('a[target="_blank"][href^="/shipment-details"]', { timeout: 20000 })
      .first()
      .then(($a) => {
        // Remove target from <a>
        $a.removeAttr("target");
        // Click the <a> directly, not the button
        cy.wrap($a).click({ force: true });
      });
  }
  clickEditAWBnumber() {
    cy.get(SELECTORS.editAWBButton, { timeout: 10000 })
      .should("be.visible")
      .click({ force: true });
  }
  fillValidAWB(maxAttempts = 50, attempt = 1) {
    if (attempt > maxAttempts) {
      throw new Error("Failed to enter a valid AWB after max attempts");
    }

    const awb = generateValidAWB();

    cy.get(SELECTORS.awbInput)
      .should("be.visible")
      .clear()
      .type(awb)
      .then(() => {
        // Check if the error exists
        cy.get("body").then(($body) => {
          if ($body.find("#awb-invalid-error").length > 0) {
            cy.log(`❌ Attempt ${attempt}: ${awb} invalid, retrying...`);
            this.fillValidAWB(maxAttempts, attempt + 1); // recursion
          } else {
            cy.log(`✅ Attempt ${attempt}: ${awb} accepted`);
          }
        });
      });
  }
  saveAWBnumber() {
    cy.get(SELECTORS.saveAWBnumberButton, { timeout: 10000 })
      .scrollIntoView({ block: "center", ensureScrollable: false })
      .should("be.visible")
      .wait(500) // allow UI animation or header offset
      .click({ force: true });
  }
  confirmBookingAndVerifyStatus() {
    const expectedStatus = "BOOKING CONFIRMED";

    const normalizeText = (text) =>
      text.replace(/\s+/g, " ").trim().toUpperCase();

    // Click the confirm booking button
    cy.get("#confirm-booking-button-mobile", { timeout: 10000 })
      .should("be.visible")
      .scrollIntoView()
      .click({ force: true });

    // Wait for the status to change
    cy.get("kt-quote-status-badge span.text-uppercase", { timeout: 60000 }) // ✅ specific selector
      .should("be.visible")
      .scrollIntoView({ force: true })
      .invoke("text")
      .then((text) => {
        const actual = normalizeText(text);
        expect(actual).to.eq(normalizeText(expectedStatus));
        cy.log(`✅ Status matched: ${actual}`);
      });
  }
  clickOnTHeCancelButton() {
    cy.contains("button", "Cancel", { timeout: 10000 }) // ✅ safer and clearer
      .scrollIntoView()
      .click({ force: true });
  }
  clickCancelReason() {
    cy.get("ngb-modal-window", { timeout: 10000 }) // wait for modal
      .should("be.visible")
      .within(() => {
        cy.get("#reject-model-duetodimensions-btn").click();
      });
  }
  confirmCaancelReason() {
    cy.get(SELECTORS.confirmCancelReason, { timeout: 20000 }).click({
      force: true,
    });
  }
  confirmCanceltModal() {
    cy.get(SELECTORS.confirmCancelModal, { timeout: 20000 }).click({
      force: true,
    });
  }
  verifyBookingCancelledStatus() {
    const expectedStatus = "BOOKING CANCELLED";

    const normalizeText = (text) =>
      text.replace(/\s+/g, " ").trim().toUpperCase();

    // Wait for the status text to appear and verify it
    cy.contains("span.text-uppercase", "Booking Cancelled", { timeout: 60000 })
      .should("be.visible")
      .scrollIntoView({ force: true })
      .invoke("text")
      .then((text) => {
        const actual = normalizeText(text);
        expect(actual).to.eq(normalizeText(expectedStatus));
        cy.log(`✅ Status matched: ${actual}`);
      });
  }
  clickOnTheshipmentsPage() {
    cy.get("a#menu_Shipments span.kt-menu__link-text", {
      timeout: 20000,
    }).click({
      force: true,
    });
  }
}

export default new ForwarderRequestBooking_Cancelled();
