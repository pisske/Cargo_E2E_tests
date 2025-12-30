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
  officeSelector: ".dropdown-toggle",
  officeMenu:
    ".dropdown-menu.office-selector__popup.p-0.dropdown-menu-anim.show",
};

class ForwarderRequestBookingPage {
  navigateToNewBooking() {
    cy.visit("/forwarder/search/forwarder-search");
  }

  selectTheCDGoffice() {
    cy.get(SELECTORS.officeSelector, { timeout: 10000 })
      .filter(":visible")
      .eq(1)
      .click();
    cy.get(SELECTORS.officeMenu).contains("CDG").click();
  }

  changeLoadType() {
    cy.get(".icon-total").click();
  }

  typeDestination(destination) {
    const expectedOrigin = "CDG - Paris Charles de Gaulle";

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
  clickInfoButtonHistoryPage() {
    // Wait for the booking history table or row to appear
    cy.get("td div[role='group']", { timeout: 20000 })
      .first() // first row
      .within(() => {
        // Now get the Info button inside this group
        cy.get("button[data-intercom-target='Info_Btn']")
          .should("be.visible")
          .then(($btn) => {
            const href = $btn.parent("a").attr("href"); // get parent <a> link
            if (href) {
              cy.visit(href); // navigate in same tab
            } else {
              cy.wrap($btn).click();
            }
          });
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
  clckEditAWBnumber() {
    cy.get("div[data-intercom-target='AWB_Card'] button.edit-button", {
      timeout: 30000,
    })
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
  moveAndVerifyInTransitStatus() {
    const expected = "IN TRANSIT";

    // Click "In Transit" button
    cy.get(
      "div.col-xl-3.col-12.col-lg-4.col-md-6.position-change button:nth-child(2)",
      { timeout: 10000 }
    )
      .should("be.visible")
      .scrollIntoView({ force: true })
      .click({ force: true });

    // Confirm modal
    cy.get("button.swal2-confirm.btn.btn-success", { timeout: 10000 })
      .should("be.visible")
      .click({ force: true });

    // Verify status
    cy.get("#in-transit-title", { timeout: 60000 })
      .should("be.visible")
      .invoke("text")
      .then((text) => {
        expect(text.trim().toUpperCase()).to.eq(expected);
        cy.log(`✅ Status matched: ${text.trim()}`);
      });
  }
  moveAndVerifyAtDestinationStatus() {
    const expected = "AT DESTINATION";

    // Click "At Destination" button by ID
    cy.get("#at-destination-button", { timeout: 10000 })
      .should("be.visible")
      .scrollIntoView({ force: true })
      .click({ force: true });

    // Confirm modal
    cy.get("button.swal2-confirm.btn.btn-success", { timeout: 10000 })
      .should("be.visible")
      .click({ force: true });

    // Verify status
    cy.get("#at-destination-title", { timeout: 60000 })
      .should("be.visible")
      .invoke("text")
      .then((statusText) => {
        expect(statusText.trim().toUpperCase()).to.eq(expected);
        cy.log(`✅ Status matched: ${statusText.trim()}`);
      });
  }
  moveAndVerifyDeliveredStatus() {
    const expected = "DELIVERED";
    cy.get("div.top-block.top-none.Action_sec", { timeout: 60000 }) // wait up to 60s
      .should("exist") // element exists in DOM
      .then(($div) => {
        // Click Delivered button forcefully even if parent has display:none
        cy.wrap($div)
          .find("button.btn.btn-action.btn-pill.action-accept.mb-3")
          .contains("Delivered")
          .click({ force: true });
      });

    // Confirm modal
    cy.get("button.swal2-confirm.btn.btn-success", { timeout: 10000 })
      .should("be.visible")
      .click({ force: true });

    // Verify status
    cy.get("kt-quote-status-badge span.text-uppercase.description", {
      timeout: 60000,
    }) // use the actual status element
      .should("be.visible")
      .invoke("text")
      .then((statusText) => {
        expect(statusText.trim().toUpperCase()).to.eq("DELIVERED"); // expected status
        cy.log(`✅ Status matched: ${statusText.trim()}`);
      });
  }
  confirmtSatusDeliveredsForwarder() {
    cy.contains("span.kt-menu__link-text", "Shipments").click({ force: true });
    cy.get('a[target="_blank"][href^="/shipment-details"]', { timeout: 20000 })
      .first()
      .then(($a) => {
        // Remove target from <a>
        $a.removeAttr("target");
        // Click the <a> directly, not the button
        cy.wrap($a).click({ force: true });
      });
    cy.get("kt-quote-status-badge span.text-uppercase.description", {
      timeout: 60000,
    }) // use the actual status element
      .should("be.visible")
      .invoke("text")
      .then((statusText) => {
        expect(statusText.trim().toUpperCase()).to.eq("DELIVERED"); // expected status
        cy.log(`✅ Status matched: ${statusText.trim()}`);
      });
  }
}
export default new ForwarderRequestBookingPage();
