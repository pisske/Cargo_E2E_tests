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
};
class PageOptionConfirmed {
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
    // Wait for any overlay/backdrop to disappear
    cy.get(".cdk-overlay-backdrop").should("not.exist");

    // Click the datepicker input
    cy.get("#flight-card-datepicker").click();

    // Wait for the calendar popup to be visible
    cy.get(".mat-datepicker-content").should("be.visible");
  }

  selectDateDaysFromToday(daysAhead = 7) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    const day = targetDate.getDate();
    const month = targetDate.toLocaleString("default", { month: "long" });
    const year = targetDate.getFullYear();
    const ariaLabel = `${day} ${month} ${year}`;

    // Open calendar (force click to bypass overlay/backdrop)
    cy.get("#flight-card-datepicker").click({ force: true });

    // Wait for calendar popup to appear
    cy.get(".mat-datepicker-content").should("be.visible");

    // If the target date is not in the current month → click next month
    cy.get("body").then(($body) => {
      if ($body.find(`button[aria-label='${ariaLabel}']`).length === 0) {
        cy.get('button[aria-label="Next month"]').click({ force: true });
      }
    });

    // Click the target date button
    cy.get(`button[aria-label='${ariaLabel}']`, { timeout: 10000 })
      .should("be.visible") // ensure it is visible
      .and("not.be.disabled") // ensure it is enabled
      .click();
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
  clickConfirmOptionButton() {
    // Wait a reasonable amount of time for the parent container to exist
    cy.get(".Action_sec", { timeout: 20000 }).should("exist");

    // Find the button with the text 'CONFIRM OPTION'
    cy.contains("button.action-option", "CONFIRM OPTION", {
      timeout: 20000,
    }).then(($btn) => {
      if ($btn.is(":visible") && !$btn.is(":disabled")) {
        // If button is visible and enabled, click normally
        cy.wrap($btn).click();
      } else {
        // Otherwise, force the click
        cy.log("Button is not visible or disabled, forcing click...");
        cy.wrap($btn).click({ force: true });
      }
    });
  }
  clickConfrimOptionModal() {
    cy.get(SELECTORS.confirmOptionModalButton, { timeout: 50000 }).click({
      force: true,
    });
  }
  verifyShipmentStatus() {
    const expectedStatuses = [
      "BOOKING CONFIRMED", // First check: Booking Confirmed
      "IN TRANSIT", // Second check: In Transit
      "AT DESTINATION", // Third check: At Destination
      "DELIVERED", // Last check: Delivered
    ];

    const normalizeText = (text) =>
      text.replace(/\s+/g, " ").trim().toUpperCase();

    expectedStatuses.forEach((expectedStatus, index) => {
      cy.log(`⏳ Waiting for status: ${expectedStatus}`);

      // Increase the timeout for the first status check (Booking Confirmed to In Transit)
      let statusTimeout = 90000; // 90 seconds for the first transition (Booking Confirmed → In Transit)

      if (expectedStatus !== "BOOKING CONFIRMED") {
        statusTimeout = 60000; // 60 seconds for other transitions (In Transit → At Destination → Delivered)
      }

      // Wait for the status to appear with the appropriate timeout
      cy.get("span[placement='bottom'] span.text-uppercase", {
        timeout: statusTimeout,
      })
        .should("be.visible")
        .scrollIntoView({ force: true })
        .invoke("text")
        .should("match", new RegExp(expectedStatus, "i")) // Ensure it matches the expected status
        .then((text) => {
          const actual = normalizeText(text);
          const expected = normalizeText(expectedStatus);

          // Assert that the status matches
          expect(actual).to.eq(expected);
          cy.log(`✅ Status matched: ${actual}`);
        });

      // Optional: Add a wait time before checking the next status (for transitions to occur)
      if (index < expectedStatuses.length - 1) {
        // Avoid waiting after the last status
        cy.wait(90000); // Wait for 90 seconds (adjust based on your transition time)
      }
    });
  }
}
export default new PageOptionConfirmed();
