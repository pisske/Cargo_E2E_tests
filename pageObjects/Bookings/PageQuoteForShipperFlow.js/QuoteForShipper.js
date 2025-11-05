const SELECTORS = {
  quoteForShipperButton: "#quote-for-shipper-btn",
  officeSelector: ".dropdown-toggle",
  officeMenu:
    ".dropdown-menu.office-selector__popup.p-0.dropdown-menu-anim.show",
  createQuoteButton: "#quote-request-button",
  nextButton: "#next-button",
};
class QuoteForShipper {
  selectTheOffice() {
    cy.get(SELECTORS.officeSelector, { timeout: 10000 })
      .filter(":visible")
      .eq(1)
      .click();
    cy.get(SELECTORS.officeMenu).contains("0012").click();
  }
  clickQuoteForShipperButton() {
    cy.get(SELECTORS.quoteForShipperButton, { timeout: 20000 })
      .should("be.visible")
      .should("not.be.disabled")
      .click({ force: true });
  }
  tickTheCheckbox() {
    cy.get(".chk-select-container .cai-checkbox").first().click();
  }
  clickCreateQuoteButton() {
    cy.get(SELECTORS.createQuoteButton, { timeout: 50000 }).click({
      force: true,
    });
  }
  //   fillCustomerDetails(name, email) {
  //     // Scroll to and type Name
  //     cy.get("#customer-name-input")
  //       .scrollIntoView() // ensures element is in viewport
  //       .should("be.visible")
  //       .clear({ force: true })
  //       .type(name, { force: true });

  //     // Scroll to and type Email
  //     cy.get("#customer-email-input")
  //       .scrollIntoView() // ensures element is in viewport
  //       .should("be.visible")
  //       .clear({ force: true })
  //       .type(email, { force: true });
  //   }
  selectFirstOptionFromShipper() {
    // Step 1: Click the select to open the overlay
    cy.get('mat-select[formcontrolname="shipper"]')
      .scrollIntoView()
      .should("be.visible")
      .click();

    // Step 2: Wait for the overlay panel and pick first option
    cy.get("body")
      .find(".cdk-overlay-pane .mat-mdc-select-panel", { timeout: 10000 })
      .should("exist")
      .should("be.visible")
      .find("mat-option")
      .first()
      .click();

    // Optional: verify the selection
    cy.get('mat-select[formcontrolname="shipper"]').should("not.have.text", "");
  }

  clickNextButton() {
    cy.get(SELECTORS.nextButton, { timeout: 50000 }).click();
  }
}
export default new QuoteForShipper();
