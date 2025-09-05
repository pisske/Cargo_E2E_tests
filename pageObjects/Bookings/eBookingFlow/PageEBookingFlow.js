// cypress/pageObjects/ForwarderBookingPage.js
class ForwarderBookingPage {
  navigateToNewBooking() {
    cy.visit("/forwarder/search/forwarder-search");
  }

  changeLoadType() {
    cy.get(".icon-total").click();
  }
  // getOriginValue() {
  //   return cy
  //     .get('input[formcontrolname="origin"]', { timeout: 10000 })
  //     .should("be.visible");
  // }
  typeDestination(destination) {
    cy.get('input[placeholder="Destination"]')
      .clear()
      .type(destination)
      .wait(500)
      .type("{downarrow}")
      .type("{enter}");
  }
}

export default new ForwarderBookingPage();
