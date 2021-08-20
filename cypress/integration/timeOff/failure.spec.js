///<reference types="cypress" />


describe('Simple examples of cypress code', () => {

    let employee_email = "comp1-employee-hre@mailinator.com";
    let manager_email = "comp1-hr-manager@mailinator.com";
    let password = '12345678@Tc';

    before(() => {      // this code ensures that it visits the following URL before running each test
        cy.visit('https://stghrms.paxanimi.ai/login');
    });


    it ('Login as an employee', ()=> {
        cy.pause();

        cy.get('#basic_email.ant-input').type(employee_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();

        // cy.pause();

        cy.wait(2000); // wait for the page to load

        cy.contains("Book Flight Tickets"); // fails and stops running everything else because this content does not exist on the page

        cy.get(".ant-dropdown-trigger").then((resp)=>{
            cy.get(resp[1]).trigger('mousedown').click();
            cy.contains("Logout").click();
        });

    });

    it ("Login as manager", ()=>{
        cy.pause();
        cy.get('#basic_email.ant-input').type(manager_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();
    });
});


