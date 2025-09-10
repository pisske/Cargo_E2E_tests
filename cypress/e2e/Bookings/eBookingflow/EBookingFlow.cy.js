import PageEBookingFlow from "../../../../pageObjects/Bookings/eBookingFlow/PageEBookingFlow";

describe("Forwarder Booking Flow UI", () => {
  beforeEach(() => {
    cy.loginAsForwarder();
  });

  it("Performs eBooking flow - total icon and confirm click", () => {
    cy.visit("/forwarder/search/forwarder-search");

    // PageEBookingFlow.changeLoadType();
  });

  it("selects the second destination option after typing cdg", () => {
    PageEBookingFlow.typeDestination("cdg");
  });
});
