import AirlineLoginPage from "../../../../pageObjects/AirlineLoginPage";

import RequestBooking_Confirmed from "../../../../pageObjects/Bookings/ReqeustedBooking/RequestBooking_Confirmed";
import ForwarderLoginPage from "../../../../pageObjects/ForwarderLoginPage";

describe("Forwarder and Airline Request Booking Flow", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it("Forwarder requests a booking", () => {
    cy.loginAsForwarder();

    RequestBooking_Confirmed.selectTheCDGoffice();
    RequestBooking_Confirmed.typeDestination("SIN - Singapore Changi");
    RequestBooking_Confirmed.changeLoadType();
    RequestBooking_Confirmed.fillPieceWeightVolume(1, 1, 1);
    RequestBooking_Confirmed.clickSearchButton();
    RequestBooking_Confirmed.closeRandomModalsIfPresent();
    RequestBooking_Confirmed.extendFlightDetails();
    RequestBooking_Confirmed.submitRequsetBooking();
    RequestBooking_Confirmed.RequsetBooking();
    RequestBooking_Confirmed.confirmationRequestBooking();
    RequestBooking_Confirmed.clickInfoButtonHistoryPage();
    RequestBooking_Confirmed.verifyBookingRequestedStatus();

    ForwarderLoginPage.logout(); // keep your logout here
  });

  it("Airline edits AWB and confirms booking", () => {
    cy.loginAsAirline(); // login as airline

    cy.url({ timeout: 10000 }).should("include", "/airline/quote/quote-list");
    cy.intercept("GET", /\/quotes\/\d+\/subscribers/, {
      statusCode: 200,
      body: [],
    }).as("subscribers");

    RequestBooking_Confirmed.clickAirlineInfoButton();
    RequestBooking_Confirmed.clckEditAWBnumber();
    RequestBooking_Confirmed.fillValidAWB();
    RequestBooking_Confirmed.saveAWBnumber();
    RequestBooking_Confirmed.confirmBookingAndVerifyStatus();
    RequestBooking_Confirmed.moveAndVerifyInTransitStatus();
    RequestBooking_Confirmed.moveAndVerifyAtDestinationStatus();
    RequestBooking_Confirmed.moveAndVerifyDeliveredStatus();

    AirlineLoginPage.logout(); // optional logout
  });

  it("Forwarder verifies delivered status", () => {
    cy.loginAsForwarder(); // login again as forwarder
    RequestBooking_Confirmed.confirmtSatusDeliveredsForwarder();
  });
});
