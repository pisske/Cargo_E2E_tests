import PageEBookingFlow from "../../../pageObjects/Bookings/PageEBookingFlow";

describe("Forwarder Booking Flow UI", () => {
  beforeEach(() => {
    cy.loginAsForwarder();
  });

  it("Performs eBooking flow - total icon and confirm click", () => {
    cy.visit("/forwarder/bookings/new");

    PageEBookingFlow.clickTotalIcon();
    PageEBookingFlow.clickConfirmButton();
  });
});
