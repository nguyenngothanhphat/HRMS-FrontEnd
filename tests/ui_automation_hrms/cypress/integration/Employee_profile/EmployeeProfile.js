describe('Employee profile', () => {
  before(() => {
    cy.visit('https://stghrms.paxanimi.ai/login');
    cy.login('sandeep@mailinator.com','12345678@Tc')
  });
  it('VIEW PROFILE', () => {
      cy.get('.account___1r_Ku')
      .trigger('mousemove')
      .click({ force:true })
      .then(() => {
        cy.contains('View profile').click({force:true});
        cy.wait(3000);
      });
      cy.get('.EmployeeTitle___2nIc6'); // general info
      cy.wait(2000)
      cy.contains('Edit').click({force:true})                   //employee information 
      cy.wait(3000)
      cy.get('#workNumber').type("7981809816");
      cy.contains('Save').click({force:true});
      cy.wait(2000)
      cy.contains('Okay').click({force:true})
      cy.get('.EmployeeTitle___3ugtk').should('have.text','Personal Information')
      cy.get('.EmployeeTitle___3ugtk');                  // personal information
      cy.get('.Edit___Tufj9').click();
      cy.get('#personal_information_personalNumber').type('2345678901');
      cy.wait(1000)
      cy.get('#personal_information_personalEmail').type('metta@gmail.com');
      cy.wait(1000)
      cy.get('#personal_information_nationality').type('Indian')
      cy.wait(1000)
      cy.get('#personal_information_r_Addressline1').type("3")
      cy.wait(1000)
      cy.get('#personal_information_r_Addressline2').type("104");
      cy.wait(1000)
      cy.get('#personal_information_r_City').type("chittoor");
      cy.wait(1000)
     cy.get('[type="checkbox"]').eq(0).click({force:true})
      cy.contains('Save').click({force:true})
      cy.wait(2000)
      cy.contains('Okay').click({force:true})
         cy.wait(2000)
         cy.get('.EmployeeTitle___CECYB').should('have.text','Emergency Contact Details')
         cy.get('.EmployeeTitle___CECYB');                        //emergency contact details
         cy.get('.Edit___3-jOE').click({force:true});
         cy.get('[aria-label="plus"]').click({force:true})
         .then(()=>{
             cy.get('.ant-input').eq(3).type('amma')
             cy.wait(1000)
             cy.get('.ant-select-selector').eq(1).click({force:true})
             cy.get('.ant-select-item-option-content').eq(1).click({force:true})
             cy.wait(1000)
             cy.get('.ant-input').eq(4).type('2345167098')
             cy.wait(1000)
             cy.contains('Save').click({force:true})
             cy.wait(2000)
             cy.contains('Okay').click({force:true})
             cy.wait(2000)

       })

      cy.get('.viewTitle__text___3qRAk').should('have.text','Professional & Academic Background')
      cy.get('.viewTitle__text___3qRAk');                 // profesional and academic background
      cy.get('.viewTitle__edit__text___1BESf').click({force:true})
      cy.get('#basic_preJobTitle').type('FED')
      cy.wait(1000)
      cy.get('#basic_preCompany').type('abcxyz')
      cy.wait(1000)
      cy.get('#basic_qualification').type('B.Tech')
      cy.wait(2000)
      const image = 'image.PNG';
      cy.get('input[type="file"]').attachFile(image);
      cy.wait(3000)
      cy.get('.css-1s2u09g-control').click({force:true}).type('Cypress'+'{enter}')
      cy.wait(1000)
      cy.contains('Save').click({force:true})
      cy.wait(2000)
      cy.contains('Okay').click({force:true})



   // *****employement info */
      cy.get('.itemMenu___3QSsd ').eq(0).click({force:true});
      // cy.get('.title___11auN').should('have.text','Employment Details')
      cy.get('.title___11auN');   //employement details
      cy.get('.editBtn___2NbVW').eq(0).click({force:true});
      cy.wait(2000)
      cy.get('.ant-select-selection-item').eq(4).click({force:true})
      cy.wait(1000)
      cy.contains('Contingent Worker').eq(0).click({force:true})
      cy.wait(1000)
      cy.contains('Save').click({force:true})
      cy.wait(2000)
      cy.contains('Okay').click({force:true})
      cy.wait(2000)
      cy.get('.title___11auN')
      cy.get('.editBtn___2NbVW').eq(1).click({force:true})
      cy.wait(1000)
      cy.contains('Continue').click({force:true})
      cy.wait(2000)
      cy.get('.ant-select-selection-search').eq(0).click({force:true})
      cy.get('.ant-select-item-option-content').eq(0).click({force:true})
      cy.wait(1000)
      cy.get('.ant-select-selection-search').eq(1).click({force:true})
      cy.wait(1000)
      .then(()=>{
          cy.get('.ant-select-item-option-content').eq(8).click({force:true})
      })
      cy.wait(2000)
      cy.get('.ant-select-selection-search').eq(2).click({force:true})
      cy.wait(1000)
      cy.get('.ant-select-item-option-content').eq(9).click({force:true})
      cy.wait(1000)
      cy.contains('Continue').click({force:true})
      cy.wait(3000)
      cy.contains('Continue').click({force:true})
      cy.wait(3000)
      cy.get('[type="text"]').eq(1).type('3,00,000')
      cy.wait(2000)
      cy.get('.ant-select-selection-search').eq(0).click({force:true})
      cy.wait(2000)
      cy.get('.ant-select-item-option-content').eq(0).click({force:true})
      cy.wait(1000)
      cy.contains('Continue').click({force:true})
      cy.wait(3000)
      cy.get('.checkmark___2o3b6').eq(0).click({force:true})
      cy.wait(2000)
      cy.contains('Continue').click({force:true})
      cy.wait(3000)
      cy.contains('Continue').click({force:true})
      cy.wait(3000)
      cy.get('.ant-input').eq(1).type('to check the staTUS')
      cy.wait(3000)
      cy.contains('Back').click({force:true})
      cy.wait(3000)
      cy.contains('Back').click({force:true})
      cy.wait(3000)
      cy.contains('Back').click({force:true})
      cy.wait(3000)
      cy.contains('Back').click({force:true})
      cy.wait(3000)
      cy.contains('Back').click({force:true})
      cy.wait(3000)
      cy.contains('Back').click({force:true})
      cy.wait(3000)
      cy.get('[type="button"]').eq(0).click({force:true})
      cy.wait(3000)
    cy.contains('Cancel & Return').click({force:true})


    //**********benefits***** */
    cy.get('.textName___2dqbQ').eq(5).click({force:true})
    cy.wait(4000)
    cy.get('.headingText___36nuO') //covered individuals
    cy.wait(2000)
    cy.contains('Add Dependant').click({force:true}).wait(2000)
    .then(()=>{
        cy.get('#firstName').type("preetha");
        cy.get('#lastName').type("kumar");
        cy.get('#gender').click({force:true});
        cy.get('.ant-select-item-option-content').contains("Female").click({force:true});
        cy.wait(800);
        cy.get('#relationship').click({force:true})
        cy.wait(800);
        cy.get('.ant-select-item-option-content').contains("Mother").click({force:true})
        cy.wait(800);
        cy.get('#dob').click({force:true})
        cy.get('.ant-picker-today-btn').contains("Today").click({force:true})
        cy.wait(800);
        cy.get('[type="submit"]').click({force:true})
    });
    cy.get('.ant-card-head-title')
    cy.wait(2000)
    cy.contains('Financial').click({force:true})
    cy.wait(3000)
    cy.contains('Legal').click({force:true})
    cy.wait(3000)
      


  });
});