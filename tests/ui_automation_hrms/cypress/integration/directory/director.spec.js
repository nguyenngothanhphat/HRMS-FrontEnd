/* eslint-disable no-undef */
/* eslint-disable camelcase */
/// <reference types="cypress" />
const host_url = Cypress.env('HOST_URL');
const owner_email = Cypress.env('owner_email');
const password = Cypress.env('password');
const id = 1000 + Math.floor(Math.random() * 9000);
// info employee
const employee = {
  company: 'TERRALOGIC',
  id,
  name: 'Nguyen Van A',
  join_date: '2021-08-01', // YYYY-MM-DD
  email: `nva.${id}@mailinator.com`,
  work_email: `nva.${id}@mailinator.com`,
  type: 'Full Time',
  title: 'Senior Software engineer II',
  department: 'Engineering',
  manager: 'Ngoc Nguyen',
  DOB: '08.27.98', // MM.DD.YY,
  legalGender: 'Male',
  workNumber: '0123456789',
  natisonalNumber: '123456789012',
  personalNumber: '0123456789',
  personalEmail: 'nva@mailinator.com',
  BloodGroup: 'O+',
  MaritalStatus: 'Single',
  linkedin: 'https://www.linkedin.com/',
  address: '102 Phan Van Hon',
  CityName: 'Ho Chi Minh',
  country: 'Viet Nam',
  state: 'Thanh Pho Ho Chi Minh',
  zipcode: '70000',
};

describe('Directory Automation', () => {
  before(() => {
    cy.visit(host_url);
  });

  it('Search and Add employee', () => {
    cy.loginAsSomeone(owner_email, password);
    cy.contains('Please select a company profile to proceed', {
      timeout: 10000,
    });
    cy.contains('TERRALOGIC')
      .parentsUntil('.companiesContainer___3Yqdu')
      .contains('Get Started')
      .click();
    cy.wait(1000);
    cy.contains('Employees Management', {
      timeout: 10000,
    }).click({
      force: true,
    });
    cy.wait(10000);
    cy.contains('Filter').should('be.visible').click();
    cy.get('.PaddingFilter___2rdaN > .ant-input').type(employee.name);
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
    cy.get('#formAddEmployee_company').type(`${employee.company}{enter}`, {
      force: true,
    });

    cy.wait(2000);
    cy.get('#formAddEmployee_roles').type('EMPLOYEE{enter}', {
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
    cy.wait(5000);
    cy.logout();
  });

  it('add infomation employee', () => {
    cy.loginAsSomeone(owner_email, password);
    cy.contains('Please select a company profile to proceed', {
      timeout: 10000,
    });
    cy.contains('TERRALOGIC')
      .parentsUntil('.companiesContainer___3Yqdu')
      .contains('Get Started')
      .click();
    cy.wait(1000);
    cy.contains('Employees Management', {
      timeout: 10000,
    }).click({
      force: true,
    });
    cy.wait(10000);
    cy.contains('Filter').should('be.visible').click();
    cy.get('.PaddingFilter___2rdaN > .ant-input').type(employee.email);

    // cy.pause();
    cy.wait(3000);
    cy.get('.directoryTableName___UAFj4').click();
    cy.wait(10000);
    cy.get('.flexEdit___1-A4Q').click();
    cy.wait(1000);
    cy.get('.ant-picker #DOB')
      .clear({
        force: true,
      })
      .type(`${employee.DOB}{enter}`, {
        force: true,
      });
    cy.get(':nth-child(1) > .ant-radio > .ant-radio-input', {
      force: true,
    }).click();
    cy.get('#workNumber').clear().type(employee.workNumber, {
      force: true,
    });
    // cy.get("#adhaarCardNumber").type("123456789123");
    cy.get('#uanNumber').clear().type(employee.natisonalNumber, {
      force: true,
    });
    cy.get('.spaceFooter___3j0Pi > .ant-btn').click();
    cy.wait(2000);
    cy.get('.flexEdit___2Kt_Y').click();
    cy.get('input#personal_information_personalNumber').clear().type(employee.personalNumber, {
      force: true,
    });
    cy.get('input#personal_information_Blood')
      .trigger('mousemove', {
        force: true,
      })
      .click({
        force: true,
      })
      .then(() => {
        cy.contains(employee.BloodGroup).click({
          force: true,
        });
      });
    cy.wait(1000);
    cy.get('input#personal_information_maritalStatus')
      .click({
        force: true,
      })
      .then(() => {
        cy.get(`[title="${employee.MaritalStatus}"]`).last().click({
          force: true,
        });
      });

    cy.get('input#personal_information_linkedIn').clear().type(employee.linkedin, {
      force: true,
    });
    cy.get(
      ':nth-child(7) > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-input',
    )
      .clear()
      .type(employee.address);
    cy.get(
      ':nth-child(9) > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-input',
    )
      .clear()
      .type(employee.CityName);
    cy.get(
      ':nth-child(10) > .ant-col-18 > [style="margin-left: -6px; margin-right: -6px; row-gap: 24px;"] > :nth-child(1) > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-search>.ant-select-selection-search-input',
    )
      .type(employee.country, {
        force: true,
      })
      .then(() => {
        cy.get('[title="Viet Nam"]').last().click({
          force: true,
        });
      });
    cy.wait(1000);
    cy.get(
      ':nth-child(10) > .ant-col-18 > [style="margin-left: -6px; margin-right: -6px; row-gap: 24px;"] > :nth-child(2) > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-search>.ant-select-selection-search-input',
    )
      .trigger('mousemove', { force: true })
      .click({ force: true })
      .type('thanh', { force: true })
      .then(() => {
        cy.get('[title="Thanh Pho Ho Chi Minh"]').last().click({
          force: true,
        });
      });
    cy.get(
      ':nth-child(10) > .ant-col-18 > [style="margin-left: -6px; margin-right: -6px; row-gap: 24px;"] > :nth-child(3) > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-input',
    )
      .clear()
      .type('70000', {
        force: true,
      });

    cy.get(
      ':nth-child(12) > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-input',
    )
      .clear()
      .type('102 Phan Văn Hớn');
    cy.get(
      ':nth-child(14) > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-input',
    )
      .clear()
      .type('Ho Chi Minh');
    cy.get(
      ':nth-child(15) > .ant-col-18 > [style="margin-left: -6px; margin-right: -6px; row-gap: 24px;"] > :nth-child(1) > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector >  .ant-select-selection-search>.ant-select-selection-search-input',
    )
      .type('Viet Nam', {
        force: true,
      })
      .then(() => {
        cy.get('[title="Viet Nam"]').last().click({
          force: true,
        });
      });
    cy.wait(1000);
    cy.get(
      ':nth-child(15) > .ant-col-18 > [style="margin-left: -6px; margin-right: -6px; row-gap: 24px;"] > :nth-child(2) > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-search>.ant-select-selection-search-input',
    )
      .trigger('mousemove', { force: true })
      .click({ force: true })
      .type('thanh', { force: true })
      .then(() => {
        cy.get('[title="Thanh Pho Ho Chi Minh"]').last().click({
          force: true,
        });
      });
    cy.get(
      ':nth-child(15) > .ant-col-18 > [style="margin-left: -6px; margin-right: -6px; row-gap: 24px;"] > :nth-child(3) > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-input',
    )
      .clear()
      .type('70000', {
        force: true,
      });
    cy.get('.spaceFooter___1MjIq > .ant-btn').click();
    // cy.logout();
  });
});
