// cypress/pageObjects/ForwarderBookingPage.js
class ForwarderBookingPage {
  navigateToNewBooking() {
    cy.visit("/forwarder/search/forwarder-search");
  }

  selectOffice() {
    cy.get(".dropdown-toggle").click();
  }
  changeLoadType() {
    cy.get(".icon-total").click();
  }

  //   fillBookingForm({ origin, destination, date, pieces, weight, volue }) {
  //     cy.get('input[name="destination"]').type(destination);
  //     cy.get('input[name="date"]').type(date);
  //   }

  //   submitBooking() {
  //     cy.get('button[type="submit"]').click();
  //   }

  //   verifyBookingCreated() {
  //     cy.url().should("include", "/forwarder/bookings/");
  //     cy.get(".booking-id").should("exist"); // Adjust selector
  //   }
}

export default new ForwarderBookingPage();
