// <reference types="cypress" />

const employee_email = Cypress.env('employee_email');
const manager_email = Cypress.env('manager_email');
const password = Cypress.env('password');

describe('Simple examples of cypress code', () => {
  const employee_email = 'comp1-employee-hre@mailinator.com';
  const manager_email = 'comp1-hr-manager@mailinator.com';
  const password = '12345678@Tc';

  before(() => {
    // this code ensures that it visits the following URL before running each test
    cy.visit('https://stghrms.paxanimi.ai/login');
  });

  it('Login as an employee', () => {
    cy.pause();

    cy.loginAsSomeone(employee_email, password);

    cy.contains('Book Flight Tickets', { timeout: 5000 }); // fails and stops running everything else because this content does not exist on the page

    cy.logout();
  });

  it('Login as manager', () => {
    cy.pause();
    cy.loginAsSomeone(manager_email, password);
  });
});
