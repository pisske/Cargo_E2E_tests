import PageModificationBookingFlow from "../../../../pageObjects/Bookings/eBookingFlow/PageModificationBookingFlow";

describe("Modification Booking", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
  });

  it("should complete the eBooking flow from search to delivered status including modification", () => {
    cy.loginAsForwarder();
    PageModificationBookingFlow.selectTheSINoffice();
    PageModificationBookingFlow.typeDestination(
      "CDG - Paris Charles de Gaulle"
    );
    PageModificationBookingFlow.changeLoadType();
    PageModificationBookingFlow.openCalendar();
    PageModificationBookingFlow.selectDateDaysFromToday(3);
    PageModificationBookingFlow.fillPieceWeightVolume(1, 1, 1);
    PageModificationBookingFlow.clickSearchButton();
    cy.url({ timeout: 10000 }).should(
      "include",
      "/forwarder/search/search-result"
    );
    PageModificationBookingFlow.closeRandomModalsIfPresent();

    PageModificationBookingFlow.clickBookNowForCargoAirline();
    cy.url({ timeout: 10000 }).should("include", "/shipment-details");
    PageModificationBookingFlow.clickOnTheBookButton();
    PageModificationBookingFlow.clickOnTheConfirmationModal();
    cy.url({ timeout: 10000 }).should(
      "include",
      "/forwarder/book/booking-history"
    );
    PageModificationBookingFlow.ClickInfoButtonHistoryPage();

    PageModificationBookingFlow.clickOnTheModifyBookingButton();

    PageModificationBookingFlow.modifyTheBooking();
    PageModificationBookingFlow.verifyShipmentStatus();
  });
});
