import PageEBookingFlow from "../../../../pageObjects/Bookings/eBookingFlow/PageEBookingFlow";
import QuoteForShipper from "../../../../pageObjects/Bookings/PageQuoteForShipperFlow.js/QuoteForShipper";
describe("Forwarder Booking Flow", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.loginAsForwarder();
  });

  it("Submit quote request", () => {
    QuoteForShipper.selectTheOffice();
    PageEBookingFlow.typeDestination("CDG - Paris Charles de Gaulle");
    PageEBookingFlow.changeLoadType();
    PageEBookingFlow.fillPieceWeightVolume(1, 1, 1);
    PageEBookingFlow.clickSearchButton();
    cy.url().should("include", "/forwarder/search/search-result");
    PageEBookingFlow.closeRandomModalsIfPresent();
    QuoteForShipper.clickQuoteForShipperButton();
    QuoteForShipper.tickTheCheckbox();
    QuoteForShipper.clickCreateQuoteButton();
    cy.url({ timeout: 10000 }).should("include", "/forwarder/quote/create");
    QuoteForShipper.selectCustomer();
  });
  //   it("Create a quote", () => {
  //     cy.pause(50000);
  //   });
});
