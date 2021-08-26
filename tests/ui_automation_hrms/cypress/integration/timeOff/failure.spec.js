/* eslint-disable camelcase */
/* eslint-disable no-undef */

// <reference types="cypress" />

describe('Simple examples of cypress code', () => {
  const employee_email = 'comp1-employee-hre@mailinator.com';
  const manager_email = 'comp1-hr-manager@mailinator.com';
  const password = '12345678@Tc';

  before(() => {
    // this code ensures that it visits the following URL before running each test
    cy.visit('/');
  });

  it('Login as an employee', () => {
    cy.loginAsSomeone(employee_email, password);

    // cy.contains('Book Flight Tickets', { timeout: 5000 }); // fails and stops running everything else because this content does not exist on the page
    cy.wait(5000);
    cy.logout();
  });

  it('Login as manager', () => {
    cy.loginAsSomeone(manager_email, password);
  });
});
