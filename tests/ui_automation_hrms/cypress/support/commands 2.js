// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


import 'cypress-file-upload';


// code that terminates all subsequent tests if one fails
afterEach(function() {
    if (this.currentTest.state === 'failed') {
      Cypress.runner.stop()
    }
});


// const resizeObserverLoopErrRe = /^ResizeObserver loop limit exceeded/

// Cypress.on('uncaught:exception', (err) => {
//   if (resizeObserverLoopErrRe.test(err.message)) {
//     // returning false here prevents Cypress from
//     // failing the test
//     return false;
//   }
// });
