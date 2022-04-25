describe('Organization chart', () => {
    before(() => {
      cy.visit('https://stghrms.paxanimi.ai/login');
    });
    let employee_email = 'sandeep@mailinator.com';
    let password = '12345678@Tc';
  
    it('Sign-In', () => {
      cy.get('#basic_userEmail.ant-input').type(employee_email);
      cy.get('#basic_password.ant-input').type(password);
      cy.get('button[type="submit"]').click();
      cy.wait(2000);
      cy.contains('Directory').click({ force: true });
      cy.contains('Organization Chart').click({ force: true });
      cy.get('.chartSearch___2cNFt');
      cy.get('[role=combobox]').click().type('preetha').wait(2000); //search for an employee
      cy.get('.ant-select-item-option-content').click();
      cy.get('[role=combobox]').click().type('2566').wait(2000); //search for an employee
      cy.get('.ant-select-item-option-content').click();
      cy.wait(2000);
      cy.contains('Swarnalath').trigger('mouseover').wait(2000)
     .click();
      cy.get('#6217161059435600822f4bdf')
      cy.get('.node__card___2ZqBn').find("img").eq(1).should('be.visible').trigger('mouseover').wait(2000).click();
      cy.wait(2000)
      cy.get('.node__bottom_reporteesExpand___F4nH2').click({force:true});
      cy.wait(2000);
      cy.get('.node__bottom_reporteesCollapse___1uxC8').click({force:true});
      cy.wait(1000);
      cy.get('#6217161059435600822f4bdf').click({force:true});
      cy.get('.chartDetail___3hI91');
      cy.get('.chartDetail__Bottom_ViewProfile___14XGU').click({force:true});
    });
  });
  