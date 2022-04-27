/* eslint-disable no-undef */
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
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// code to ignore resize observer loop errors
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
// eslint-disable-next-line consistent-return
Cypress.on('uncaught:exception', (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});

Cypress.Commands.add('loginAsSomeone',(Employee_email,password)=>{
  cy.get('#basic_userEmail.ant-input').type(Employee_email);
  cy.get('#basic_password.ant-input').type(password);
  cy.get('button[type="submit"]').click();
  cy.wait(5000);
})
Cypress.Commands.add('logout',()=>{
  cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
  .then(() =>{
  cy.contains('Logout').wait(2000).click({force:true});
  }); 
  cy.wait(3000);
})
Cypress.Commands.add('CreatingTimesheet',(startDate,endDate)=>{
  cy.contains("Add Task").click({force:true});
  cy.get('#basic_tasks_0_projectId').type('TM'+'{enter}')
  cy.get('#basic_tasks_0_taskName').type('python');
  cy.wait(1000);
  cy.get("#basic_tasks_0_startTime",{timeout:3000}).type(startDate + '{enter}', {force: true})
  cy.get('#basic_tasks_0_endTime',{timeout:3000}).type(endDate + '{enter}', {force: true})
  cy.get('#basic_tasks_0_notes').type("important");
  cy.get("#basic_tasks_0_clientLocation").click();
  cy.get('button[type="Submit"]').click();
  cy.wait(10000);
})
Cypress.Commands.add('DeletingTimesheet',()=>{
  cy.get('img[src="/static/del.130ca399.svg"]').eq(0).click({force:true})
        cy.contains("Yes").click();
        cy.wait(3000)
})
Cypress.Commands.add('loginAsSomeone', (email, password) => {
  cy.get('#basic_userEmail.ant-input', { timeout: 8000 }).type(email);
  cy.get('#basic_password.ant-input', { timeout: 8000 }).type(password);
  cy.get('#basic_keepSignIn', { timeout: 8000 }).click();
  cy.get('button[type="submit"]', { timeout: 8000 }).click();
});

Cypress.Commands.add('logout', () => {
  cy.get('.ant-dropdown-trigger', { timeout: 8000 }).then((resp) => {
    cy.get(resp[1]).trigger('mousemove').click();
    cy.contains('Logout').click();
  });
});

Cypress.Commands.add('iframe', { prevSubject: 'element' }, ($iframe, callback = () => {}) => {
  // For more info on targeting inside iframes refer to this GitHub issue:
  // https://github.com/cypress-io/cypress/issues/136
  cy.log('Getting iframe body');

  return cy
    .wrap($iframe)
    .should((iframe) => expect(iframe.contents().find('body')).to.exist)
    .then((iframe) => cy.wrap(iframe.contents().find('body')))
    .within({}, callback);
});
