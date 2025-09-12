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
};
class ForwarderBookingPage {
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
    cy.get(SELECTORS.bookNowButotn, { timeout: 30000 })
      .should("be.visible")
      .should("not.be.disabled")
      .first()
      .as("bookNowBtn");
    cy.get("@bookNowBtn").click();
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
}
export default new ForwarderBookingPage();
