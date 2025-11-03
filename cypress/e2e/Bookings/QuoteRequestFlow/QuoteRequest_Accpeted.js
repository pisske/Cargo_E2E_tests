import QuoteRequestPage_Accepted from "../../../../pageObjects/Bookings/QuoteRequestFlow/PageQuoteRequest_Accepted";
import RequestBooking_Confirmed from "../../../../pageObjects/Bookings/ReqeustedBooking/RequestBooking_Confirmed";
import ForwarderLoginPage from "../../../../pageObjects/ForwarderLoginPage";
import AirlineLoginPage from "../../../../pageObjects/AirlineLoginPage";
import PageEBookingFlow from "../../../../pageObjects/Bookings/eBookingFlow/PageEBookingFlow";

describe("Forwarder Quote Request Flow", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.loginAsForwarder();
  });

  it("Forwarder request a quote and verified quote requested status", () => {
    PageEBookingFlow.selectTheSINoffice();
    QuoteRequestPage_Accepted.typeDestination("CDG - Paris Charles de Gaulle");
    QuoteRequestPage_Accepted.changeLoadType();
    QuoteRequestPage_Accepted.fillPieceWeightVolume(1, 1, 1);
    QuoteRequestPage_Accepted.clickSearchButton();
    cy.url({ timeout: 20000 }).should(
      "include",
      "/forwarder/search/search-result"
    );
    QuoteRequestPage_Accepted.closeRandomModalsIfPresent();
    QuoteRequestPage_Accepted.tickCheckboxBookNowForCargoAirline();
    QuoteRequestPage_Accepted.clickQuoteReqeustButton();
    QuoteRequestPage_Accepted.typeRateForQuote();
    QuoteRequestPage_Accepted.clickSubmitQuoteButton();
    QuoteRequestPage_Accepted.clickFirstExpansionIndicator();
    QuoteRequestPage_Accepted.clickOnTheQuoteInfoButton();
    QuoteRequestPage_Accepted.verifyQuoteRequestedStatus();
    cy.intercept("GET", "/aircrafts", { statusCode: 200, body: [] }).as(
      "mockAircrafts"
    );
    ForwarderLoginPage.logout();
  });

  it("Arine accept the quote", () => {
    cy.loginAsAirline();
    RequestBooking_Confirmed.clickAirlineInfoButton();
    QuoteRequestPage_Accepted.acceptTheQuoteAndVerifyStatus();
    AirlineLoginPage.logout();
  });
  it("Forwarder requests a booking", () => {
    cy.loginAsForwarder();
    QuoteRequestPage_Accepted.clickOnTheQuotePage();
    QuoteRequestPage_Accepted.clickFirstExpansionIndicator();
    QuoteRequestPage_Accepted.clickOnTheQuoteInfoButton();
    cy.url({ timeout: 20000 }).should("include", "/shipment-details");
    QuoteRequestPage_Accepted.clickOnTheBookButton();
    ForwarderLoginPage.logout();
  });
  it("Airline edits AWB and confirms booking", () => {
    cy.loginAsAirline(); // login as airline

    cy.intercept("GET", /\/quotes\/\d+\/subscribers/, {
      statusCode: 200,
      body: [], // you can mock subscribers if needed
    }).as("mockSubscribers");

    RequestBooking_Confirmed.clickAirlineInfoButton();
    RequestBooking_Confirmed.clckEditAWBnumber();
    RequestBooking_Confirmed.fillValidAWB();
    RequestBooking_Confirmed.saveAWBnumber();
    RequestBooking_Confirmed.confirmBookingAndVerifyStatus();
    RequestBooking_Confirmed.moveAndVerifyInTransitStatus();
    RequestBooking_Confirmed.moveAndVerifyAtDestinationStatus();
    RequestBooking_Confirmed.moveAndVerifyDeliveredStatus();
    cy.intercept("GET", "/aircrafts", { statusCode: 200, body: [] }).as(
      "mockAircrafts"
    );
    cy.intercept(/\/quotes\/\d+\/subscribers/, {
      statusCode: 200,
      body: [],
    }).as("mockSubscribers");
    AirlineLoginPage.logout(); // optional logout
  });
  it("Forearder verified delivered status", () => {
    cy.loginAsForwarder(); // login again as forwarder
    RequestBooking_Confirmed.confirmtSatusDeliveredsForwarder();
  });
});
