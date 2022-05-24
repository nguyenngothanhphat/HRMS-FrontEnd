describe('Employee Directory', () => {
  before(() => {
    cy.visit('https://stghrms.paxanimi.ai/login');
  });

  let employee_email = "comp1-hr-manager@mailinator.com";
  let password = "12345678@Tc";

  it('SIGN IN', () => {
      cy.get('#basic_userEmail.ant-input').type(employee_email);
      cy.get('#basic_password.ant-input').type(password);
      cy.get('button[type="submit"]').click();
     
  });
  it('Directory',() =>{
      cy.contains('Directory').click({force:true});
       cy.wait(2000);
                   //MY TEAM
       cy.get('.ant-tabs-tab-btn').eq(3).click({force:true});
                 // INACTIVE EMPLOYEES
      cy.get('.ant-tabs-tab-btn').eq(4).click({force:true});
                  // DOWNLOAD TEMPLATE
      cy.get('.buttonAddImport_text___18Qe1').eq(0).click({force:true});
                 // EXPORT EMPLOYEES
    cy.get('.buttonAddImport_text___18Qe1').eq(1).click({force:true});
                // FILTER
    cy.get('.FilterButton___qz7iA').click({force:true}).wait(3000)
      // cy.get('.ant-select-selection-search-input').eq(0).click({force:true})                                        //employee id
      // cy.get('.ant-select-item-option-content').contains("PSI - 2390").click({fore:true})
     cy.get('.ant-select-selection-overflow').eq(0).click()                                   //selecting department
     cy.get('.ant-select-item-option-content').contains("HR").click()
     cy.get('.ant-select-item-option-content').contains("Accounting").click()
     cy.get('.ant-select-selection-overflow').eq(1).click({force:true})                        // Division name
     cy.get('.ant-select-item-option-content').contains("HR").click()
     cy.get('.ant-select-selection-overflow').eq(2).click({force:true})                        //job title
     cy.get('.ant-select-item-option-content').contains("Pre Sales Executive").click()
    //  cy.get('.ant-select-selection-overflow').eq(3).click({force:true})                      //Reporting manager
    //  cy.get('.ant-select-item-option-content').contains("Check DashBoard").click()
     cy.get('.ant-select-selection-overflow').eq(4).click({force:true})                        //LOCATION
     cy.get('.ant-select-item-option-content').contains("India").click()
     cy.get('.ant-select-selection-overflow').eq(5).click({force:true})                         //employement type
     cy.get('.ant-select-item-option-content').contains("Full Time").click()
     cy.get('.ant-select-selection-overflow').eq(6).click({force:true})                             //skills
     cy.get('.ant-select-item-option-content').contains("ReactJs").click()
 });
});   
