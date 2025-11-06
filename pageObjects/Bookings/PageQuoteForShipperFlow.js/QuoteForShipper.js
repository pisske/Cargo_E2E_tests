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

    //   // 4️⃣ Click first option
    //   cy.get(".cdk-overlay-pane mat-option", { timeout: 20000 })
    //     .first()
    //     .click({ force: true });
    //   cy.log("✅ First option selected");
    // }
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
    cy.get("button[class='btn next-step']", { timeout: 50000 }).click();
  }
  clickGenerateQuoteAndVerifyPDF() {
    // 1️⃣ Stub window.open
    cy.window().then((win) => {
      cy.stub(win, "open").as("pdfWindow");
    });

    // 2️⃣ Click the Generate Quote button
    cy.get(SELECTORS.generateQuoteButton, { timeout: 50000 }).click();
    cy.log("✅ Generate Quote button clicked");

    // 3️⃣ Check the stub was called
    cy.get("@pdfWindow")
      .should("have.been.called")
      .then((stub) => {
        const pdfUrl = stub.getCall(0).args[0]; // URL of PDF
        cy.log(`📄 PDF URL captured: ${pdfUrl}`);

        // 4️⃣ Make a direct request to verify it's a PDF
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
