describe('OrganizationChat Automation', () => {
    before(() => {
      cy.visit('https://stghrms.paxanimi.ai/login');
    });
    let employee_email = "narmada.biradar@mailinator.com";
    let password = '12345678@Tc';
  
    it('Sign-In', () => {
        cy.get('#basic_userEmail.ant-input').type(employee_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();
  
    });
    it('Click the Directory',() =>{
        cy.contains("Directory").click({force:true});
        cy.contains('Organization Chart').click({force:true});
        cy.get('[role=combobox]').click().type('preetha').wait(2000)//search for an employee
        cy.get('.ant-select-item-option-content').click()
    });
    });
  