describe('Project management Automation', () => {
  before(() => {
cy.visit('https://stghrms.paxanimi.ai/login');
  });

  let employee_email = "khang.le@mailinator.com";
  let password = "12345678@Tc";
  

  it('sign in and creating a project', () => {
      cy.get('#basic_userEmail.ant-input').type(employee_email);
      cy.get('#basic_password.ant-input').type(password);
      cy.get('button[type="submit"]').click();
      cy.wait(5000);
      cy.contains("Project Management").click({force:true})
      cy.wait(1000);
      cy.contains("Add new Project").click({force:true})
      cy.get('#basic_customerId').click();
      cy.wait(3000)
      cy.get('#basic_customerId').type('Preetha' + '{enter}', {force: true})
    //   .then(()=>{
    //     cy.contains('Preetha').click({force:true});
    // })
      cy.get('#basic_engagementType').type('JV' + '{enter}', {force: true})
      // click().trigger('mousedown')
      // .then(()=>{
      //     cy.contains('JV').click({force:true});
      // })
       cy.get('#basic_projectStatus').type("Active"+'{enter}',{force:true});
      // cy.get('.ant-select-item-option-content').eq(6).click({force:true})
      
      cy.get('#basic_projectName').type('HRMS1');
      cy.get('#basic_projectAlias').type('H1');
      let fromDate='01-27-2022';
      let toDate='02-04-2023';
      cy.get('#basic_startDate',{timeout:3000}).type(fromDate + '{enter}', {force: true});
      cy.get('#basic_tentativeEndDate',{timeout:3000}).type(toDate + '{enter}', {force: true});
      cy.get('#basic_projectManager').click();
      cy.wait(5000)
      cy.contains('Kuntappa').click({force:true});
     // cy.get('.ant-select-item-option-content').eq(12).click({force:true});
      cy.get('#basic_estimation').type('13');
      cy.get('#basic_billableHeadCount').type('12');
      cy.get('#basic_bufferHeadCount').type('6')
      cy.get('#basic_projectDescription').type('Project')
       cy.get('#basic_engineeringOwner',{timeout:3000}).type('Kuntappa'+'{enter}', {force: true});
      // cy.wait(2000)
      // cy.get('.ant-select-item-option-content').type(22).click({force:true});
      cy.get('#basic_division',{timeout:3000}).type('Software Services'+'{enter}', {force: true})
      // cy.wait(2000)
      // cy.get('.ant-select-item-option-content').eq(30).click({force:true});
      // cy.get('.ant-select-selection-overflow').click();
      // cy.get('.ant-select-item-option-content').eq(40).click({force:true});
      // cy.get('.ant-select-selection-overflow').click();
     // cy.get('.ant-select-open').click({force:true});
      cy.get('.ant-select-selection-overflow-item.ant-select-selection-overflow-item-suffix').type("Design"+'{enter}'+"Frontend"+'{enter}',{forcr:true});
      cy.contains('Submit').click()
         cy.get('.ant-btn.ant-btn-link.ant-btn-circle').eq(0).click();
         cy.get('button[type="submit"]').click();
  });
});
