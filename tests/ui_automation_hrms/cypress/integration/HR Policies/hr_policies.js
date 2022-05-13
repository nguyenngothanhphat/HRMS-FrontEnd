import { eq } from "lodash";

describe('HR_Polices_and_Regulations', () => {
  before(() => {
    cy.visit('https://stghrms.paxanimi.ai/login');
  });

  let employee_email = "narmada.biradar@mailinator.com";
  let password = "12345678@Tc";

  it('creating the categories and policies', () => {
      cy.loginAsSomeone(employee_email,password);
      cy.get('.action___3ut1O').eq(0).click();
      
      cy.contains('Policies & Regulations').click();
      cy.contains('Settings').click();
      cy.wait(3000);
      cy.get('.labelText___2RPRm').eq(0).click({force:true})
      cy.contains('India').click();
      cy.wait(3000)
      cy.contains('Add Categories').click()
      cy.get('#basic_category').type("Company Asset");
      cy.get('button[type="submit"]').click();
      cy.wait(5000)
      cy.get('.ant-menu-title-content').eq(11).click();
      cy.get('.ant-select-selector').click();
  
      
      cy.contains('Add Policy').click()
      .then(()=>{
          cy.get("#basic_categoryPolicy").type('Company Asset'+'{enter}')
      
        cy.get('#basic_namePolicies').type('Company Assets');

        const filepath ="hulk.jpg";
        cy.get('input[type="file"]').attachFile(filepath)
        cy.wait(5000)
        cy.get('button[type="submit"]').click()
        cy.wait(4000)
        cy.get('.ant-menu-title-content').eq(10).click({force:true})
        cy.contains('Policies & Regulations').eq(0).click({force:true})
        cy.wait(4000);
        cy.contains('Settings').click({force:true});
        cy.contains('Policies & Regulations').eq(0).click({force:true})
        cy.wait(2000);
        cy.get('img[src="/static/view.6aff4212.svg"]').click({force:true})
        cy.wait(3000);
        cy.get('img[src="/static/closeIconTimeOff.a323d33a.svg"]').click({force:true})
        cy.wait(3000);
        cy.contains('Settings').click({force:true})
        cy.wait(2000)
        cy.get('.ant-btn-circle').eq(1).click();
        cy.get('button[type="submit"]').click();
      })
  })  
});
