/* eslint-disable no-undef */
/* eslint-disable camelcase */
/// <reference types="cypress" />
const owner_email = Cypress.env('owner_email');
const password = Cypress.env('password');
const id = 1000 + Math.floor(Math.random() * 9000);
// info employee
const employee = {
  id,
  name: 'Employee Auto Test',
  join_date: '2020-08-01', // YYYY-MM-DD
  email: `employee.${id}@mailinator.com`,
  work_email: `employee.${id}@mailinator.com`,
  type: 'Full Time',
  company: 'TERRALOGIC',
  role: 'EMPLOYEE',
  title: 'Software engineer II',
  location: 'Headquarter',
  department: 'Engineering',
  manager: 'Uy Manager',
  DOB: '08.27.98', // MM.DD.YY,
  legalGender: 'Male',
  workNumber: '0123456789',
  natisonalNumber: '123456789012',
  personalNumber: '0123456789',
  personalEmail: `employee.${id}@mailinator.com`,
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
  it('Search and Add employee', () => {
    cy.visit('/');
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

    // cy.pause();
    cy.get('.resetHide___2hDmP > p').click();
    cy.get('.formSelectTitle___TbiTl > .ant-select-selector > .ant-select-selection-item')
      .trigger('mousemove')
      .type(employee.title)
      // .click()
      .then(() => {
        cy.get(`[title="${employee.title}"]`).last().click({ force: true });
      });
    cy.wait(3000);
    cy.get('.resetHide___2hDmP > p').click();
    cy.contains('Add employee').click();
    cy.get('#formAddEmployee_employeeId').type(employee.id);
    cy.wait(1000);
    cy.get('#formAddEmployee_firstName').type(employee.name);
    cy.wait(1000);
    cy.get('#formAddEmployee_joinDate').type(`${employee.join_date}{enter}`, {
      force: true,
    });
    cy.wait(1000);
    cy.get('#formAddEmployee_personalEmail').type(employee.email);
    cy.wait(1000);
    cy.get('#formAddEmployee_workEmail').type(employee.work_email);
    cy.wait(1000);
    cy.get('#formAddEmployee_employeeType').type(`${employee.type}{enter}`, {
      force: true,
    });
    cy.wait(1000);
    cy.get('#formAddEmployee_company').type(`${employee.company}{enter}`, {
      force: true,
    });

    cy.wait(3000);
    cy.get('#formAddEmployee_roles').type(`${employee.role}{enter}`, {
      force: true,
    });
    cy.wait(1000);

    cy.get('#formAddEmployee_location').type(`${employee.location}{enter}`, {
      force: true,
    });
    cy.wait(1000);

    cy.get('#formAddEmployee_department')
      .type(employee.department)
      .then(() => {
        cy.get(`[title="${employee.department}"]`).last().click({ force: true });
      });
    cy.wait(1000);
    cy.get('#formAddEmployee_title')
      .type(employee.title)
      .then(() => {
        cy.get(`[title="${employee.title}"]`).last().click({ force: true });
      });
    cy.wait(1000);
    cy.get('#formAddEmployee_manager').type(`${employee.manager}{enter}`);
    cy.wait(1000);
    cy.get('.ant-modal-footer > .ant-btn').should('have.text', 'Submit').click();
    cy.writeFile('cypress/fixtures/directory.json', { email: employee.email });
    cy.wait(3000);
    cy.get('.resetHide___2hDmP > p').click();
    cy.get('.PaddingFilter___2rdaN > .ant-input').type(employee.email);
    cy.wait(3000);
    // cy.pause();

    // import employees
    cy.get('.resetHide___2hDmP > p').click();
    cy.contains('Import employees').click();
    const file = 'ImportTenantEmpl2.csv';
    cy.get('.fileUploadForm___33QtN > :nth-child(1) > input').attachFile(file);
    cy.contains('Submit').click();
    cy.wait(5000);
    cy.logout();
  });

  it('Employee active account', () => {
    cy.visit('https://www.mailinator.com/');
    cy.readFile('cypress/fixtures/directory.json').then((item) => {
      cy.get('#addOverlay').type(`${item.email}{enter}`);
    });
    cy.wait(6000);
    // cy.get(
    //   '.wrapper-table > .os-padding > .os-viewport > .os-content>table>tbody>tr:first',
    // ).click();
    cy.contains('[HRMS] - Verify User').click();
    cy.wait(5000);
    cy.get('#html_msg_body').within(($iframe) => {
      const iFrameContent = $iframe.contents().find('body');
      cy.wrap(iFrameContent).contains('VERIFY EMAIL').click();
    });
    cy.wait(10000);
    // cy.pause();
  });

  it('Employee get password', () => {
    cy.visit('https://www.mailinator.com/');
    cy.readFile('cypress/fixtures/directory.json').then((item) => {
      cy.get('#addOverlay').type(`${item.email}{enter}`);

      cy.wait(5000);
      cy.contains('[HRMS] - Active User').click();
      cy.wait(5000);
      cy.get('#html_msg_body').within(($iframe) => {
        const iFrameContent = $iframe.contents().find('body');
        cy.wrap(iFrameContent)
          .contains('Your sign in password:')
          .then((res) => {
            cy.get(res[0])
              .invoke('text')
              .then((text) => {
                const parts = text.split(' ');
                const password_new = parts[4];

                cy.writeFile('cypress/fixtures/directory.json', {
                  ...item,
                  password: password_new,
                });
              });
          });
      });
    });
    cy.wait(3000);
  });

  it('Employee Login', () => {
    cy.visit('/');
    cy.readFile('cypress/fixtures/directory.json').then((item) => {
      cy.loginAsSomeone(item.email, item.password);
      cy.wait(2000);
      cy.get('#basic_currentPassword').type(item.password);
      cy.get('#basic_newPassword').type(password);
      cy.get('#basic_confirmPassword').type(password);
      cy.get('.ant-btn').click();
      cy.wait(5000);
      cy.writeFile('cypress/fixtures/directory.json', { ...item, password });
      cy.loginAsSomeone(item.email, password);
    });
    cy.wait(5000);
    cy.get('.account___1r_Ku')
      .trigger('mousemove', { force: true })
      .click({ force: true })
      .then(() => {
        cy.contains('View profile').click({ force: true });
      });
    cy.wait(5000);
    cy.get('.flexEdit___2Kt_Y').should('have.text', 'Edit').click();
    cy.wait(1000);
    cy.get('input#personal_information_personalNumber').clear().type(employee.personalNumber, {
      force: true,
    });
    cy.wait(1000);
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

    cy.wait(1000);
    cy.get('input#personal_information_linkedIn').clear().type(employee.linkedin, {
      force: true,
    });
    cy.wait(1000);
    cy.get(
      ':nth-child(7) > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-input',
    )
      .clear()
      .type(employee.address);
    cy.wait(1000);
    cy.get(
      ':nth-child(9) > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-input',
    )
      .clear()
      .type(employee.CityName);
    cy.wait(1000);
    cy.get(
      ':nth-child(10) > .ant-col-18 > [style="margin-left: -6px; margin-right: -6px; row-gap: 24px;"] > :nth-child(1) > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-search>.ant-select-selection-search-input',
    )
      .type(employee.country, {
        force: true,
      })
      .then(() => {
        cy.get(`[title="${employee.country}"]`).last().click({
          force: true,
        });
      });
    cy.wait(1000);
    cy.get(
      ':nth-child(10) > .ant-col-18 > [style="margin-left: -6px; margin-right: -6px; row-gap: 24px;"] > :nth-child(2) > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-search>.ant-select-selection-search-input',
    )
      .trigger('mousemove', { force: true })
      .click({ force: true })
      .type(employee.state, { force: true })
      .then(() => {
        cy.get(`[title="${employee.state}"]`).last().click({
          force: true,
        });
      });
    cy.get(
      ':nth-child(10) > .ant-col-18 > [style="margin-left: -6px; margin-right: -6px; row-gap: 24px;"] > :nth-child(3) > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-input',
    )
      .clear()
      .type(employee.zipcode, {
        force: true,
      });

    cy.wait(2000);
    cy.get('.spaceFooter___1MjIq > .ant-btn').should('have.text', 'Save').click();
    cy.wait(3000);
  });
});
