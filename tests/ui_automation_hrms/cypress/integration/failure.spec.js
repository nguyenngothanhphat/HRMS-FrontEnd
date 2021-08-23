//<reference types="cypress" />

let employee_email = Cypress.env("employee_email");
let manager_email = Cypress.env("manager_email");
let password = Cypress.env("password");

describe('Simple examples of cypress code', () => {

    let employee_email = "comp1-employee-hre@mailinator.com";
    let manager_email = "comp1-hr-manager@mailinator.com";
    let password = '12345678@Tc';

    before(() => {      // this code ensures that it visits the following URL before running each test
        cy.visit('https://stghrms.paxanimi.ai/login');
    });


    it ('Login as an employee', ()=> {
        cy.pause();

		cy.loginAsSomeone(employee_email, password);

        cy.contains("Book Flight Tickets", {timeout:5000}); // fails and stops running everything else because this content does not exist on the page

		cy.logout();
    });

    it ("Login as manager", ()=>{
        cy.pause();
		cy.loginAsSomeone(manager_email, password);    
	});
});