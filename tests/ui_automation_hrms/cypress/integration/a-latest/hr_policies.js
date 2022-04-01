describe('HR_Polices_and_Regulations', () => {
  before(() => {
    cy.visit('https://stghrms.paxanimi.ai/login');
  });

  let employee_email = "narmada.biradar@mailinator.com";
  let password = "12345678@Tc";

  it('sign in', () => {
      cy.get('#basic_userEmail.ant-input').type(employee_email);
      cy.get('#basic_password.ant-input').type(password);
      cy.get('button[type="submit"]').click();
      cy.wait(5000);
      cy.get('.action___3ut1O').eq(0).click();
      
      cy.contains('Policies & Regulations').click();
      cy.contains('Settings').click();
      cy.wait(3000);
      cy.contains('India').click();
      cy.contains('Add Categories').click()
      cy.get('#basic_category').type("Company Asset");
      cy.get('button[type="submit"]').click();
      cy.get('.ant-menu-title-content').eq(11).click();
      cy.get('.ant-select-selector').click();
  
      
      cy.contains('Add Policy').click()
      .then(()=>{
        cy.get("#basic_categoryPolicy").type('Company Asset'+'{enter}')
        .then(()=>{
          
          cy.wait(1000);
          cy.get('#basic_namePolicies').type('Company Assets');

          const filepath ="hulk.jpg";
          cy.get('input[type="file"]').attachFile(filepath)
          cy.wait(5000)
          cy.get('button[type="submit"]').click()
          cy.wait(4000)
          cy.get('.ant-table-row.ant-table-row-level-0').eq(0).click()
          .then(()=>{
            cy.get('.ant-dropdown-trigger').eq(3).click({force:true});
            cy.contains('Delete').click();
            cy.get('button[type="submit"]').click();
            cy.contains('Policies Categories').click();
             cy.get('.ant-btn-circle').eq(1).click();
             cy.get('button[type="submit"]').click();
            
          });
          
        });
        
      });
    });
});
