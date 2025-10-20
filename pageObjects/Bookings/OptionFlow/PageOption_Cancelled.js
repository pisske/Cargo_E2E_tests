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
  datepickerInput: "#flight-card-datepicker",
  placeOptionButton: "#place-option-btn",
  closeOptionModal: ".swal2-confirm",
  confirmOptionButton: ".justify-content-center > .action-option",
  confirmApiError: ".swal2-confirm",
  confirmOptionModalButton: ".swal2-confirm",
  cancelOptionButton: 'button:contains("CANCEL OPTION")',
  confirmCCancelOptionButton: "button.swal2-confirm.order-2.swal2-styled",
};
class PageOptionCancelled {
  navigateToNewBooking() {
    cy.visit("/forwarder/search/forwarder-search");
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

  changeLoadType() {
    cy.get(".icon-total").click();
  }
  fillPieceWeightVolume() {
    cy.get(SELECTORS.pieceInput).should("be.visible").clear().type("1");

    cy.get(SELECTORS.weightInput).should("be.visible").clear().type("1");

    cy.get(SELECTORS.volumeInput).should("be.visible").clear().type("1");
  }
  openCalendar() {
    cy.get(SELECTORS.datepickerInput).click();
  }
  selectDateDaysFromToday(daysAhead = 7) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    const day = targetDate.getDate();
    const month = targetDate.toLocaleString("default", { month: "long" });
    const year = targetDate.getFullYear();

    const ariaLabel = `${day} ${month} ${year}`;

    cy.get(`button[aria-label='${ariaLabel}']`).should("be.visible").click();
  }

  clickSearchButton() {
    cy.get(SELECTORS.searchButton).click();
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
  clickOnThePlaceOptionButton() {
    cy.get(SELECTORS.placeOptionButton, { timeout: 20000 }).click({
      force: true,
    });
  }
  closeOptionModal() {
    cy.get(SELECTORS.closeOptionModal, { timeout: 20000 }).click({
      force: true,
    });
  }
  apiError() {
    cy.get(SELECTORS.confirmApiError, { timeout: 20000 }).click({
      force: true,
    });
  }

  cancelOption() {
    cy.get(SELECTORS.cancelOptionButton, { timeout: 20000 })
      .should("be.visible")
      .eq(0)
      .click({ force: true });
  }
  confrimCancelledOption() {
    cy.get(SELECTORS.confirmCCancelOptionButton, { timeout: 20000 }).click({
      force: true,
    });
  }
  verifyCancelledStatus() {
    const expectedStatus = "OPTION CANCELLED";

    const normalizeText = (text) =>
      text.replace(/\s+/g, " ").trim().toUpperCase();

    cy.log(`⏳ Waiting for status: ${expectedStatus}`);

    // Updated the locator to use the `.description` class
    cy.get(".description", { timeout: 60000 })
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

export default new PageOptionCancelled();
