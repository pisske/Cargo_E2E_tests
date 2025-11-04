const SELECTORS = {
  quoteForShipperButton: "#quote-for-shipper-btn",
  officeSelector: ".dropdown-toggle",
  officeMenu:
    ".dropdown-menu.office-selector__popup.p-0.dropdown-menu-anim.show",
  createQuoteButton: "#quote-request-button",
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
  selectCustomer() {
    // 1. Click the mat-select trigger
    cy.get("div.mat-mdc-form-field-infix").first().click({ force: true });

    // 2. Find the overlay panel in the body
    cy.get("body")
      .find("div[id^='mat-select'][class*='mat-mdc-select-panel']", {
        timeout: 10000,
      })
      .should("be.visible")
      .find("mat-option")
      .then(($options) => {
        const randomIndex = Math.floor(Math.random() * $options.length);
        cy.wrap($options[randomIndex]).click();
      });

    // 3. Optional: assert something is selected
    cy.get("div.mat-mdc-form-field-infix")
      .first()
      .invoke("text")
      .should("not.be.empty");
  }
}
export default new QuoteForShipper();
