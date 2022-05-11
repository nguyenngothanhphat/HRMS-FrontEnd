describe('Employee profile', () => {
  before(() => {
    cy.visit('https://stghrms.paxanimi.ai/login');
  });

  let employee_email = 'sandeep@mailinator.com';
  let password = '12345678@Tc';

  it('SIGN IN', () => {
    cy.get('#basic_userEmail').type(employee_email);
    cy.get('#basic_password').type(password);
    cy.get('button[type="submit"]').click();
  });
  it('VIEW PROFILE', () => {
    cy.get('.account___1r_Ku')
      .trigger('mousemove')
      .click({ force: true })
      .then(() => {
        cy.contains('View profile').click({ force: true });
        cy.wait(10000);
        cy.get('.EmployeeTitle___2nIc6'); // general info
        cy.wait(2000);
        cy.contains('Edit').click({ force: true }); //employee information
        cy.wait(3000);
        cy.get('#workNumber').type('7981809916');
        cy.get('.cancelFooter___3aUz_').click({ force: true });
        cy.get('.EmployeeTitle___3ugtk'); // personal information
        cy.get('.Edit___Tufj9').click();
        cy.get('#personal_information_r_Addressline1').type('3');
        cy.get('#personal_information_r_Addressline2').type('104');
        cy.get('#personal_information_r_City').type('chittoor');
        cy.get('.ant-select-selection-item').eq(2).click();
        cy.get('.ant-select-item-option-content')
          .contains('Afghanistan')
          .click({ force: true });
        cy.get('.ant-select-selection-item').eq(3).click();
        cy.contains('Cancel').click();
        cy.wait(2000);
        // cy.get('.EmployeeTitle___2_R3-');                    //passport details
        // cy.get('.Edit___35ztf').click()
        // cy.get('.cancelFooter___1AXFl').click({force:true});
        // cy.get('.urlData___2VQwX').click({force:true})
        // cy.get('[alt=download]').click({force:true})
        // cy.wait(1000)
        // cy.get('[alt=close]').click({force:true})
        // cy.wait(1000)
        // cy.get('.EmployeeTitle___3QLPA');                           //visa details
        // cy.get('.Edit___2i1bn').click({force:true});
        // cy.get('.cancelFooter___2xTNX').click({force:true})
        // cy.get('.urlData___3lRdd').click({force:true})
        // cy.get('[alt=download]').click({force:true})
        // cy.wait(500)
        // cy.get('[alt=close]').click({force:true})
        cy.get('.EmployeeTitle___CECYB'); //emergency contact details
        cy.get('.Edit___3-jOE').click({ force: true });

        cy.get('.cancelFooter___3BIhi').click({ force: true });
        cy.get('.viewTitle__text___3qRAk'); // profesional and academic background
        cy.get('.viewTitle__edit__text___1BESf').click({ force: true });
        cy.get('.viewFooter__cancel___3w9i6').click({ force: true });
        cy.wait(2000);
        cy.get('.itemMenu___3QSsd ').eq(0).click({ force: true });
        cy.get('.title___11auN'); //employement details
        cy.get('.editBtn___2NbVW').eq(1).click({ force: true });
        cy.get('.cancelButton___28bjc').click({ force: true });
        cy.wait(2000);
        cy.get('.itemMenu___3QSsd ').eq(4).click({ force: true }); //Benefits
        cy.get('.header___1uHjp');
        cy.contains('Add Dependant')
          .click({ force: true })
          .wait(20000)
          .then(() => {
            cy.get('#firstName').type('preetha');
            cy.get('#lastName').type('kumar');
            cy.get('#gender').click({ force: true });
            cy.get('.ant-select-item-option-content')
              .contains('Female')
              .click({ force: true });
            cy.wait(800);
            cy.get('#relationship').click({ force: true });
            cy.wait(800);
            cy.get('.ant-select-item-option-content')
              .contains('Mother')
              .click({ force: true });
            cy.wait(800);
            cy.get('#dob').click({ force: true });
            cy.get('.ant-picker-today-btn')
              .contains('Today')
              .click({ force: true });
            cy.wait(800);
            cy.contains('Cancel').click({ force: true });
          });
      });
  });
});
