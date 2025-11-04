import PageEBookingFlow from "../../../../pageObjects/Bookings/eBookingFlow/PageEBookingFlow";
import PageOptionCancelled from "../../../../pageObjects/Bookings/OptionFlow/PageOption_Cancelled";

describe("Forwarder Booking Flow", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.loginAsForwarder();
  });

  it("should complete the Option Cancelle and verified status", () => {
    PageEBookingFlow.selectTheSINoffice();
    PageOptionCancelled.typeDestination("CDG - Paris Charles de Gaulle");
    PageOptionCancelled.changeLoadType();
    PageOptionCancelled.fillPieceWeightVolume(1, 1, 1);
    PageOptionCancelled.openCalendar();
    PageOptionCancelled.selectDateDaysFromToday(7);
    PageOptionCancelled.clickSearchButton();
    cy.url({ timeout: 20000 }).should(
      "include",
      "/forwarder/search/search-result"
    );
    PageOptionCancelled.closeRandomModalsIfPresent();
    PageOptionCancelled.clickBookNowForCargoAirline();
    cy.url({ timeout: 10000 }).should("include", "/shipment-details");
    PageOptionCancelled.clickOnThePlaceOptionButton();
    PageOptionCancelled.closeOptionModal();
    PageOptionCancelled.cancelOption();
    PageOptionCancelled.confrimCancelledOption();
    PageOptionCancelled.verifyCancelledStatus();
  });
});
