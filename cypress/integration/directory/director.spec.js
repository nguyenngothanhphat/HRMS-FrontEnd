/* eslint-disable no-undef */
/* eslint-disable camelcase */
/// <reference types="cypress" />

const owner_email = Cypress.env('owner_email');
const password = Cypress.env('password');
const id = 1000 + Math.floor(Math.random() * 9000);
// info employee
const employee = {
  id,
  name: 'Nguyen Van A',
  join_date: '2021-08-01',
  email: `nva.${id}@mailinator.com`,
  work_email: `nva.${id}@mailinator.com`,
  type: 'Full Time',
  title: 'Senior Software engineer II',
  department: 'Engineering',
  manager: 'Ngoc Nguyen',
};

describe('Directory Automation', () => {
  before(() => {
    cy.visit('https://stghrms.paxanimi.ai/login');
  });

  it.only('Search and Add employee', () => {
    cy.loginAsSomeone(owner_email, password);
    cy.get(':nth-child(7) > .viewAction___2wj7D > .btnOutline___3sCPv > span').click();
    cy.contains('Employees Management', { timeout: 10000 }).click({
      force: true,
    });
    cy.wait(7000);
    cy.contains('Filter', { timeout: 10000 }).click();
    cy.get('.PaddingFilter___2rdaN > .ant-input').type(employee.name);
    // cy.pause();
    cy.wait(3000);

    cy.get('.resetHide___2hDmP > p').click();
    cy.get('.PaddingFilter___2rdaN > .ant-input').type(employee.email);
    cy.wait(3000);
    // cy.pause();
    cy.get('.resetHide___2hDmP > p').click();
    cy.get('.formSelectTitle___TbiTl > .ant-select-selector > .ant-select-selection-item')
      .trigger('mousemove')
      .type(employee.title)
      // .click()
      .then(() => {
        cy.contains(employee.title).click();
      });
    cy.wait(3000);
    cy.get('.resetHide___2hDmP > p').click();
    cy.contains('Add employee').click();
    cy.get('#formAddEmployee_employeeId').type(employee.id);
    cy.get('#formAddEmployee_firstName').type(employee.name);
    cy.get('#formAddEmployee_joinDate').type(`${employee.join_date}{enter}`, {
      force: true,
    });
    cy.get('#formAddEmployee_personalEmail').type(employee.email);
    cy.get('#formAddEmployee_workEmail').type(employee.work_email);
    cy.get('#formAddEmployee_employeeType').type(`${employee.type}{enter}`, {
      force: true,
    });
    cy.wait(1000);
    cy.get('#formAddEmployee_company').type('TERRALOGIC' + '{enter}', {
      force: true,
    });
    cy.wait(1000);
    cy.get('#formAddEmployee_roles').type('EMPLOYEE' + '{enter}', {
      force: true,
    });
    cy.wait(1000);

    cy.get('#formAddEmployee_location').type('Vietnam{enter}', {
      force: true,
    });
    cy.wait(1000);

    cy.get('#formAddEmployee_department').type(`${employee.department}{enter}`, {
      force: true,
    });
    cy.wait(1000);
    cy.get('#formAddEmployee_title').type(`${employee.title}{enter}`, {
      force: true,
    });
    cy.wait(1000);
    cy.get('#formAddEmployee_manager').type(`${employee.manager}{enter}`);
    cy.contains('Submit').click();
    cy.pause();

    // import employees
    cy.contains('Import employees').click();
    const file = 'ImportTenantEmpl2.csv';
    cy.get('.fileUploadForm___33QtN > :nth-child(1) > input').attachFile(file);
    cy.contains('Submit').click();
    // cy.pause();
    // cy.wait(5000);
  });
  it('add infomation employee', () => {
    // add infomation employee
    // cy.contains("Filter", { timeout: 10000 }).click();
    cy.loginAsSomeone(owner_email, password);
    cy.get(':nth-child(7) > .viewAction___2wj7D > .btnOutline___3sCPv > span').click();
    cy.contains('Employees Management', { timeout: 10000 }).click({
      force: true,
    });
    cy.wait(7000);
    cy.contains('Filter', { timeout: 10000 }).click();
    cy.get('.PaddingFilter___2rdaN > .ant-input').type('Nguyen Van A');

    // cy.pause();
    cy.wait(3000);
    cy.contains(employee.name).click();
    cy.wait(10000);
    cy.get('.flexEdit___1-A4Q').click();
    cy.wait(1000);
    cy.get('.ant-picker #DOB').type('08.27.98{enter}', { force: true });
    cy.get(':nth-child(1) > .ant-radio > .ant-radio-input', {
      force: true,
    }).click();
    cy.get('#workNumber').clear().type('0123456789', { force: true });
    // cy.get("#adhaarCardNumber").type("123456789123");
    cy.get('#uanNumber').clear().type('123456789012', { force: true });
    cy.get('.spaceFooter___3j0Pi > .ant-btn').click();
    cy.wait(1000);
    cy.get('.flexEdit___2Kt_Y').click();
    cy.get('form#myForm').within(($form) => {
      cy.get('input#personal_information_personalNumber').clear().type('0123456789', {
        force: true,
      });
      cy.get('input#personal_information_Blood')
        .trigger('mousemove', { force: true })
        .click({ force: true })
        .then(() => {
          cy.contains('O+').click({ force: true });
        });
      cy.wait(1000);

      cy.get('input#personal_information_maritalStatus')
        .trigger('mousemove', { force: true })
        .click({ force: true })
        .then(() => {
          cy.contains('Married').click();
        });
      cy.get('input#personal_information_linkedIn')
        .clear()
        .type('https://www.linkedin.com/', { force: true });
      cy.get(
        ':nth-child(6) > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-input',
      )
        .clear()
        .type('102 Phan Văn Hớn');
      cy.get(
        ':nth-child(7) > :nth-child(1) > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-item',
      )
        .trigger('mousemove')
        .click({ force: true })
        .then(() => {
          cy.contains('Viet Nam').click({ force: true });
        });
      cy.get(
        ':nth-child(7) > :nth-child(2) > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-item',
      )
        .trigger('mousemove')
        .click({ force: true })
        .then(() => {
          cy.contains('Thanh Pho Ho Chi Minh').click();
        });
      cy.get(
        ':nth-child(7) > :nth-child(3) > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-input',
      ).type('70000');

      cy.get(
        ':nth-child(8) > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-input',
      ).type('102 Phan Văn Hớn');
      cy.get(
        ':nth-child(9) > :nth-child(1) > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-item',
      )
        .trigger('mousemove')
        .click({ force: true })
        .then(() => {
          cy.contains('Viet Nam').click();
        });
      cy.get(
        ':nth-child(9) > :nth-child(2) > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-item',
      )
        .trigger('mousemove')
        .click({ force: true })
        .then(() => {
          cy.contains('Thanh Pho Ho Chi Minh').click();
        });
      cy.get(
        ':nth-child(9) > :nth-child(3) > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-input',
      ).type('70000');
      cy.root().submit();
      // cy.get(".spaceFooter___1MjIq > .ant-btn").click();
      // cy.logout();
    });
  });
});
