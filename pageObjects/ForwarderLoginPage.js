class ForwarderLoginPage {
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
  logout() {
    // Click profile picture dropdown
    cy.get(
      '.dropdown-toggle.kt-header__topbar-wrapper img[alt="profile picture"]'
    ).click();

    // Click first logout button
    cy.get("button.btn.btn-sign-out").first().click();
  }
  getErrorMessageEmail() {
    return cy.get(".error-msg");
  }
  getErrorMessagePassword() {
    return cy.get(".error-msg");
  }
}

export default new ForwarderLoginPage();
