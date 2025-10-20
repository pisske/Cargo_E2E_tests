import RequestBooking_Confirmed from "../../../../pageObjects/Bookings/ReqeustedBooking/RequestBooking_Confirmed";
import ForwarderLoginPage from "../../../../pageObjects/ForwarderLoginPage";

describe("Forwarder Reqeust Booking Flow", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
  });

  it("should complete the request booking flow from search to delivered status", () => {
    cy.loginAsForwarder();
    RequestBooking_Confirmed.typeDestination("CDG - Paris Charles de Gaulle");
    RequestBooking_Confirmed.changeLoadType();
    RequestBooking_Confirmed.fillPieceWeightVolume(1, 1, 1);
    RequestBooking_Confirmed.clickSearchButton();
    cy.url().should("include", "/forwarder/search/search-result");
    RequestBooking_Confirmed.closeRandomModalsIfPresent();
    RequestBooking_Confirmed.extendFlightDetails();
    RequestBooking_Confirmed.submitRequsetBooking();
    cy.url().should("include", "/shipment-details/new");
    RequestBooking_Confirmed.RequsetBooking();
    RequestBooking_Confirmed.confirmationRequestBooking();
    cy.url().should("include", "/forwarder/book/booking-history");
    RequestBooking_Confirmed.ClickInfoButtonHistoryPage();
    RequestBooking_Confirmed.verifyBookingRequestedStatus();
    ForwarderLoginPage.logout();
    cy.loginAsAirline();
    RequestBooking_Confirmed.clickAirlinePrimaryButton();
  });
});
