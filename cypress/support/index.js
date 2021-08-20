// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

// code to ignore resize observer loop errors
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
Cypress.on("uncaught:exception", (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});

Cypress.Commands.add("loginAsSomeone", (email, password) => {
  cy.get("#basic_userEmail.ant-input", { timeout: 8000 }).type(email);
  cy.get("#basic_password.ant-input", { timeout: 8000 }).type(password);
  cy.get('button[type="submit"]', { timeout: 8000 }).click();
});

Cypress.Commands.add("logout", () => {
  cy.get(".ant-dropdown-trigger", { timeout: 8000 }).then((resp) => {
    cy.get(resp[1]).trigger("mousemove").click();
    cy.contains("Logout").click();
  });
});

Cypress.Commands.add(
  "iframe",
  { prevSubject: "element" },
  ($iframe, callback = () => {}) => {
    // For more info on targeting inside iframes refer to this GitHub issue:
    // https://github.com/cypress-io/cypress/issues/136
    cy.log("Getting iframe body");

    return cy
      .wrap($iframe)
      .should((iframe) => expect(iframe.contents().find("body")).to.exist)
      .then((iframe) => cy.wrap(iframe.contents().find("body")))
      .within({}, callback);
  }
);
