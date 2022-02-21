const { eq } = require("lodash");

describe('Ticket Management', () => {
    before(() => {
      cy.visit('https://stghrms.paxanimi.ai/login');
    });

    let employee_email = "comp1-hr-manager@mailinator.com";
    let password = '12345678@Tc';

    it('Log In and My Calender', () => {
        //cy.pause();

        cy.get('#basic_userEmail.ant-input').type(employee_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();
        cy.wait(1000);
        cy.contains('Ticket Management').click({force:true});
        cy.wait(3000);
        cy.contains('Assigned (5)').click();
        cy.wait(3000);
        cy.contains('In Progress (2)').click();
        cy.wait(2000);
        cy.contains('Client Pending (1)').click();
        cy.wait(2000);
        cy.contains('Resolved (1)').click();
        cy.wait(2000);
        cy.contains('Closed (1)').click();
        cy.wait(2000);

        cy.get('.filterIcon___3zXzI').click();
        cy.wait(2000);
        cy.get('.ant-col.ant-form-item-control').eq(0).click();
        cy.wait(3000);
        cy.get('.ant-checkbox-input').click()
        cy.wait(2000);
        cy.contains('Apply').click({force:true});
        cy.wait(2000);
        cy.contains('Clear').click();

        cy.contains('Select request type').click({force:true});
        cy.wait(2000);
        cy.get('.ant-checkbox-input').eq(0).click();
        cy.wait(2000);
        cy.contains('Apply').click({force:true});
        cy.wait(2000);
        cy.contains('Clear').click();

        cy.contains('Select priority').click({force:true});
        cy.wait(2000);
        cy.get('.ant-checkbox-input').eq(0).click();
        cy.wait(2000);
        cy.contains('Apply').click({force:true});
        cy.wait(2000);
        cy.contains('Clear').click();

        cy.contains('Select location').click({force:true});
        cy.wait(2000);
        cy.get('.ant-checkbox-input').eq(0).click();
        cy.wait(2000);
        cy.contains('Apply').click({force:true});
        cy.wait(2000);
        cy.contains('Clear').click();

        cy.contains('Select assign').click({force:true});
        cy.wait(2000);
        //cy.get('.ant-checkbox-input').eq(0).click();
        //cy.wait(2000);
        cy.contains('Apply').click({force:true});
        cy.wait(2000);
        cy.contains('Clear').click();

        let startDate='11-01-2021';
        let endDate='02-01-2022';
        cy.get("#formFilter_fromDate",{timeout:3000}).type(startDate + '{enter}', {force: true})
        cy.get('#formFilter_toDate',{timeout:3000}).type(endDate + '{enter}', {force: true})
        cy.wait(2000);
        cy.contains('Apply').click({force:true});
        cy.wait(2000);
        cy.contains('Clear').click();
        //cy.get('.title___DgGsu').click();
        cy.wait(2000);

      });

        it('Feedback',() => {
          cy.get('.feedback___1dx9A').click();
          cy.wait(2000);
          cy.get('.ant-radio-input').eq(0).click();
          cy.wait(2000);
          cy.get('.ant-input.fieldModal___1PouH').type("sravan kumar");
          cy.wait(2000);
          cy.get('.anticon.anticon-close.ant-modal-close-icon').click();
    
        });


        

        


    

    // it('Click On Filter', () => {
    //   cy.get('.filterIcon___3zXzI').click();
    //   cy.wait(2000);
    //   cy.get('.ant-col.ant-form-item-control').eq(0).click();
    //   cy.wait(3000);
    //   cy.get('.ant-checkbox-input').click()
    //   cy.wait(2000);
    //   cy.contains('Apply').click({force:true});
    //   cy.wait(2000);
      //cy.contains('Clear').click();
    //});


});