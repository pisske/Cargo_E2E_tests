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
}

export default new AirlineLoginPage();
