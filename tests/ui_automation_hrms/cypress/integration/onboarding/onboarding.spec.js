/* eslint-disable no-undef */
/* eslint-disable camelcase */
/// <reference types="cypress" />

const hr_email = Cypress.env('hr_email');
const hrManager_email = Cypress.env('hrManager_email');
const password = Cypress.env('password');
const id = 1000 + Math.floor(Math.random() * 9000);
// info employee
const candidate = {
  company: 'TERRALOGIC',
  id,
  firstName: 'Nguyen',
  middleName: 'Van',
  lastName: 'B',
  // personalEmail: `nva.9541@mailinator.com`,
  personalEmail: `nva.${id}@mailinator.com`,

  previousExperience: '1',
  join_date: '08.30.21', // MM.DD.YY
  email: `nva.${id}@mailinator.com`,
  work_email: `nva.${id}@mailinator.com`,
  type: 'Full Time',
  grade: '5',
  location: 'Headquarter',
  title: 'Software engineer I',
  department: 'Engineering',
  manager: 'dan',
  manager_email: 'dan.nguyen1@mailinator.com',
};

describe('Onboarding Automation', () => {
  it('Add candidate', () => {
    cy.visit('https://stghrms.paxanimi.ai/login');
    cy.wait(1000);
    cy.loginAsSomeone(hr_email, password);
    // cy.contains('Please select a company profile to proceed', {
    //   timeout: 10000,
    // });
    // cy.contains('TERRALOGIC')
    //   .parentsUntil('.companiesContainer___3Yqdu')
    //   .contains('Get Started')
    //   .click();
    cy.wait(1000);
    cy.contains('Employee Onboarding', {
      timeout: 10000,
    }).click({
      force: true,
    });
    cy.wait(2000);
    cy.contains('Add Team Member');
    cy.contains('Add Team Member').click({ force: true });
    cy.wait(2000);
    // get ticket id
    cy.get('.titlePage__text___3NAHj').then((res) => {
      cy.get(res[0])
        .invoke('text')
        .then((text) => {
          const parts = text.split('[');
          const moreparts = parts[1].split(']');
          const ticket_id = moreparts[0];

          cy.writeFile('cypress/fixtures/onboarding_ticket.json', {
            ticketId: ticket_id,
            email: candidate.personalEmail,
          });
        });
    });

    // Basic Information
    cy.get('#basic_firstName').type(candidate.firstName);
    cy.get('#basic_middleName').type(candidate.middleName);
    cy.get('#basic_lastName').type(candidate.lastName);
    cy.get('#basic_privateEmail').type(candidate.personalEmail);
    cy.get('#basic_previousExperience').type(candidate.previousExperience);
    cy.contains('Next').click();

    // Job_detail
    cy.wait(1000);
    cy.get(
      '.Padding___1I4hm > .ant-row > :nth-child(1) > .ant-radio-wrapper > :nth-child(2) > .ant-typography',
    ).click();
    cy.get(':nth-child(3) > :nth-child(2) > .ant-typography').click();
    cy.get('#jobGradeLevel').type(`${candidate.grade}{enter}`, { force: true });
    cy.get('#workLocation')
      .type(candidate.location)
      .then(() => {
        cy.get('#workLocation_list').next().contains(candidate.location).click({ force: true });
      });
    // cy.wait(2000);
    cy.get('#department')
      .should('be.enabled')
      .type(candidate.department)
      .then(() => {
        cy.get('#department_list').next().contains(candidate.department).click({ force: true });
      });
    // cy.wait(1000);
    cy.get('#title')
      .should('be.enabled')
      .type(candidate.title)
      .then(() => {
        cy.get('#title_list').next().contains(candidate.title).click({ force: true });
      });
    // cy.wait(2000);
    cy.get('#reportingManager', { timeout: 10000 })
      .should('be.enabled', { timeout: 10000 })
      .type(candidate.manager)
      .then(() => {
        cy.get('#reportingManager_list')
          .next()
          .contains(`${candidate.manager} (${candidate.manager_email}`)
          .click({ force: true });
      });
    cy.get('.ant-picker-input > input').type(`${candidate.join_date}{enter}`, { force: true });
    cy.contains('Next').should('have.attr', 'type', 'button').click();

    // salary structure
    cy.wait(2000);
    cy.contains('Next').click();
    // Document verification
    cy.wait(2000);
    cy.get('.title___3dZKz').click();
    cy.get('#employer').type('Test');
    cy.get('.bottomBar__button___p89Ap > .ant-btn-primary').click();
    cy.get('.ant-radio-group > :nth-child(1) > :nth-child(2)').click();
    cy.get(
      '.margin___22UaK > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-btn',
    ).click();
    cy.get('.contentContainer___2iXWA > div > .ant-btn', { timeout: 10000 }).click();
    cy.wait(2000);
    cy.logout();
  });

  // candidate login
  it('Get password candidate', () => {
    cy.visit('https://www.mailinator.com/');
    cy.readFile('cypress/fixtures/onboarding_ticket.json').then((item) => {
      cy.get('#addOverlay').type(`${item.email}{enter}`);

      cy.wait(2000);
      cy.get(
        '.wrapper-table > .os-padding > .os-viewport > .os-content>table>tbody>tr:first',
      ).click();
      cy.wait(2000);
      cy.get('#html_msg_body').within(($iframe) => {
        const iFrameContent = $iframe.contents().find('body');
        cy.wrap(iFrameContent)
          .contains('Password:')
          .then((res) => {
            cy.get(res[0])
              .invoke('text')
              .then((text) => {
                const parts = text.split(' ');
                // const moreparts = parts[1].split(']');
                const password_candidate = parts[1];

                cy.writeFile('cypress/fixtures/onboarding_ticket.json', {
                  ...item,
                  password: password_candidate,
                });
              });
          });
      });
    });
  });

  // candidate login
  it('Candidate Login', () => {
    cy.visit('https://stghrms.paxanimi.ai/login');
    cy.readFile('cypress/fixtures/onboarding_ticket.json').then((item) => {
      cy.loginAsSomeone(item.email, item.password);
      cy.wait(2000);
      cy.get('#basic_currentPassword').type(item.password);
      cy.get('#basic_newPassword').type(password);
      cy.get('#basic_confirmPassword').type(password);
      cy.get('.ant-btn').click();
      cy.wait(2000);
      cy.loginAsSomeone(item.email, password);
    });
    cy.wait(5000);
    cy.get('.bottomBar__button___3vAz- > .ant-btn', { timeout: 10000 }).click();
    cy.wait(2000);
    cy.get('.ant-btn-primary').click();
    cy.wait(2000);
    cy.get('.ant-btn-primary').click();
    cy.wait(3000);
    const file = 'a.pdf';
    cy.get(
      ':nth-child(2) > .ant-collapse > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box > .ant-space > .ant-space-item > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col-5 > .UploadImageFile___BpwvH > .ant-upload-select > .ant-upload>input',
    ).attachFile(file);
    cy.wait(3000);

    cy.get(
      ':nth-child(2) > .ant-collapse > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box > .ant-space > .ant-space-item > :nth-child(1) > :nth-child(2) > .ant-row > .ant-col-5 > .UploadImageFile___BpwvH > .ant-upload-select > .ant-upload>input',
    ).attachFile(file);
    cy.wait(3000);
    cy.get(
      ':nth-child(2) > .ant-collapse > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box > .ant-space > .ant-space-item > :nth-child(1) > :nth-child(3) > .ant-row > .ant-col-5 > .UploadImageFile___BpwvH > .ant-upload-select > .ant-upload>input',
    ).attachFile(file);
    cy.wait(3000);
    cy.get(
      ':nth-child(2) > .ant-collapse > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box > .ant-space > .ant-space-item > :nth-child(1) > :nth-child(4) > .ant-row > .ant-col-5 > .UploadImageFile___BpwvH > .ant-upload-select > .ant-upload>input',
    ).attachFile(file);
    cy.wait(3000);
    cy.get(
      ':nth-child(3) > .ant-collapse > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box > .ant-space > .ant-space-item > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col-5 > .UploadImageFile___BpwvH > .ant-upload-select > .ant-upload>input',
    ).attachFile(file);
    cy.wait(3000);
    cy.get(
      ':nth-child(4) > .ant-collapse > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box > .ant-space > .ant-space-item > :nth-child(1) > :nth-child(1) > .ant-row > .ant-col-5 > .UploadImageFile___BpwvH > .ant-upload-select > .ant-upload>input',
    ).attachFile(file);
    cy.wait(3000);
    cy.get(
      ':nth-child(4) > .ant-collapse > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box > .ant-space > .ant-space-item > :nth-child(1) > :nth-child(2) > .ant-row > .ant-col-5 > .UploadImageFile___BpwvH > .ant-upload-select > .ant-upload>input',
    ).attachFile(file);
    cy.wait(3000);
    cy.get(
      ':nth-child(4) > .ant-collapse > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box > .ant-space > .ant-space-item > :nth-child(1) > :nth-child(3) > .ant-row > .ant-col-5 > .UploadImageFile___BpwvH > .ant-upload-select > .ant-upload>input',
    ).attachFile(file);
    cy.wait(3000);
    cy.get(
      ':nth-child(4) > .ant-collapse > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box > .ant-space > .ant-space-item > :nth-child(1) > :nth-child(4) > .ant-row > .ant-col-5 > .UploadImageFile___BpwvH > .ant-upload-select > .ant-upload>input',
    ).attachFile(file);
    cy.get('#startDate').type('08.18.20{enter}', { force: true });
    cy.get('#endDate').type('08.18.21{enter}', { force: true });
    cy.get('.ant-form-item-control-input-content > .ant-btn')
      .should('be.enabled')
      .click({ force: true });
    cy.get('.contentContainer___BznJ5 > div > .ant-btn', { timeout: 10000 }).click();
    cy.wait(2000);
    cy.get('.headerRight___3W1x4 > .ant-btn > span').click({ force: true });
  });

  // hr verify document
  it('HR verify document', () => {
    cy.visit('https://stghrms.paxanimi.ai/login');
    cy.wait(1000);
    cy.loginAsSomeone(hr_email, password);
    // cy.contains('Please select a company profile to proceed', {
    //   timeout: 10000,
    // });
    // cy.contains('TERRALOGIC')
    //   .parentsUntil('.companiesContainer___3Yqdu')
    //   .contains('Get Started')
    //   .click();
    cy.wait(1000);
    cy.contains('Employee Onboarding', {
      timeout: 10000,
    }).click({
      force: true,
    });
    cy.wait(5000);
    cy.get(':nth-child(2) > .menuWrapper___1SS2k > .menuItem___3aW6J').click();
    cy.wait(3000);

    cy.readFile('cypress/fixtures/onboarding_ticket.json').then((item) => {
      cy.contains(item.ticketId).click();
    });
    cy.wait(5000);
    // type A
    cy.get(
      ':nth-child(1) > .ant-collapse > .ant-collapse-item > .ant-collapse-header > .anticon > svg',
    ).click();
    cy.get(
      ':nth-child(1) > .ant-row > .ant-col-11 > .ant-radio-group > .verified___3x-Oq > .ant-radio > .ant-radio-input',
    ).click();
    cy.get(
      ':nth-child(2) > .ant-row > .ant-col-11 > .ant-radio-group > .verified___3x-Oq > .ant-radio > .ant-radio-input',
    ).click();
    cy.get(
      ':nth-child(3) > .ant-row > .ant-col-11 > .ant-radio-group > .verified___3x-Oq > .ant-radio > .ant-radio-input',
    ).click();
    cy.get(
      ':nth-child(4) > .ant-row > .ant-col-11 > .ant-radio-group > .verified___3x-Oq > .ant-radio',
    ).click();
    // type B
    cy.get(
      ':nth-child(2) > .ant-collapse > .ant-collapse-item > .ant-collapse-header > .anticon > svg',
    ).click();
    cy.get(
      ':nth-child(2) > .ant-collapse > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box > .ant-space > .ant-space-item > .ant-row > .ant-col-11 > .ant-radio-group > .verified___3x-Oq > .ant-radio > .ant-radio-input',
    ).click();
    // type C
    cy.get(
      ':nth-child(3) > .ant-collapse > .ant-collapse-item > .ant-collapse-header > .anticon > svg',
    ).click();
    cy.get(
      ':nth-child(3) > .ant-collapse > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box > .ant-space > :nth-child(1) > .ant-row > .ant-col-11 > .ant-radio-group > .verified___3x-Oq > .ant-radio > .ant-radio-input',
    ).click();
    cy.get(
      ':nth-child(3) > .ant-collapse > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box > .ant-space > :nth-child(2) > .ant-row > .ant-col-11 > .ant-radio-group > .verified___3x-Oq > .ant-radio > .ant-radio-input',
    ).click();
    cy.get(
      ':nth-child(3) > .ant-collapse > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box > .ant-space > :nth-child(3) > .ant-row > .ant-col-11 > .ant-radio-group > .verified___3x-Oq > .ant-radio > .ant-radio-input',
    ).click();
    cy.get(
      ':nth-child(3) > .ant-collapse > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box > .ant-space > :nth-child(4) > .ant-row > .ant-col-11 > .ant-radio-group > .verified___3x-Oq > .ant-radio > .ant-radio-input',
    ).click();
    // type E
    cy.get(
      '.PreviousEmployment___3kdUM > .ant-collapse > .ant-collapse-item > .ant-collapse-header > .anticon > svg',
    ).click();
    // Next
    cy.get('.ant-col-8 > .ant-btn-primary').should('be.enabled').click();

    // offer detailt
    cy.wait(2000);
    cy.get('.ant-select-selector')
      .trigger('mousedown')
      .then(() => {
        cy.contains('Intern Offer letter.pdf').click({ force: true });
      });
    cy.wait(1000);
    cy.get('.bottomBar__button___3SYpP > .ant-btn-primary').should('be.enabled').click();
    // Pay roll setting
    cy.wait(3000);
    cy.get(':nth-child(2) > .ant-btn', { timeout: 6000 }).click();
    // Benefits
    cy.wait(2000);
    cy.get('.checkboxMedical___3eUf2 > .ant-checkbox > .ant-checkbox-input').click({ force: true });
    cy.get(
      ':nth-child(5) > .checkBoxHeaderTop___2by3M > .ant-checkbox > .ant-checkbox-input',
    ).click({ force: true });
    cy.get(
      ':nth-child(6) > .checkBoxHeaderTop___2by3M > .ant-checkbox > .ant-checkbox-input',
    ).click({ force: true });
    cy.wait(2000);

    cy.get(':nth-child(2) > .ant-btn').should('be.enabled').click();
    // Periview Offer letter
    cy.wait(3000);
    cy.get('.ant-select-selection-item')
      .trigger('mousedown')
      .then(() => {
        cy.get('[title="Digital Signature"]').click({ force: true });
      });
    cy.get('.ant-col > .ant-input').type('Uyen Lam', { force: true });
    cy.get('.ant-col > .ant-input').clear().type('Uyen Lam', { force: true });

    cy.get(':nth-child(4) > .ant-radio-wrapper > .ant-radio > .ant-radio-inner').click({
      force: true,
    });
    cy.get('.submitContainer___2fKdz > .ant-btn').click();
    cy.wait(2000);
    cy.get('#myForm > .ant-btn').should('be.enabled').click();
    cy.get('.contentContainer___3-OXs > div > .ant-btn', { timeout: 10000 }).click();
    cy.wait(2000);
    cy.logout();
  });

  // hr manager
  it('HR Manager verify', () => {
    cy.visit('https://stghrms.paxanimi.ai/login');
    // cy.contains('Sign in to your account', { timeout: 10000 });
    cy.wait(1000);
    cy.loginAsSomeone(hrManager_email, password);
    // cy.contains('Please select a company profile to proceed', {
    //   timeout: 10000,
    // });
    // cy.contains('TERRALOGIC')
    //   .parentsUntil('.companiesContainer___3Yqdu')
    //   .contains('Get Started')
    //   .click();
    cy.wait(1000);
    cy.contains('Employee Onboarding', {
      timeout: 10000,
    }).click({
      force: true,
    });
    cy.wait(6000);
    cy.get(':nth-child(4) > .menuWrapper___1SS2k > .menuItem___3aW6J', { timeout: 10000 }).click();
    cy.wait(2000);
    cy.readFile('cypress/fixtures/onboarding_ticket.json').then((item) => {
      cy.contains(item.ticketId).click();
    });
    cy.wait(7000);
    cy.get('#rc_select_3')
      .trigger('mousedown')
      .then(() => {
        cy.get('[title="Digital Signature"]').click({ force: true });
      });
    cy.get(':nth-child(2) > :nth-child(5) > .ant-col > .ant-input').type('Hr Manager', {
      force: true,
    });
    cy.get(':nth-child(2) > :nth-child(5) > .ant-col > .ant-input')
      .clear()
      .type('Hr Manager', { force: true });

    cy.get(':nth-child(4) > .ant-radio-wrapper > .ant-radio > .ant-radio-inner').click({
      force: true,
    });
    cy.get(':nth-child(2) > .submitContainer___2fKdz > .ant-btn').click();
    cy.wait(2000);
    cy.get('.ant-form-item-control-input-content > .ant-btn').should('be.enabled').click();
    cy.get('.contentContainer___3-OXs > div > .ant-btn', { timeout: 10000 }).click();
    cy.wait(2000);
    cy.logout();
  });

  // candidate
  it.only('Candidate accept final offer', () => {
    cy.visit('https://stghrms.paxanimi.ai/login');
    cy.readFile('cypress/fixtures/onboarding_ticket.json').then((item) => {
      // cy.loginAsSomeone(item.email, item.password);
      // cy.wait(2000);
      // cy.get('#basic_currentPassword').type(item.password);
      // cy.get('#basic_newPassword').type(password);
      // cy.get('#basic_confirmPassword').type(password);
      // cy.get('.ant-btn').click();
      // cy.wait(2000);
      cy.loginAsSomeone(item.email, password);
    });
    cy.wait(7000);
    cy.get(
      ':nth-child(5) > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title',
    ).click();
    cy.wait(2000);
    cy.get('.ant-select-selection-item')
      .trigger('mousedown')
      .then(() => {
        cy.get('[title="Digital Signature"]').click({ force: true });
      });
    cy.get('.ant-input').type('B Nguyen', {
      force: true,
    });
    cy.get('.ant-input').clear().type('B Nguyen', { force: true });

    cy.get(':nth-child(1) > .ant-radio-wrapper > .ant-radio').click({
      force: true,
    });
    cy.get('.submitContainer___31abH > .ant-btn').click();
    cy.wait(3000);
    cy.get('.bottomBar__button___2nrxZ > .ant-btn-primary').should('be.enabled').click();
    cy.wait(3000);
    cy.get('.ant-btn-primary').click();
    cy.wait(5000);
    cy.get(':nth-child(3) > .ant-btn').should('be.enabled').click();
    cy.get('.contentContainer___D2g5L > div > .ant-btn', { timeout: 10000 });
    cy.wait(3000);
    cy.get('.headerRight___3W1x4 > .ant-btn').click({ force: true });
  });
});
