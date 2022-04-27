

describe('Employee Directory', () => {
  before(() => {
    cy.visit('https://stghrms.paxanimi.ai/login');
  });

  let employee_email = "sandeep@mailinator.com";
  let password = "12345678@Tc";

  it('SIGN IN', () => {
      cy.get('#basic_userEmail.ant-input').type(employee_email);
      cy.get('#basic_password.ant-input').type(password);
      cy.get('button[type="submit"]').click();
      
     
  });
  it('Directory',() =>{
      cy.contains('Directory').click({force:true});
       cy.wait(2000)
       cy.get('.directoryTable_fullName___GxWOu').click({force:true})
       cy.get('.ant-tooltip-inner').click({force:true}).click({force:true})
       cy.wait(1000)
       cy.get('.ant-table-column-title').eq(1).click({force:true}).wait(2000).click({force:true})
       cy.wait(1000)
       cy.get('.ant-table-column-title').eq(2).click({force:true}).wait(2000).click({force:true})
       cy.wait(1000)
       cy.get('.ant-table-column-title').eq(3).click({force:true}).wait(2000).click({force:true})
       cy.wait(1000)
       cy.get('.ant-table-column-title').eq(4).click({force:true}).wait(2000).click({force:true})
       cy.wait(1000)
       cy.get('.ant-table-column-title').eq(5).click({force:true}).wait(2000).click({force:true})
       cy.wait(1000)
       cy.get('.ant-table-body').scrollTo('right', { duration: 2000 })
       cy.get('.ant-table-column-title').eq(6).click({force:true}).wait(2000).click({force:true})
       cy.wait(1000)
       cy.get('.ant-table-column-title').eq(7).click({force:true}).wait(2000).click({force:true})
       cy.wait(1000)
       cy.get('.ant-table-column-title').eq(8).click({force:true}).wait(2000).click({force:true})
       cy.wait(1000)
       cy.get('.ant-table-column-title').eq(9).click({force:true}).wait(2000).click({force:true})
       cy.wait(1000)
       cy.get('.ant-table-body').scrollTo('left', { duration: 2000 })
       cy.wait(2000)
       cy.get('.directoryTableName___1HnC6').eq(0).click();  //Active employee full name
       cy.wait(2500)
       cy.get('.ant-breadcrumb-link').eq(1).click();    //navigating from employee profile to directory
       cy.wait(2000)
       cy.get('.ant-table-body').scrollTo('right', { duration: 2000 })
       cy.wait(3500)
       cy.contains('Dallas').trigger('mouseover').wait(2000);
       cy.get('.managerName___17Tqb').eq(0).trigger('mouseover').wait(2000);
       cy.get('.managerName___17Tqb').eq(0).click();    //Repoting manager
       cy.wait(2000)
       cy.get('.ant-breadcrumb-link').eq(1).click();    ////navigating from employee profile to directory
       cy.wait(2000)
       cy.get('.ant-pagination-item-link').eq(0).click({force:true})
       cy.wait(1000);
       cy.get('.ant-pagination-item-link').eq(2).click({force:true})
       cy.wait(1000)
       cy.get('.ant-select-selection-item').click({force:true});
       cy.wait(1000)
       cy.get('.ant-select-item-option-content').eq(2).click({force:true})
       cy.wait(2000)
       cy.get('.ant-select-selection-item').click({force:true});
       cy.wait(1000)
       cy.get('.ant-select-item-option-content').eq(0).click({force:true});
       cy.wait(2000)
       cy.get('.ant-pagination-item-link').eq(0).click({force:true})
       cy.wait(1000);
     
      

      
      

                 //  MY TEAM
      //  cy.get('.ant-tabs-tab-btn').eq(3).click({force:true});
      //            // INACTIVE EMPLOYEES
      // cy.get('.ant-tabs-tab-btn').eq(4).click({force:true});
      //           //  DOWNLOAD TEMPLATE
      // cy.get('.buttonAddImport_text___18Qe1').eq(0).click({force:true});
      //            // EXPORT EMPLOYEES
      // cy.get('.buttonAddImport_text___18Qe1').eq(1).click({force:true});
      //           // FILTER
      cy.get('.FilterButton___qz7iA').click({force:true}).wait(3000)
      cy.get('#filter_employeeId').type('PSI - 2390').click({force:true})                                        //employee id
      cy.get('.ant-select-item-option-content').eq(0).click({force:true})
      cy.wait(2000)
      cy.get('.ant-input-clear-icon').eq(0).click({force:true})
      cy.wait(2000)
      cy.get('#filter_name').type('preetha',{force:true}).click({force:true})
      cy.get('.ant-select-item-option-content').eq(0).click({force:true})
      cy.wait(2000)
      cy.get('.ant-input-clear-icon').eq(1).click({force:true})
      cy.wait(2000)
     cy.get('.ant-select-selection-overflow').eq(0).click({force:true})                                   //selecting department
     cy.get('.ant-select-item-option-content').contains("HR").click({force:true})
     cy.wait(5000)
     cy.get('.ant-select-selection-item-remove').click({force:true})
     cy.wait(2000)
     cy.get('.ant-select-item-option-content').contains("Accounting").click({force:true})
     cy.wait(5000)

     cy.get('.ant-select-selection-item-remove').click({force:true})
     cy.get('.ant-select-selection-overflow').eq(1).click({force:true})                        // Division name
     cy.get('.ant-select-item-option-content').contains("HR").click({force:true})
     cy.wait(5000)
     cy.get('.ant-select-selection-item-remove').click({force:true})
     cy.get('.ant-select-selection-overflow').eq(2).click({force:true})                        //job title
     cy.get('.ant-select-item-option-content').contains("HR Manager").click({force:true})
     cy.wait(5000)
     cy.get('.ant-select-selection-item-remove').click({force:true})

     cy.get('#filter_reportingManager').click({force:true}).type('Mark Gigliotti',{force:true}).click({force:true})  //by reporting manager
     cy.wait(2000)
     cy.get('.ant-select-item-option-content').eq(0).click({force:true})
    
     cy.get('.ant-input-clear-icon').eq(2).click({force:true})


    
     cy.get('.ant-select-selection-overflow').eq(3).click({force:true})                      //location
     cy.get('.ant-select-item-option-content').contains("Bangalore-1").click({force:true})
     cy.wait(5000)
     cy.get('.ant-select-selection-item-remove').click({multiple:true})

     cy.get('#filter_countries').click({force:true}).wait(2000)     //countries
     cy.get('.ant-select-item-option-content').contains('India').click({force:true})
     cy.get('.ant-select-selection-item-remove').click({force:true})
    

     cy.get('.ant-select-selection-overflow').eq(5).click({force:true})                         //employement type
     cy.get('.ant-select-item-option-content').contains('Full Time').click({force:true})
     cy.wait(5000)
     cy.get('.ant-select-selection-item-remove').click({force:true})
    
     cy.get('.ant-select-selection-overflow').eq(6).click({force:true})                             //skills
     cy.get('.ant-select-item-option-content').contains("redux").click({force:true})
     cy.wait(5000)
     cy.get('.ant-select-selection-item-remove').click({force:true})

     cy.get('#filter_fromExp').type('3',{force:true}).click({force:true})   //experience from
     cy.wait(2000)
     cy.get('.ant-input-number-handler-wrap')
     cy.get('[aria-label="Decrease Value"]').eq(0).click({force:true})
     cy.wait(2000)
     cy.get('[aria-label="Decrease Value"]').eq(0).click({force:true})
     cy.wait(2000)
     cy.get('[aria-label="Decrease Value"]').eq(0).click({force:true})
     cy.wait(2000)
     
     
     cy.get('#filter_toExp').type('1',{force:true}).click({force:true})
     cy.wait(2000)
     cy.get('[aria-label="up"]').eq(1).click({force:true})
     cy.wait(2000)
     cy.get('[aria-label="Decrease Value"]').eq(1).click({force:true})
     cy.wait(2000)
     cy.get('[aria-label="Decrease Value"]').eq(1).click({force:true})
     cy.wait(2000)

     cy.get('[alt=close]').click({force:true});
 });
});   
