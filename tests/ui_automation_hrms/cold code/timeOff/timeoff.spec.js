/* eslint-disable camelcase */
/* eslint-disable no-undef */
/// <reference types="cypress" />

// let all_env_vars = Cypress.env(); // can store all vars in the env in a variable as a JSON object this way
const manager_email = Cypress.env('manager_email');
const password = Cypress.env('password');
const fromDate = Cypress.env('fromDate');
const toDate = Cypress.env('toDate');

describe('Timeoff Automation', () => {
  before(() => {
    cy.visit('/');
  });

  it('Applies For and Accepts Timeoff', () => {
    cy.readFile('cypress/fixtures/directory.json').then((item) => {
      cy.loginAsSomeone(item.email, item.password);
    });

    cy.contains('Timeoff').click({ force: true });

    cy.contains('Request ').click();

    cy.get('#basic_timeOffType')
      .trigger('mousemove')
      .click()
      .then(() => {
        cy.contains('Sick Leave').click();
      });

    cy.get('#basic_subject', { timeout: 3000 }).type('Leave Application');

    cy.get('#basic_durationFrom', { timeout: 3000 }).type(`${fromDate}{enter}`, { force: true });

    cy.get('#basic_durationTo', { timeout: 3000 }).type(`${toDate}{enter}`, { force: true });

    cy.get('#basic_description', { timeout: 3000 }).type(
      'Renovating house. Would appreciate 2 days off.',
    );

    // cy.pause(); // Login as employee and apply for leave.

    cy.contains('Submit').click();

    cy.contains('OK', { timeout: 20000 }).click();

    cy.contains('View Request', { timeout: 10000 })
      .click()
      .then(() => {
        cy.wait(3000); // waiting for page to fully load
        cy.get('p', { timeout: 10000 }).then((response) => {
          cy.get(response[0])
            .invoke('text')
            .then((text) => {
              const parts = text.split(' ');
              const moreparts = parts[2].split(']');
              const id_latest = moreparts[0];

              cy.writeFile('cypress/fixtures/timeOff_ticket.json', { ticketId: id_latest });
            });
        });
      });

    cy.logout();

    cy.loginAsSomeone(manager_email, password);

    cy.contains('Timeoff').click({ force: true });

    cy.readFile('cypress/fixtures/timeOff_ticket.json').then((item) => {
      cy.contains(item.ticketId).click();
      cy.wait(3000);
      // cy.pause(); // Login as manager and approve it.

      cy.contains('Approve').click();
    });
    cy.wait(3000);
    cy.logout();
  });

  //   it('Restores Leave Count', () => {
  //     cy.readFile('cypress/fixtures/directory.json').then((item) => {
  //       cy.loginAsSomeone(item.email, item.password);
  //     });

  //     cy.contains('Timeoff', { timeout: 10000 }).click({ force: true });

  //     // cy.pause();  // Login as the employee and verify approval.

  //     cy.contains('Approved', { timeout: 8000 }).click();

  //     cy.readFile('latest_id_timeoff.txt').then((text) => {
  //       cy.contains(text, { timeout: 3000 }).click();

  //       cy.contains('Approved', { timeout: 3000 }).click();

  //       // cy.pause(); // Apply for withdrawal.
  //       cy.contains('Withdraw', { timeout: 5000 }).click();

  //       cy.get('textarea', { timeout: 3000 }).then((resp) => {
  //         cy.get(resp[0]).type('Renovation postponed. Will save for later.', { force: true });
  //         cy.contains('Submit').click();
  //       });
  //     });

  //     cy.contains('Withdraw request sent', { timeout: 12000 });

  //     cy.contains('Timeoff', { timeout: 8000 }).click({ force: true });

  //     cy.contains('Dashboard', { timeout: 8000 }).click({ force: true });

  //     cy.wait(3000); // waiting for page to fully load

  //     cy.logout();

  //     cy.loginAsSomeone(manager_email, password);

  //     cy.contains('Timeoff', { timeout: 8000 }).click({ force: true });

  //     cy.contains('Withdraw', { timeout: 8000 }).click();

  //     cy.readFile('latest_id_timeoff.txt').then((text) => {
  //       cy.contains(text, { timeout: 3000 }).click();

  //       // cy.pause(); // Login as manager and approve withdrawal request.

  //       cy.contains('Accept withdraw', { timeout: 3000 }).click();
  //       cy.contains('OK', { timeout: 12000 }).click();
  //     });

  //     cy.logout();

  //     cy.readFile('cypress/fixtures/directory.json').then((item) => {
  //       cy.loginAsSomeone(item.email, item.password);
  //     });

  //     cy.contains('Timeoff', { timeout: 8000, force: true }).click({ force: true });

  //     // cy.pause(); // Finally, log in as employee and verify approval of withdrawal.
  //   });

  //   it('Tests the  draft and reject flows', () => {
  //     cy.visit('https://stghrms.paxanimi.ai/login');

  //     cy.readFile('cypress/fixtures/directory.json').then((item) => {
  //       cy.loginAsSomeone(item.email, item.password);
  //     });

  //     cy.contains('Timeoff', { timeout: 15000 }).click({ force: true });

  //     cy.contains('Request ').click();

  //     cy.get('#basic_timeOffType')
  //       .trigger('mousemove')
  //       .click()
  //       .then(() => {
  //         cy.contains('Sick Leave').click();
  //       });

  //     cy.get('#basic_subject').type('Leave Application');

  //     cy.get('#basic_durationFrom').type(`${fromDate}{enter}`, { force: true });

  //     cy.get('#basic_durationTo').type(`${toDate}{enter}`, { force: true });

  //     cy.get('#basic_description').type("Need casual leave to attend a friend's marriage.");

  //     cy.contains('Save to Draft').click();

  //     cy.contains('OK', { timeout: 10000 }).click();

  //     cy.contains('View Request', { timeout: 10000 })
  //       .click()
  //       .then(() => {
  //         cy.wait(3000); // waiting for page to fully load
  //         cy.get('p', { timeout: 10000 }).then((response) => {
  //           cy.get(response[0])
  //             .invoke('text')
  //             .then((text) => {
  //               const parts = text.split(' ');
  //               const moreparts = parts[2].split(']');
  //               const id_latest = moreparts[0];

  //               cy.writeFile('cypress/fixtures/timeOff_ticket.json', { ticketId: id_latest });
  //             });
  //         });
  //         cy.contains('Edit').click();
  //       });

  //     cy.get('#basic_leaveTimeLists_1', { timeout: 4000 })
  //       .trigger('mousedown', { force: true })
  //       .click({ force: true })
  //       .then(() => {
  //         cy.contains('Morning').click({ force: true });
  //       });

  //     cy.contains('Submit').click();

  //     cy.contains('OK', { timeout: 12000 }).click();

  //     cy.logout();

  //     cy.loginAsSomeone(manager_email, password);

  //     cy.contains('Timeoff').click({ force: true });

  //     cy.readFile('cypress/fixtures/timeOff_ticket.json').then((item) => {
  //       cy.contains(item.ticketId).click();

  //       // cy.pause(); // Login as manager and approve it.

  //       cy.contains('Reject').click();
  //       cy.contains('Submit', { timeout: 15000 }).click();
  //     });

  //     cy.logout();

  //     cy.readFile('cypress/fixtures/directory.json').then((item) => {
  //       cy.loginAsSomeone(item.email, item.password);
  //     });

  //     cy.contains('Timeoff', { timeout: 5000 }).click({ force: true });

  //     cy.contains('Rejected', { timeout: 5000 }).click();
  //   });
});
