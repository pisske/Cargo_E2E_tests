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
  cancelButton: "#cancel-booking",
  cancelReason: "#reason-no-show-late-delivery",
  confirmCancelReason: "#cancellation-reason-confirm-btn",
  cancelBookingButton: "button.swal2-confirm.btn.btn-danger",
};
class ForwarderBookingPage_Cancelled {
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
    // cy.get("body").then(($body) => {
    //   if ($body.find(".booking-details-popup").length > 0) {
    //     cy.get("#booking-details-popup-close").click({ force: true });

    //     cy.get(".booking-details-popup").should("not.exist");
    //   }
    // });
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
  clickBookNowForCargoAirline() {
    // cy.get(SELECTORS.bookNowButotn, { timeout: 50000 })
    //   .should("be.visible")
    //   .should("not.be.disabled")
    //   .first()
    //   .as("bookNowBtn");
    // cy.get("@bookNowBtn").click();
    cy.get(SELECTORS.bookNowButotn, { timeout: 50000 })
      .first()
      .scrollIntoView() // 👈 Ensure it's in view
      .should("be.visible")
      .should("not.be.disabled")
      .click();
  }
  clickOnTheBookButton() {
    cy.get(SELECTORS.bookButton, { timeout: 20000 }).click({ force: true });
  }
  clickOnTheConfirmationModal() {
    cy.get(".swal2-popup.booking-confirmed", { timeout: 10000 }).should(
      "be.visible"
    );
    cy.get(".swal2-confirm").click();
  }
  ClickInfoButtonHistoryPage() {
    cy.get(SELECTORS.historyPageInfoButton, { timeout: 10000 })
      .first()
      .invoke("attr", "id")
      .then((buttonId) => {
        const bookingId = buttonId.replace("quote-info-", "");
        const url = `/shipment-details/${bookingId}`;

        cy.visit(url);
      });
  }
  clickOnTheCacnelButton() {
    cy.get(SELECTORS.cancelButton, { timeout: 20000 }).click({ force: true });
  }

  clickCancelReason() {
    cy.get(SELECTORS.cancelReason, { timeout: 20000 }).click({ force: true });
  }
  confirmCanceReason() {
    cy.get(SELECTORS.confirmCancelReason, { timeout: 20000 }).click({
      force: true,
    });
  }
  cancelModalClick() {
    cy.get(SELECTORS.cancelBookingButton, { timeout: 20000 }).click({
      force: true,
    });
  }
  verifyCancelledStatus() {
    const expectedStatus = "BOOKING CANCELLED";

    const normalizeText = (text) =>
      text.replace(/\s+/g, " ").trim().toUpperCase();

    cy.log(`⏳ Waiting for status: ${expectedStatus}`);

    cy.get("span[placement='bottom'] span.text-uppercase", { timeout: 60000 })
      .should("be.visible")
      .scrollIntoView({ force: true })
      .invoke("text")
      .then((text) => {
        const actual = normalizeText(text);
        const expected = normalizeText(expectedStatus);

        expect(actual).to.eq(expected);
        cy.log(`✅ Status matched: ${actual}`);
      });
  }
}
export default new ForwarderBookingPage_Cancelled();
