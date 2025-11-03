import QuoteRequestPage_Rejected from "../../../../pageObjects/Bookings/QuoteRequestFlow/PageQuoteRequest_Accepted";
import RequestBooking_Reject from "../../../../pageObjects/Bookings/ReqeustedBooking/ReqeusestBooking_Rejected";
import AirlineLoginPage from "../../../../pageObjects/AirlineLoginPage";
import PageEBookingFlow from "../../../../pageObjects/Bookings/eBookingFlow/PageEBookingFlow";
import ForwarderLoginPage from "../../../../pageObjects/ForwarderLoginPage";
import QuoteRequestPage_Accepted from "../../../../pageObjects/Bookings/QuoteRequestFlow/PageQuoteRequest_Accepted";

describe("Forwarder Quote Request Flow", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.loginAsForwarder();
  });

  it("Forwarder request a quote and verified quote requested status", () => {
    PageEBookingFlow.selectTheSINoffice();
    QuoteRequestPage_Rejected.typeDestination("CDG - Paris Charles de Gaulle");
    QuoteRequestPage_Rejected.changeLoadType();
    QuoteRequestPage_Rejected.fillPieceWeightVolume(1, 1, 1);
    QuoteRequestPage_Rejected.clickSearchButton();
    cy.url({ timeout: 20000 }).should(
      "include",
      "/forwarder/search/search-result"
    );
    QuoteRequestPage_Rejected.closeRandomModalsIfPresent();
    QuoteRequestPage_Rejected.tickCheckboxBookNowForCargoAirline();
    QuoteRequestPage_Rejected.clickQuoteReqeustButton();
    QuoteRequestPage_Rejected.typeRateForQuote();
    QuoteRequestPage_Rejected.clickSubmitQuoteButton();
    QuoteRequestPage_Rejected.clickFirstExpansionIndicator();
    QuoteRequestPage_Rejected.clickOnTheQuoteInfoButton();
    QuoteRequestPage_Rejected.verifyQuoteRequestedStatus();
    ForwarderLoginPage.logout();
  });

  it("Arine reject the quote", () => {
    cy.loginAsAirline();
    cy.url({ timeout: 10000 }).should("include", "/airline/quote/quote-list");

    cy.intercept("GET", /\/quotes\/\d+\/subscribers/, {
      statusCode: 200,
      body: [],
    }).as("subscribers");

    RequestBooking_Reject.clickAirlineInfoButton();
    // RequestBooking_Reject.verifyBookingRequestedStatus();
    RequestBooking_Reject.clickOnTheRejectButton();
    RequestBooking_Reject.clickRejectReason();
    RequestBooking_Reject.confirmRejectReason();
    RequestBooking_Reject.confirmRejectModal();
    RequestBooking_Reject.verifyBookingRejectedStatus();
    AirlineLoginPage.logout();
  });

  it("Forwarder verifies quote is rejected", () => {
    cy.loginAsForwarder();
    RequestBooking_Reject.clickOnTheshipmentsPage();
    RequestBooking_Reject.ClickInfoButtonHistoryPage();
    RequestBooking_Reject.verifyBookingRejectedStatus();
  });
});
