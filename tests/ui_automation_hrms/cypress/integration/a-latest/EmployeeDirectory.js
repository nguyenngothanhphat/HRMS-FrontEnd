describe('Employee Directory', () => {
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
      cy.contains('Directory').click({force:true});
       cy.wait(2000)
       cy.get('.directoryTable_fullName___1DK8N').click({force:true})
       cy.get('.ant-tooltip-inner').click({force:true}).click({force:true})
       cy.wait(1000)
       cy.get('.ant-table-column-title').eq(1).click({force:true}).click({force:true})
       cy.wait(1000)
       cy.get('.ant-table-column-title').eq(2).click({force:true}).click({force:true})
       cy.wait(1000)
       cy.get('.ant-table-column-title').eq(3).click({force:true}).click({force:true})
       cy.wait(1000)
       cy.get('.ant-table-column-title').eq(4).click({force:true}).click({force:true})
       cy.wait(1000)
       cy.get('.ant-table-column-title').eq(5).click({force:true}).click({force:true})
       cy.wait(1000)
       cy.get('.ant-table-body').scrollTo('right', { duration: 2000 })
       cy.get('.ant-table-column-title').eq(6).click({force:true}).click({force:true})
       cy.wait(1000)
       cy.get('.ant-table-column-title').eq(7).click({force:true}).click({force:true})
       cy.wait(1000)
       cy.get('.ant-table-column-title').eq(8).click({force:true}).click({force:true})
       cy.wait(1000)
       cy.get('.ant-table-column-title').eq(9).click({force:true}).click({force:true})
       cy.wait(1000)
       cy.get('.ant-table-column-title').eq(10).click({force:true}).click({force:true})
       cy.wait(1000)
      

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
     cy.get('.ant-select-selection-overflow').eq(0).click({force:true})                                   //selecting department
     cy.get('.ant-select-item-option-content').contains("HR").click({fore:true})
     cy.wait(2000)
     cy.get('.ant-select-selection-item-remove').click({force:true})
     cy.wait(2000)
     cy.get('.ant-select-item-option-content').contains("Accounting").click({fore:true})
     cy.wait(2000)

     cy.get('.ant-select-selection-item-remove').click({fore:true})
     cy.get('.ant-select-selection-overflow').eq(1).click({force:true})                        // Division name
     cy.get('.ant-select-item-option-content').contains("HR").click({force:true})
     cy.wait(2000)
     cy.get('.ant-select-selection-item-remove').click({force:true})
     cy.get('.ant-select-selection-overflow').eq(2).click({force:true})                        //job title
     cy.get('.ant-select-item-option-content').contains("HR Manager").click({force:true})
     cy.wait(2000)
     cy.get('.ant-select-selection-item-remove').click({force:true})
    
     cy.get('.ant-select-selection-overflow').eq(3).click({force:true})                      //location
     cy.get('.ant-select-item-option-content').contains("Bangalore-1").click()
     cy.wait(2000)
     cy.get('.ant-select-selection-item-remove').click({force:true})
    

     cy.get('.ant-select-selection-overflow').eq(5).click({force:true})                         //employement type
     cy.get('.ant-select-item-option-content').contains("Full Time").click()
     cy.wait(2000)
     cy.get('.ant-select-selection-item-remove').click({force:true})
    
     cy.get('.ant-select-selection-overflow').eq(6).click({force:true})                             //skills
     cy.get('.ant-select-item-option-content').contains("redux").click()
     cy.wait(2000)
     cy.get('.ant-select-selection-item-remove').click({fore:true})
 });
});   