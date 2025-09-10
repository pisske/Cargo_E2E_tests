// cypress/pageObjects/ForwarderBookingPage.js
class ForwarderBookingPage {
  navigateToNewBooking() {
    cy.visit("/forwarder/search/forwarder-search");
  }

  changeLoadType() {
    cy.get(".icon-total").click();
  }

  typeDestination(destination) {
    const expectedOrigin = "SIN - Singapore Changi";

    cy.get('input[placeholder="Origin"]', { timeout: 10000 })
      .should("be.visible")
      .should("have.value", expectedOrigin);

    cy.get('input[placeholder="Destination"]')
      .should("be.visible")
      .clear()
      .type(destination, { delay: 150 })
      .then(($input) => {
        $input[0].dispatchEvent(new Event("input", { bubbles: true }));
      });
    cy.pause();
    cy.wait(1500);

    cy.get('input[placeholder="Destination"]').type(
      "{downarrow}{downarrow}{enter}"
    );

    cy.get('input[placeholder="Destination"]').type("{downarrow}{enter}");
  }
}
export default new ForwarderBookingPage();
