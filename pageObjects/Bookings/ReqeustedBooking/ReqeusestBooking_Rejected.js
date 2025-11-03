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
  rejectButton: "div.action-btn-container > button.btn-action",
  rejectReason: "#reject-model-duetodimensions-btn > span",
  confirmRejectReason: "#cancellation-reason-confirm-btn",
  confirmRejectModal: "button.swal2-confirm.btn.btn-danger",
};
class ForwarderRequestBooking_Rejected {
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

  // clickAirlineInfoButton() {
  //   cy.window().then((win) => {
  //     // Stub window.open so it doesn't open a new tab
  //     cy.stub(win, "open").callsFake((url) => {
  //       // optionally navigate in the same tab instead
  //       win.location.href = url;
  //     });
  //   });

  //   cy.get("button.btn.btn-primary.btn-sm", { timeout: 20000 })
  //     .first()
  //     .should("be.visible")
  //     .click({ force: true });
  // }
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
  clickOnTheRejectButton() {
    // Click the Reject button
    cy.get(SELECTORS.rejectButton, { timeout: 20000 })
      .contains("Reject")
      .should("be.visible")
      .scrollIntoView()
      .click({ force: true });
  }
  clickRejectReason() {
    cy.get("ngb-modal-window", { timeout: 10000 }) // wait for modal
      .should("be.visible")
      .within(() => {
        cy.get("#reject-model-duetodimensions-btn").click();
      });
  }
  confirmRejectReason() {
    cy.get(SELECTORS.confirmRejectReason, { timeout: 20000 }).click({
      force: true,
    });
  }
  confirmRejectModal() {
    cy.get(SELECTORS.confirmRejectModal, { timeout: 20000 }).click({
      force: true,
    });
  }
  verifyBookingRejectedStatus() {
    const expectedStatus = "BOOKING REJECTED";

    const normalizeText = (text) =>
      text.replace(/\s+/g, " ").trim().toUpperCase();

    // Wait for the status to change and verify
    cy.get("span.description", { timeout: 60000 })
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

export default new ForwarderRequestBooking_Rejected();
