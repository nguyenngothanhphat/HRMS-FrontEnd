
describe('polices', () => {
    before(() => {
      cy.visit('https://stghrms.paxanimi.ai/login');
    });
  
    let employee_email = "comp1-hr-manager@mailinator.com";
    let password = "12345678@Tc";
  
    it('sign in', () => {
        cy.get('#basic_userEmail.ant-input').type(employee_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();
        cy.wait(2000);
        cy.get('.action___3ut1O').eq(0).click();
        
        cy.contains('Policies & Regulations').click()
    
        cy.contains('Settings').click();
        cy.get('.ant-menu-vertical').click();
        cy.contains('Add Policy').click()
        .then(()=>{
          cy.get("#basic_categoryPolicy").trigger('mousedown')
          .then(()=>{
              cy.contains('Company Asset').click();
            cy.wait(1000);
            cy.get('#basic_namePolicies').type('Company Asset')           
             cy.wait(3000)
            // const filepath ="Allu_Arjun.jpg";
            // cy.get('input[type="file"]').attachFile(filepath)
            // cy.wait(1000)
            cy.get('button[type="submit"]').click({force:true});
            cy.wait(2000)
            cy.get('.ant-table-row.ant-table-row-level-0').eq(7).click()
            .then(()=>{
              cy.get('.ant-dropdown-trigger').eq(10).click();
              cy.contains('Delete').click();
              cy.get('button[type="submit"]').click();
              
            })
            cy.wait(3000);
          })
        });
      });
});