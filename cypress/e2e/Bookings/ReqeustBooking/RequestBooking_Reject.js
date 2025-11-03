// import AirlineLoginPage from "../../../../pageObjects/AirlineLoginPage";
// import RequestBooking_Reject from "../../../../pageObjects/Bookings/ReqeustedBooking/ReqeusestBooking_Rejected";
// import ForwarderLoginPage from "../../../../pageObjects/ForwarderLoginPage";

// describe("Forwarder Reqeust Booking Flow Reject", () => {
//   beforeEach(() => {
//     cy.viewport(1366, 768);
//   });

//   it("should complete the request booking flow from search to delivered status", () => {
//     cy.loginAsForwarder();
//     RequestBooking_Reject.typeDestination("CDG - Paris Charles de Gaulle");
//     RequestBooking_Reject.changeLoadType();
//     RequestBooking_Reject.fillPieceWeightVolume(1, 1, 1);
//     RequestBooking_Reject.clickSearchButton();
//     cy.url().should("include", "/forwarder/search/search-result");
//     RequestBooking_Reject.closeRandomModalsIfPresent();
//     RequestBooking_Reject.extendFlightDetails();
//     RequestBooking_Reject.submitRequsetBooking();
//     cy.url().should("include", "/shipment-details/new");
//     RequestBooking_Reject.RequsetBooking();
//     RequestBooking_Reject.confirmationRequestBooking();
//     cy.url().should("include", "/forwarder/book/booking-history");
//     RequestBooking_Reject.ClickInfoButtonHistoryPage();

//     ForwarderLoginPage.logout();
//     cy.loginAsAirline();

//     cy.url({ timeout: 10000 }).should("include", "/airline/quote/quote-list");
//     cy.intercept("GET", /\/quotes\/\d+\/subscribers/, {
//       statusCode: 200,
//       body: [],
//     }).as("subscribers");
//     RequestBooking_Reject.clickAirlineInfoButton();
//     RequestBooking_Reject.verifyBookingRequestedStatus();
//     RequestBooking_Reject.clickOnTheRejectButton();
//     RequestBooking_Reject.clickRejectReason();
//     RequestBooking_Reject.confirmRejectReason();
//     RequestBooking_Reject.confirmRejectModal();
//     RequestBooking_Reject.verifyBookingRejectedStatus();
//     AirlineLoginPage.logout();
//     cy.loginAsForwarder();
//     RequestBooking_Reject.clickOnTheshipmentsPage();
//     RequestBooking_Reject.ClickInfoButtonHistoryPage();
//   });
// });
import AirlineLoginPage from "../../../../pageObjects/AirlineLoginPage";
import ReqeusestBooking_Rejected from "../../../../pageObjects/Bookings/ReqeustedBooking/ReqeusestBooking_Rejected";
import RequestBooking_Reject from "../../../../pageObjects/Bookings/ReqeustedBooking/ReqeusestBooking_Rejected";
import RequestBooking_Confirmed from "../../../../pageObjects/Bookings/ReqeustedBooking/RequestBooking_Confirmed";
import ForwarderLoginPage from "../../../../pageObjects/ForwarderLoginPage";
describe("Forwarder and Airline Request Booking Flow - Reject", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it("Forwarder creates a booking request", () => {
    cy.loginAsForwarder();

    RequestBooking_Confirmed.selectTheCDGoffice();
    RequestBooking_Confirmed.typeDestination("SIN - Singapore Changi");
    RequestBooking_Reject.changeLoadType();
    RequestBooking_Reject.fillPieceWeightVolume(1, 1, 1);
    RequestBooking_Reject.clickSearchButton();
    cy.url({ timeout: 10000 }).should(
      "include",
      "/forwarder/search/search-result"
    );

    RequestBooking_Reject.closeRandomModalsIfPresent();
    RequestBooking_Reject.extendFlightDetails();
    RequestBooking_Reject.submitRequsetBooking();
    cy.url({ timeout: 10000 }).should("include", "/shipment-details/new");
    RequestBooking_Reject.RequsetBooking();
    RequestBooking_Reject.confirmationRequestBooking();
    cy.url({ timeout: 10000 }).should(
      "include",
      "/forwarder/book/booking-history"
    );
    RequestBooking_Reject.ClickInfoButtonHistoryPage();
    ForwarderLoginPage.logout();
  });

  it("Airline rejects the booking request", () => {
    cy.loginAsAirline();
    cy.url({ timeout: 10000 }).should("include", "/airline/quote/quote-list");

    cy.intercept("GET", /\/quotes\/\d+\/subscribers/, {
      statusCode: 200,
      body: [],
    }).as("subscribers");

    RequestBooking_Reject.clickAirlineInfoButton();
    RequestBooking_Reject.verifyBookingRequestedStatus();
    RequestBooking_Reject.clickOnTheRejectButton();
    RequestBooking_Reject.clickRejectReason();
    RequestBooking_Reject.confirmRejectReason();
    RequestBooking_Reject.confirmRejectModal();
    RequestBooking_Reject.verifyBookingRejectedStatus();
    AirlineLoginPage.logout();
  });

  it("Forwarder verifies booking is rejected", () => {
    cy.loginAsForwarder();
    RequestBooking_Reject.clickOnTheshipmentsPage();
    RequestBooking_Reject.ClickInfoButtonHistoryPage();
    ReqeusestBooking_Rejected.verifyBookingRejectedStatus();
  });
});
