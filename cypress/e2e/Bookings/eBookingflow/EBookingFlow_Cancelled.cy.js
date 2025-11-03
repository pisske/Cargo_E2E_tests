import PageEBookingFlow from "../../../../pageObjects/Bookings/eBookingFlow/PageEBookingFlow";
import PageEBookingFlow_Cancelled from "../../../../pageObjects/Bookings/eBookingFlow/PageEBookingFlow_Cancelled";

describe("Forwarder Booking Flow Status Canceled", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.loginAsForwarder();
  });

  it("should verified canceled status", () => {
    PageEBookingFlow.selectTheSINoffice();
    PageEBookingFlow_Cancelled.typeDestination("CDG - Paris Charles de Gaulle");
    PageEBookingFlow_Cancelled.changeLoadType();
    PageEBookingFlow_Cancelled.fillPieceWeightVolume(1, 1, 1);
    PageEBookingFlow_Cancelled.clickSearchButton();
    cy.url().should("include", "/forwarder/search/search-result");
    PageEBookingFlow_Cancelled.closeRandomModalsIfPresent();

    PageEBookingFlow_Cancelled.clickBookNowForCargoAirline();
    cy.url({ timeout: 10000 }).should("include", "/shipment-details");
    PageEBookingFlow_Cancelled.clickOnTheBookButton();
    PageEBookingFlow_Cancelled.clickOnTheConfirmationModal();
    cy.url({ timeout: 10000 }).should(
      "include",
      "/forwarder/book/booking-history"
    );
    PageEBookingFlow_Cancelled.ClickInfoButtonHistoryPage();
    PageEBookingFlow_Cancelled.clickOnTheCacnelButton();
    PageEBookingFlow_Cancelled.clickCancelReason();
    PageEBookingFlow_Cancelled.confirmCanceReason();
    PageEBookingFlow_Cancelled.cancelModalClick();
    PageEBookingFlow_Cancelled.verifyCancelledStatus();
  });
});
