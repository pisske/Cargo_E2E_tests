import PageEBookingFlow from "../../../../pageObjects/Bookings/eBookingFlow/PageEBookingFlow";

describe("Forwarder Booking Flow", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
  });

  // it("Performs eBooking flow - total icon and confirm click", () => {
  //   cy.visit("/forwarder/search/forwarder-search");
  // });

  it("should complete the eBooking flow from search to delivered status", () => {
    cy.loginAsForwarder();
    PageEBookingFlow.selectTheSINoffice();
    PageEBookingFlow.typeDestination("CDG - Paris Charles de Gaulle");
    PageEBookingFlow.changeLoadType();
    PageEBookingFlow.fillPieceWeightVolume(1, 1, 1);
    PageEBookingFlow.clickSearchButton();
    cy.url({ timeout: 10000 }).should(
      "include",
      "/forwarder/search/search-result"
    );
    PageEBookingFlow.closeRandomModalsIfPresent();

    PageEBookingFlow.clickBookNowForCargoAirline();
    cy.url({ timeout: 10000 }).should("include", "/shipment-details");
    PageEBookingFlow.clickOnTheBookButton();
    PageEBookingFlow.clickOnTheConfirmationModal();
    cy.url({ timeout: 10000 }).should(
      "include",
      "/forwarder/book/booking-history"
    );
    PageEBookingFlow.ClickInfoButtonHistoryPage();
    PageEBookingFlow.verifyShipmentStatus();
  });
});
