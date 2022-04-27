/* eslint-disable no-undef */
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
import moment from 'moment';

Cypress.moment = moment;
// // code that terminates all subsequent tests if one fails
//afterEach(function () {
//  if (this.currentTest.state === 'failed') {
//    Cypress.runner.stop();
//  }
// });
Cypress.Commands.add('login', (email, password) => { 
    cy.get('#basic_userEmail.ant-input').type(email);
    cy.get('#basic_password.ant-input').type(password);
    cy.get('button[type="submit"]').click();
    cy.wait(2000);
 })
  

 Cypress.Commands.add('add', (name, business, phone, email, address1, address2, city, pincode) => { 
    cy.get('#formAdd_legalName').type(name);
    cy.get('#formAdd_dba').type(business);
    cy.get('#formAdd_phone').type(phone);
    cy.get('#formAdd_email').type(email);
    cy.get('#formAdd_addressLine1').type(address1);
    cy.get('#formAdd_addressLine2').type(address2);
    cy.get('#formAdd_country').click()
    cy.get('.ant-select-item-option-content').contains("Afghanistan").click({force:true})
    cy.get('#formAdd_state').click().wait(8000).type('Badgis').wait(3000).get('[title="Badgis"]').click({force:true});
    cy.get('#formAdd_city').type(city);
    cy.get('#formAdd_zipCode').type(pincode);
    cy.contains('Add Customer').click({force:true});
});
Cypress.Commands.add('add1', (name) => { 
    cy.get('.ant-input').eq(1).type(name)  //serach an employee
    cy.wait(2000)
    cy.get('.blueText___3PLN6').eq(0).click({force:true})
    
 })
 Cypress.Commands.add('add_customer',(name) => {
    cy.get('#filter_byStatus').click({force:true})   //by status
    cy.get('.ant-select-item-option-content').eq(1).click({force:true}).wait(2000)
    cy.scrollTo('bottom')
    cy.get('[type=submit]').click({force:true})
    cy.wait(1000)
    cy.get('.anticon.anticon-close-circle').click({force:true}).wait(2000)
    cy.get('#filter_byCompany').click({force:true}).wait(500).type(name).click({force:true})   //by company
     // cy.get('.ant-select-item-option-content').contains('Yen Yen').click({force:true}).wait(300)
    cy.scrollTo('bottom').wait(2000)
    cy.get('[type=submit]').click({force:true}).wait(2000)
    // cy.get('.anticon.anticon-close').click({force:true}).wait(2000)
    cy.get('#filter_byOpenLeads.ant-select-selection-search-input').click({force:true}).wait(2000) //by open leads
    cy.contains('Yes').click({force:true}).wait(2000);
    cy.scrollTo('bottom').wait(2000)
    cy.get('[type=submit]').click({force:true}).wait(2000)
    cy.get('.anticon.anticon-close-circle').click({force:true}).wait(2000);
    cy.get('#filter_byPendingTickets.ant-select-selection-search-input').click({force:true}).wait(2000) //by pending tickets
    cy.get('.ant-select-item-option-content').eq(11).click({force:true}).wait(2000)
    cy.scrollTo('bottom').wait(2000)
    cy.get('[type=submit]').click({force:true}).wait(2000)
    cy.get('.anticon.anticon-close-circle').click({force:true}).wait(2000);
    cy.get('#filter_byPendingTasks').click({force:true}).wait(2000)
    cy.get('.ant-select-item-option-content').eq(12).contains('Yes').click({force:true}).wait(2000)
    cy.scrollTo('bottom')
    cy.get('[type=submit]').click({force:true}).wait(2000)
    cy.get('.anticon.anticon-close-circle').click({force:true}).wait(2000);
    cy.get('#filter_byActiveProjects').click({force:true}).wait(2000)
    cy.get('.ant-select-item-option-content').eq(14).contains('Yes').click({force:true})
    cy.scrollTo('bottom').wait(2000)
    cy.get('[type=submit]').click({force:true}).wait(2000)
    cy.get('.anticon.anticon-close-circle').click({force:true}).wait(2000);
    cy.get('.closeIcon___3RP18').click({force:true})
 
    
 })
