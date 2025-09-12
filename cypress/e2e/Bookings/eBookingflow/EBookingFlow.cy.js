import PageEBookingFlow from "../../../../pageObjects/Bookings/eBookingFlow/PageEBookingFlow";

describe("Forwarder Booking Flow UI", () => {
  beforeEach(() => {
    cy.loginAsForwarder();
  });

  it("Performs eBooking flow - total icon and confirm click", () => {
    cy.visit("/forwarder/search/forwarder-search");
  });

  it("selects the second destination option after typing cdg", () => {
    PageEBookingFlow.typeDestination("CDG - Paris Charles de Gaulle");
    PageEBookingFlow.changeLoadType();
    PageEBookingFlow.fillPieceWeightVolume(1, 1, 1);
    PageEBookingFlow.clickSearchButton();
    cy.url().should("include", "/forwarder/search/search-result");
    PageEBookingFlow.closeRandomModalsIfPresent();

    PageEBookingFlow.clickBookNowForCargoAirline();
    cy.url({ timeout: 10000 }).should("include", "/shipment-details");
    PageEBookingFlow.clickOnTheBookButton();
    PageEBookingFlow.clickOnTheConfirmationModal();
    cy.url().should("include", "/forwarder/book/booking-history");
  });
});
