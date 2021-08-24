/* eslint-disable no-undef */
/* eslint-disable camelcase */
/// <reference types="cypress" />
const host_url = Cypress.env('HOST_URL');
const hr_email = Cypress.env('hr_email');
// const hrManager_email = Cypress.env('hrManager_email');
const hrManager_email = 'linh.kai@mailinator.com';
const employee_email = Cypress.env('employee_email');
const manager_email = Cypress.env('manager_email');

const password = Cypress.env('password');
// info employee

describe('Offboaring automation', () => {
  before(() => {
    cy.visit(host_url);
  });

  it('Employee submit resignation', () => {
    cy.loginAsSomeone(employee_email, password);
    cy.contains('Please select a company profile to proceed', {
      timeout: 10000,
    });
    cy.contains('TERRALOGIC')
      .parentsUntil('.companiesContainer___3Yqdu')
      .contains('Get Started')
      .click();
    cy.wait(4000);
    cy.get('.account___1r_Ku')
      .trigger('mousemove')
      .click({ force: true })
      .then(() => {
        cy.contains('View profile').click({ force: true });
      });
    cy.wait(3000);
    cy.get('.viewBtnAction___3cOs4 > .ant-dropdown-trigger')
      .should('have.text', 'Actions ')
      .click();
    cy.contains('Job Change')
      .click({ force: true })
      .then(() => {
        cy.contains('Offboarding').click({ force: true });
      });
    cy.wait(3000);
    cy.get('.stepAction___3W-HR > .ant-btn')
      .should('have.text', 'Initiate resignation request')
      .click();
    cy.wait(3000);
    cy.get('.titleBody___35uUa > .ant-input').type('I want off');
    cy.get('.buttonSubmit___Qqr32').should('be.enabled').click();
    cy.wait(5000);
    cy.get('.rowAction__view___wge0z').click({ force: true });
    cy.wait(3000);
    cy.get('.headerPage__title___1w-1E').then((res) => {
      cy.get(res[0])
        .invoke('text')
        .then((text) => {
          const parts = text.split(' ');
          const moreparts = parts[2].split(']');
          const ticket_id = moreparts[0];
          cy.writeFile('cypress/fixtures/offboarding_ticket.json', {
            ticketId: ticket_id,
            // email: candidate.personalEmail,
          });
        });
    });
    cy.logout();
  });

  // Manager Accept
  it('Manager Accept', () => {
    cy.loginAsSomeone(manager_email, password);
    cy.contains('Please select a company profile to proceed', {
      timeout: 10000,
    });
    cy.contains('TERRALOGIC')
      .parentsUntil('.companiesContainer___3Yqdu')
      .contains('Get Started')
      .click();
    cy.wait(4000);
    cy.contains('Offboarding').click({ force: true });
    cy.wait(3000);
    cy.readFile('cypress/fixtures/offboarding_ticket.json').then((item) => {
      cy.contains(item.ticketId).click();
    });
    cy.wait(3000);
    cy.get('.content___3VE8G > .ant-btn').should('have.text', 'Schedule a 1-on-1').click();
    cy.wait(1000);
    cy.get('.ant-picker-input > input').type('2021-08-24{enter}', { force: true });
    cy.get('#rc_select_0')
      .click()
      .then(() => {
        cy.get('[title="10:00(am) - 11:00(am)"]').click({ force: true });
      });
    cy.get(':nth-child(4) > .ant-btn').should('be.enabled').click();
    cy.wait(3000);
    cy.pause();
    cy.get('.text___2P8vW').click();
    cy.get('.textArea___1dVk7 > .ant-input-affix-wrapper > .ant-input').type('Accepted');
    cy.get('.buttonArea___3LmGL > .ant-btn').should('be.enabled').click();
    cy.wait(2000);
    cy.get('.ant-btn-primary').click();
    cy.get('.modal__content___2yg-F > .ant-btn', { timeout: 10000 })
      .should('have.text', 'OK')
      .click();
    cy.wait(2000);
    cy.logout();
  });

  // hr verify
  it('HR verify', () => {
    cy.loginAsSomeone(hrManager_email, password);
    cy.contains('Please select a company profile to proceed', {
      timeout: 10000,
    });
    cy.contains('TERRALOGIC')
      .parentsUntil('.companiesContainer___3Yqdu')
      .contains('Get Started')
      .click();
    cy.wait(4000);
    cy.contains('Offboarding').click({ force: true });
    cy.wait(3000);
    cy.get(
      '.tabTable___3VrhQ > .ant-tabs > .ant-tabs-nav > .ant-tabs-nav-wrap > .ant-tabs-nav-list > :nth-child(4)',
    ).click();
    cy.wait(3000);
    cy.readFile('cypress/fixtures/offboarding_ticket.json').then((item) => {
      cy.contains(item.ticketId).click();
    });
    cy.wait(3000);
    // cy.get('.contentViewButton___2Sict > .ant-btn').should('have.text', 'Approve').click();
    cy.wait(3000);
    cy.get(':nth-child(2) > .ant-breadcrumb-link > a').should('have.text', 'Offboarding').click();
    cy.wait(3000);
    cy.get(
      '.tabTable___3VrhQ > .ant-tabs > .ant-tabs-nav > .ant-tabs-nav-wrap > .ant-tabs-nav-list > :nth-child(4)',
    ).click();
    cy.wait(3000);
    cy.readFile('cypress/fixtures/offboarding_ticket.json').then((item) => {
      cy.contains(item.ticketId)
        .parentsUntil('tr')
        .nextAll()
        .eq(8)
        .click()
        .then(() => {
          cy.contains('Move to relieving formalities').click({ force: true });
        });
      cy.wait(3000);

      // Relieving Formalities
      cy.get(
        '.containerEmployeeOffboarding___QbRTk > :nth-child(1) > :nth-child(1) > :nth-child(1) > .ant-tabs-nav-wrap > .ant-tabs-nav-list > :nth-child(2)',
      )
        .should('have.text', 'Relieving Formalities')
        .click();
      cy.wait(3000);
      cy.get(
        '.relievingTables___2J8FD > .ant-tabs > .ant-tabs-nav > .ant-tabs-nav-wrap > .ant-tabs-nav-list > :nth-child(2)',
      )
        .should('have.text', 'In Queues')
        .click();
      cy.wait(3000);
      cy.get('.inQueueTable___2MspW')
        .contains(item.ticketId)
        .parentsUntil('tr')
        .nextAll()
        .eq(4)
        .contains('Start Relieving Formalities')
        .click({ force: true });
      cy.wait(3000);
      cy.get('.mailExit__card__iconExtra___1Bw9T').click();
      cy.wait(6000);
      cy.contains('Exit interview package has been sent.', { timeout: 10000 });
      cy.logout();
    });
  });

  // employee submit exit package
  it('Employee Submit exit package', () => {
    cy.loginAsSomeone(employee_email, password);
    cy.contains('Please select a company profile to proceed', {
      timeout: 10000,
    });
    cy.contains('TERRALOGIC')
      .parentsUntil('.companiesContainer___3Yqdu')
      .contains('Get Started')
      .click();
    cy.wait(4000);
    cy.get('.account___1r_Ku')
      .trigger('mousemove')
      .click({ force: true })
      .then(() => {
        cy.contains('View profile').click({ force: true });
      });
    cy.wait(3000);
    cy.get('.viewBtnAction___3cOs4 > .ant-dropdown-trigger').click();
    cy.contains('Job Change')
      .click({ force: true })
      .then(() => {
        cy.contains('Offboarding').click({ force: true });
      });
    cy.wait(3000);
    cy.get(
      ':nth-child(1) > :nth-child(1) > :nth-child(1) > .ant-tabs-nav-wrap > .ant-tabs-nav-list > :nth-child(2)',
    )
      .should('have.text', 'Relieving Formalities')
      .click();
    cy.wait(5000);
    cy.get(':nth-child(1) > .Document___26KQL').click();
    cy.wait(1000);
    cy.get('#basic_questions_0').clear().type('Cypress auto testing 0');
    cy.get('#basic_questions_1').clear().type('Cypress auto testing 1');
    cy.get('#basic_questions_2').clear().type('Cypress auto testing 2');
    cy.get('#basic_questions_3').clear().type('Cypress auto testing 3');
    cy.get('#basic_questions_4').clear().type('Cypress auto testing 4');
    cy.get('#basic_questions_5').clear().type('Cypress auto testing 5');
    cy.get('#basic_questions_6').clear().type('Cypress auto testing 6');
    cy.get('#basic_questions_7').clear().type('Cypress auto testing 7');
    cy.get('#basic_questions_8').clear().type('Cypress auto testing 8');
    cy.get('#basic_questions_9').clear().type('Cypress auto testing 9');
    cy.get('#basic_questions_10').clear().type('Cypress auto testing 10');
    cy.wait(1000);
    cy.get('.footer___OzgVH > .ant-btn').should('have.text', 'Submit').click();
    cy.wait(3000);
    cy.get(':nth-child(2) > .Document___26KQL').click();
    cy.get('#basic_questions_0 > .ant-checkbox-wrapper > :nth-child(2) > div').click();
    cy.get('#basic_questions_1 > .ant-checkbox-wrapper > :nth-child(2) > div').click();
    cy.get('#basic_questions_2 > .ant-checkbox-wrapper > :nth-child(2) > div').click();
    cy.get('#basic_questions_3 > .ant-checkbox-wrapper > :nth-child(2) > div').click();
    cy.get('#basic_questions_4 > .ant-checkbox-wrapper > :nth-child(2) > div').click();
    cy.get('#basic_questions_5 > .ant-checkbox-wrapper > :nth-child(2) > div').click();
    cy.get('#basic_questions_6 > .ant-checkbox-wrapper > :nth-child(2) > div').click();
    cy.get('#basic_questions_7 > .ant-checkbox-wrapper > :nth-child(2) > div').click();
    cy.get('#basic_questions_8 > .ant-checkbox-wrapper > :nth-child(2) > div').click();

    cy.wait(1000);
    cy.get('.footer___OzgVH > .ant-btn').should('have.text', 'Submit').click();
    cy.wait(3000);
    cy.get('.submitButton___3mQm9').should('have.text', 'Submit to HR').click();
    cy.wait(3000);
    cy.logout();
  });

  // hr send close package and close ticket
  it('Hr send close package and close ticket', () => {
    cy.loginAsSomeone(hrManager_email, password);
    cy.contains('Please select a company profile to proceed', {
      timeout: 10000,
    });
    cy.contains('TERRALOGIC')
      .parentsUntil('.companiesContainer___3Yqdu')
      .contains('Get Started')
      .click();
    cy.wait(4000);
    cy.contains('Offboarding').click({ force: true });
    cy.wait(3000);
    cy.get(
      '.containerEmployeeOffboarding___QbRTk > :nth-child(1) > :nth-child(1) > :nth-child(1) > .ant-tabs-nav-wrap > .ant-tabs-nav-list > :nth-child(2)',
    )
      .should('have.text', 'Relieving Formalities')
      .click();
    cy.wait(3000);
    cy.get(
      '.relievingTables___2J8FD > .ant-tabs > .ant-tabs-nav > .ant-tabs-nav-wrap > .ant-tabs-nav-list > :nth-child(2)',
    )
      .should('have.text', 'In Queues')
      .click();
    cy.wait(3000);
    cy.readFile('cypress/fixtures/offboarding_ticket.json').then((item) => {
      cy.get('.inQueueTable___2MspW')
        .contains(item.ticketId)
        .parentsUntil('tr')
        .nextAll()
        .eq(4)
        .contains('Start Relieving Formalities')
        .click({ force: true });
    });
    cy.wait(3000);
    cy.get('.ant-form-item-control-input-content > .ant-btn').should('have.text', 'Send').click();
    cy.wait(7000);
    cy.get('.relievingDetail__btnClose___1iWz_')
      .should('have.text', 'Close employee record')
      .should('be.enabled')
      .click();
    cy.wait(3000)
  });
});
