import PageEBookingFlow from "../../../../pageObjects/Bookings/eBookingFlow/PageEBookingFlow";
import QuoteForShipper from "../../../../pageObjects/Bookings/PageQuoteForShipperFlow.js/QuoteForShipper";
describe("Forwarder Booking Flow", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
  });

  it("Submit quote request", () => {
    cy.loginAsForwarder();
    QuoteForShipper.selectTheOffice();
    PageEBookingFlow.typeDestination("CDG - Paris Charles de Gaulle");
    PageEBookingFlow.changeLoadType();
    PageEBookingFlow.fillPieceWeightVolume(1, 1, 1);
    PageEBookingFlow.clickSearchButton();
    cy.url({ timeout: 10000 }).should(
      "include",
      "/forwarder/search/search-result"
    );
    PageEBookingFlow.closeRandomModalsIfPresent();
    QuoteForShipper.clickQuoteForShipperButton();
    QuoteForShipper.tickTheCheckbox();
    QuoteForShipper.clickCreateQuoteButton();
    cy.url({ timeout: 10000 }).should("include", "/forwarder/quote/create");
    QuoteForShipper.selectFirstOptionFromShipper();

    QuoteForShipper.clickNextButton();
    QuoteForShipper.clickNextButtonStepTwo();
    QuoteForShipper.selectIncotern();
    QuoteForShipper.clickNextButtonStepTwo();
    QuoteForShipper.clickNextButtonStepFour();
    QuoteForShipper.clickGenerateQuoteAndVerifyPDF();
  });
});
