describe('Timeoff Automation', () => {
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
    it('VIEW PROFILE', () => {
        cy.get('.account___1r_Ku')
        .trigger('mousemove')
        .click({ force:true })
        .then(() => {
          cy.contains('View profile').click({force:true});
     cy.wait(2000);
    });
  });
  it('GENERAL INFO', () => {
    cy.get('.EmployeeTitle___2nIc6').trigger('mousemove');
    cy.get('.EmployeeTitle___3ugtk').trigger('mousemove');
    cy.get('.EmployeeTitle___2_R3-').trigger('mousemove');
    cy.get('.EmployeeTitle___3QLPA').trigger('mousemove');
    cy.get('.EmployeeTitle___CECYB').trigger('mousemove');
    cy.get('.viewTitle__text___3qRAk').trigger('mousemove');
     });  

  it('EMPLOYEMENT INFO', () => {
    cy.get('.itemMenu___3QSsd ').eq(0).click();
    cy.get('.employmentTab__action___1CSwz');
    cy.get('.title___11auN');
     });     
  it('BENEFITS', () =>{
    cy.get('.itemMenu___3QSsd ').eq(4).click();
    cy.get('.header___1uHjp');
    cy.contains('Add Dependant').click()
    .then(()=>{
      cy.get('#firstName').type("preetha");
      cy.get('#lastName').type("kumar");
      cy.get('#gender').click().trigger('mousedown')
      .then(()=>{
        cy.contains('Female').click({force:true});
      });
      cy.get('#relationship').click().trigger('mousedown')
      .then(()=>{
        cy.contains('Mother').click({force:true});
      });
      

    });
    // cy.get('.ant-card-head-title').trigger('mousemove');
    // cy.wait(2000);
  })
        
  
  
  
  
  
  });