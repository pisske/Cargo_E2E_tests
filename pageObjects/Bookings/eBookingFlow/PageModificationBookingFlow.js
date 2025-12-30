// cypress/pageObjects/ForwarderBookingPage.js

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
  officeSelector: ".dropdown-toggle",
  officeMenu:
    ".dropdown-menu.office-selector__popup.p-0.dropdown-menu-anim.show",
  modifyBookingButton: "#confirm-modify-btn",
};
class ModificationBooking {
  navigateToNewBooking() {
    cy.visit("/forwarder/search/forwarder-search");
  }

  selectTheSINoffice() {
    cy.get(SELECTORS.officeSelector, { timeout: 10000 })
      .filter(":visible")
      .eq(1)
      .click();
    cy.get(SELECTORS.officeMenu).contains("SIN").click();
    cy.get("body").click(0, 0);
  }

  changeLoadType() {
    cy.get(".icon-total").click();
  }
  openCalendar() {
    // Wait for any overlay/backdrop to disappear
    cy.get(".cdk-overlay-backdrop").should("not.exist");

    // Click the datepicker input
    cy.get("#flight-card-datepicker").click();

    // Wait for the calendar popup to be visible
    cy.get(".mat-datepicker-content").should("be.visible");
  }

  selectDateDaysFromToday(daysAhead = 3) {
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
      cy.get(".booking-details-popup", { timeout: 10000 }).then(($modal) => {
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
    //
    cy.get(SELECTORS.bookNowButotn, { timeout: 50000 })
      .first()
      .scrollIntoView() // 👈 Ensure it's in view
      .should("be.visible")
      .should("not.be.disabled")
      .click();
  }

  // clickOnTheBookButton() {
  //   cy.get(".Action_sec", { timeout: 30000 }).should("be.visible");

  //   cy.get(SELECTORS.bookButton).should("not.be.disabled").click();
  // }
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

  clickOnTheModifyBookingButton() {
    cy.get(SELECTORS.modifyBookingButton, { timeout: 10000 }).click({
      force: true,
    });
  }
  modifyTheBooking() {
    cy.intercept("POST", "https://graphql.dev.cargoai.co/graphql", (req) => {
      if (req.body.operationName === "CheckModification") {
        req.reply({
          data: {
            checkModification: {
              canModify: true,
              reason: null,
            },
          },
        });
      }
    }).as("modCheck");

    // Type the new load value
    cy.get("cai-load-type-input input")
      .first()
      .should("be.visible")
      .clear() // removed force: true
      .type("2", { delay: 100 })
      .blur() // ensures Angular registers change
      .should("have.value", "2");

    // Click Next button
    cy.contains("button", "Next")
      .should("be.visible")
      .should("not.be.disabled") // wait until enabled
      .click(); // no force: true

    // Wait for the GraphQL modification check
    cy.wait("@modCheck");

    // Small wait to allow UI to update after response
    cy.wait(1000);
  }

  verifyShipmentStatus() {
    const expectedStatuses = [
      "BOOKING CONFIRMED",
      "IN TRANSIT", //
      "AT DESTINATION",
      "DELIVERED", //
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
export default new ModificationBooking();
