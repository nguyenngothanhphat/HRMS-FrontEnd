describe('CustomerManagement', () => {
    before(() => {
      cy.visit('https://stghrms.paxanimi.ai/login');
    });

    let employee_email = "narmada.biradar@mailinator.com";
    let password = "12345678@Tc";

    it('SIGN IN', () => {
        cy.get('#basic_userEmail.ant-input').type(employee_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();

    });
    it('Directory',() =>{
        cy.contains('Customer Management').click({force:true});
         cy.wait(2000);
         cy.get('.buttonAddImport___hM6N6').click();  //add customer
         cy.wait(8000);
         cy.get('#formAdd_legalName').type("Preetha");
         cy.get('#formAdd_dba').type("terralogic");
         cy.get('#formAdd_phone').type("9502985592");
         cy.get('#formAdd_email').type("preetha@terralogic.com");
         cy.get('#formAdd_addressLine1').type("3-104");
         cy.get('#formAdd_addressLine2').type("chittoor,AP");
         cy.get('#formAdd_country').click()
         cy.get('.ant-select-item-option-content').contains("Afghanistan").click()
         cy.get('#formAdd_state').click({force:true})
         cy.get('.ant-select-item-option-content').contains("Badakhshan").click()
         cy.get('#formAdd_city').type("chiii");
         cy.get('#formAdd_zipCode').type("51712");
         cy.contains('Add Customer').click();
         cy.get('.textButtonFilter___1RHF5').click({force:true});         //filter
         cy.get('#filter_byStatus').click()
         cy.get('.ant-select-item-option-content').contains("Engaging").click({force:true})
        //  cy.get('#filter_byOpenLeads').click();
        //  cy.get('.ant-select-item-option-content').contains("Yes").click()
         cy.get('#filter_byPendingTickets').click();
         cy.get('.ant-select-item-option-content').contains("Yes").click({force:true})
         cy.get('#filter_byActiveProjects').click()
         cy.get('.ant-select-item-option-content').contains("No").click({force:true})
         cy.contains('Apply').click({force:true})
         cy.contains('Close').click({force:true})
         cy.get('.ant-input').eq(1).type("Test")  //serach an employee
         cy.wait(2000)
         cy.get('.blueText___3PLN6').eq(0).click({force:true})
    })
});
