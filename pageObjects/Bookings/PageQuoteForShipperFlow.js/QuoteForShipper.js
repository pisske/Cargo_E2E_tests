const SELECTORS = {
  quoteForShipperButton: "#quote-for-shipper-btn",
  officeSelector: ".dropdown-toggle",
  officeMenu:
    ".dropdown-menu.office-selector__popup.p-0.dropdown-menu-anim.show",
  createQuoteButton: "#quote-request-button",
  nextButton: "#next-button",
  nextButtonStep2: "button.btn.next-step.two-column-step",
  nextButtonStep4: "button.btn.next-step",
  generateQuoteButton: "#generate-quotation-button",
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

  selectFirstOptionFromShipper() {
    const customerDropdown = "#email-select-dropdown";

    // 1️⃣ Wait for API
    cy.intercept("GET", "**/customers").as("getCustomers");
    cy.wait("@getCustomers", { timeout: 20000 });
    cy.log("✅ Customer data loaded");

    // 2️⃣ Ensure form is visible
    cy.get("form", { timeout: 30000 }).should("be.visible");

    // 3️⃣ Open the dropdown (real click + keyboard)
    cy.get(customerDropdown).scrollIntoView().click().type("{downarrow}");
    cy.log("✅ Dropdown opened");

    // // 4️⃣ Click first option
    // cy.get(".cdk-overlay-pane mat-option", { timeout: 20000 })
    //   .first()
    //   .click({ force: true });
    // cy.log("✅ First option selected");
  }
  clickNextButton() {
    cy.get(SELECTORS.nextButton, { timeout: 50000 }).click();
  }
  clickNextButtonStepTwo() {
    cy.get(SELECTORS.nextButtonStep2, { timeout: 50000 }).click();
  }
  selectIncotern() {
    // Use stable mat-select
    cy.get("mat-select[formcontrolname='incoterm']", { timeout: 20000 })
      .scrollIntoView()
      .click({ force: true });
    cy.log("✅ Dropdown opened");

    cy.get("body")
      .find(".cdk-overlay-pane mat-option", { timeout: 15000 })
      .first()
      .click({ force: true });
    cy.log("✅ First option selected");
  }
  clickNextButtonStepFour() {
    cy.contains("button.btn.next-step", "Next", { timeout: 50000 })
      .scrollIntoView() // scroll to make it visible
      .should("be.visible") // ensure it's visible
      .click();
  }
  clickGenerateQuoteAndVerifyPDF() {
    let pdfUrl;

    // ✅ 1️⃣ Set up listener BEFORE clicking
    cy.on("window:open", (url) => {
      pdfUrl = url;
      cy.log(`📄 PDF URL captured: ${url}`);
    });

    // ✅ 2️⃣ Click Generate Quote
    cy.get(SELECTORS.generateQuoteButton, { timeout: 50000 })
      .scrollIntoView()
      .should("be.visible")
      .click();
    cy.log("✅ Generate Quote button clicked");

    // ✅ 3️⃣ Wait for redirect to complete
    cy.url({ timeout: 60000 }).should(
      "include",
      "/forwarder/quote/shipper-quote"
    );

    // ✅ 4️⃣ Retry until pdfUrl is captured
    cy.wrap(null)
      .should(() => {
        expect(pdfUrl, "PDF window should have opened").to.be.a("string");
      })
      .then(() => {
        cy.request({
          url: pdfUrl,
          encoding: "binary",
        }).then((resp) => {
          expect(resp.status).to.eq(200);
          expect(resp.headers["content-type"]).to.include("application/pdf");
          cy.log("✅ PDF successfully generated and accessible");
        });
      });
  }
}
export default new QuoteForShipper();
