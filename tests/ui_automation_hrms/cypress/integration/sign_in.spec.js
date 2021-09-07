/* eslint-disable camelcase */
/* eslint-disable no-undef */

// <reference types="cypress" />

describe('Sign in', () => {
  const hrmanager_email = 'comp1-hr-manager@mailinator.com';
  const password = '12345678@Tc';

  before(() => {
    cy.visit('/');
  });

  it('Sign in account HR Manager', () => {
    cy.loginAsSomeone(hrmanager_email, password);
    cy.wait(5000);
  });
});
