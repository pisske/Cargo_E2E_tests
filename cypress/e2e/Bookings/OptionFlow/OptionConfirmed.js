import PageOptionConfirmed from "../../../../pageObjects/Bookings/OptionFlow/PageOptionConfirmed";

describe("Forwarder Booking Flow", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.loginAsForwarder();
  });

  it("should complete the Option Confrimed flow from search to delivered status", () => {
    PageOptionConfirmed.typeDestination("CDG - Paris Charles de Gaulle");
    PageOptionConfirmed.changeLoadType();
    PageOptionConfirmed.fillPieceWeightVolume(1, 1, 1);
    PageOptionConfirmed.openCalendar();
    PageOptionConfirmed.selectDateDaysFromToday(7);
    PageOptionConfirmed.clickSearchButton();
    cy.url({ timeout: 20000 }).should(
      "include",
      "/forwarder/search/search-result"
    );
    // cy.url().should("include", "/forwarder/search/search-result");
    PageOptionConfirmed.closeRandomModalsIfPresent();
    PageOptionConfirmed.clickBookNowForCargoAirline();
    cy.url({ timeout: 10000 }).should("include", "/shipment-details");
    PageOptionConfirmed.clickOnThePlaceOptionButton();
    PageOptionConfirmed.closeOptionModal();
    // PageOptionConfirmed.apiError();
    PageOptionConfirmed.clickConfirmOptionButton();
    PageOptionConfirmed.clickConfrimOptionModal();
    PageOptionConfirmed.verifyShipmentStatus();
  });
});
