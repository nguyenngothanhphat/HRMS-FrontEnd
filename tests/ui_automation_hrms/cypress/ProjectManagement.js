describe('Project management Automation', () => {
    before(() => {
cy.visit('https://stghrms.paxanimi.ai/login');
    });
  
    let employee_email = "khang.le@mailinator.com";
    let password = "12345678@Tc";
    
  
    it('sign in', () => {
        cy.get('#basic_userEmail.ant-input').type(employee_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();
  
        cy.wait(5000);
        cy.contains("Project Management").click({force:true})
        cy.wait(1000);
        cy.contains("Add new Project").click({force:true})
        cy.get('#basic_customerId').click();
        cy.wait(3000)
        cy.get('.ant-select-item-option-content').eq(2).click({force:true});
        cy.get('#basic_engagementType').click().trigger('mousedown')
        .then(()=>{
            cy.contains('JV').click({force:true});
        })
         cy.get('#basic_projectStatus').click();
         cy.get('.ant-select-item-option-content').eq(16).click({force:true})
        
        cy.get('#basic_projectName').type('HRMS1');
        cy.get('#basic_projectAlias').type('H1');
        let fromDate='01-27-2022';
        let toDate='02-04-2023';
        cy.get('#basic_startDate',{timeout:3000}).type(fromDate + '{enter}', {force: true});
        cy.get('#basic_tentativeEndDate',{timeout:3000}).type(toDate + '{enter}', {force: true});
        cy.get('#basic_projectManager').click()
        cy.wait(7000)
        cy.get('.ant-select-item-option-content').eq(13).click({force:true});
        cy.get('#basic_estimation').type('13');
        cy.get('#basic_billableHeadCount').type('12');
        cy.get('#basic_bufferHeadCount').type('6')
        cy.get('#basic_projectDescription').type('Project')
        cy.get('#basic_engineeringOwner').click()
        cy.wait(2000)
        cy.get('.ant-select-item-option-content').eq(22).click({force:true});
        cy.get('#basic_division').click()
        cy.wait(2000)
        cy.get('.ant-select-item-option-content').eq(32).click({force:true});
        cy.get('.ant-select-selection-overflow').click();
        cy.get('.ant-select-item-option-content').eq(44).click({force:true});
        cy.get('.ant-select-selection-overflow').click();
        cy.get('.ant-select-item-option-content').eq(55).click({force:true});
        cy.get('.ant-select-item-option-content').eq(56).click({force:true});
        //cy.contains('Submit').click()

        

    })


})