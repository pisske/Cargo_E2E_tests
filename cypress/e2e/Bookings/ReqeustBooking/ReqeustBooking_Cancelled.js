import AirlineLoginPage from "../../../../pageObjects/AirlineLoginPage";
import RequestBookig_Cancelled from "../../../../pageObjects/Bookings/ReqeustedBooking/RequestBookig_Cancelled";
import RequestBooking_Confirmed from "../../../../pageObjects/Bookings/ReqeustedBooking/RequestBooking_Confirmed";

import ForwarderLoginPage from "../../../../pageObjects/ForwarderLoginPage";

describe("Forwarder and Airline Request Booking Flow - Cancelled", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it("Forwarder creates a booking request", () => {
    cy.loginAsForwarder();
    RequestBooking_Confirmed.selectTheCDGoffice();
    RequestBooking_Confirmed.typeDestination("SIN - Singapore Changi");
    RequestBookig_Cancelled.changeLoadType();
    RequestBookig_Cancelled.fillPieceWeightVolume(1, 1, 1);
    RequestBookig_Cancelled.clickSearchButton();

    cy.url({ timeout: 10000 }).should(
      "include",
      "/forwarder/search/search-result"
    );

    RequestBookig_Cancelled.closeRandomModalsIfPresent();
    RequestBookig_Cancelled.extendFlightDetails();
    RequestBookig_Cancelled.submitRequsetBooking();

    cy.url({ timeout: 10000 }).should("include", "/shipment-details/new");

    RequestBookig_Cancelled.RequsetBooking();
    RequestBookig_Cancelled.confirmationRequestBooking();

    cy.url({ timeout: 10000 }).should(
      "include",
      "/forwarder/book/booking-history"
    );

    RequestBookig_Cancelled.ClickInfoButtonHistoryPage();
    ForwarderLoginPage.logout();
  });

  it("Airline cancel the booking request", () => {
    cy.loginAsAirline();

    cy.url({ timeout: 10000 }).should("include", "/airline/quote/quote-list");

    cy.intercept("GET", /\/quotes\/\d+\/subscribers/, {
      statusCode: 200,
      body: [],
    }).as("subscribers");

    RequestBookig_Cancelled.clickAirlineInfoButton();
    RequestBookig_Cancelled.verifyBookingRequestedStatus();
    RequestBookig_Cancelled.clickEditAWBnumber();
    RequestBookig_Cancelled.fillValidAWB();
    RequestBookig_Cancelled.saveAWBnumber();
    RequestBookig_Cancelled.confirmBookingAndVerifyStatus();
    RequestBookig_Cancelled.clickOnTHeCancelButton();

    RequestBookig_Cancelled.clickOnTHeCancelButton();
    RequestBookig_Cancelled.confirmCaancelReason();
    RequestBookig_Cancelled.confirmCanceltModal();
    RequestBookig_Cancelled.verifyBookingCancelledStatus();

    AirlineLoginPage.logout();
  });

  it("Forwarder verifies booking is cancelled", () => {
    cy.loginAsForwarder();
    RequestBookig_Cancelled.clickOnTheshipmentsPage();
    RequestBookig_Cancelled.ClickInfoButtonHistoryPage();
    RequestBookig_Cancelled.verifyBookingCancelledStatus();
  });
});
