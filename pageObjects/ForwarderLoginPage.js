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

  clickLogin() {
    cy.get("#login_signin_submit").click();
  }

  login(email, password) {
    this.visit();
    this.fillEmail(email);
    this.fillPassword(password);
    this.clickLogin();
  }
}

export default new ForwarderLoginPage();
