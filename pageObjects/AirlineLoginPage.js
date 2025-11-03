class AirlineLoginPage {
  visit() {
    cy.visit("/auth/login");
  }

  fillEmail(email) {
    cy.get("#login-email-input").type(email);
  }

  fillPassword(password) {
    cy.get("#login-password-input").type(password);
  }

  login(email, password) {
    this.visit();
    this.fillEmail(email);
    this.fillPassword(password);
  }
  getErrorMessageEmail() {
    return cy.get(".error-msg");
  }
  getErrorMessagePassword() {
    return cy.get(".error-msg");
  }
  logout() {
    // Click on the profile picture to open dropdown
    cy.get(
      '.dropdown-toggle.kt-header__topbar-wrapper img[alt="profile picture"]',
      { timeout: 10000 }
    )
      .should("be.visible")
      .click({ force: true });

    // Wait for the dropdown and click Sign Out button
    cy.get("button.btn.btn-sign-out", { timeout: 10000 })
      .should("be.visible")
      .first()
      .click({ force: true });

    // Verify redirection back to login
    cy.url({ timeout: 10000 }).should("include", "/auth/login");
  }
}

export default new AirlineLoginPage();
