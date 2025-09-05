import PageEBookingFlow from "../../../../pageObjects/Bookings/eBookingFlow/PageEBookingFlow";

describe("Forwarder Booking Flow UI", () => {
  beforeEach(() => {
    cy.loginAsForwarder();
  });

  it("Performs eBooking flow - total icon and confirm click", () => {
    cy.visit("/forwarder/search/forwarder-search");

    PageEBookingFlow.changeLoadType();
  });
  // it("should have SIN - Singapore Changi auto-filled in origin", () => {
  //   PageEBookingFlow.getOriginValue().should(
  //     "have.value",
  //     "SIN - Singapore Changi"
  //   );
  // });

  it("selects the second destination option after typing cdg", () => {
    PageEBookingFlow.typeDestination("cdg");
  });
});
