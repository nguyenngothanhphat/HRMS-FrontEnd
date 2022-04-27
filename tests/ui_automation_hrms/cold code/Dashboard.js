const { eq } = require("lodash");

describe('Timeoff Automation', () => {
    before(() => {
      cy.visit('https://stghrms.paxanimi.ai/login');
    });

    let employee_email = "comp1-hr-manager@mailinator.com";
    let password = '12345678@Tc';

    it('Log In and ManageWigets', () => {
        //cy.pause();

        cy.get('#basic_userEmail.ant-input').type(employee_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();
        cy.wait(1000);
        cy.contains('Dashboard').click({force:true});
        cy.wait(2000);
        cy.get('.manageWidgets___k1JOt').click();
         cy.wait(2000);
      cy.get('.ant-btn.ant-btn-primary').eq(1).click({force: true});
      cy.wait(2000);
      cy.get('.ant-dropdown-trigger.action___3ut1O.notify___2Rxx5').click();
    });

    // it('Timesheets',() => {
    //   cy.get('.actionIcon___s9sD1').eq(0).click();
    //   cy.wait(4000);
    //   cy.get('.ant-menu-title-content').eq(1).click();
    //   cy.wait(2000);
    // });
    
   
    
    // it('View all mettings',() => {
    //   cy.contains('View all Meetings').click();
    //     cy.wait(2000);
    //     cy.get('.ant-modal-close-x').wait(1000).click()
        

    // });

    
    it('Holiday Calender',() => {
      cy.contains('Holiday Calendar').click()
      cy.contains('View all Holiday').scrollIntoView().wait(1000).click()
      cy.get('.ant-modal-close-x').wait(1000).click()
    });

    it('Activity Log',() => {
      cy.contains("Notifications").click();
      cy.wait(2000);
      cy.contains("My Tickets (04)").click();
      cy.wait(2000);
      cy.get('.viewBtn___1gb7A').eq(0).click();
      cy.wait(2000);
      cy.get('.anticon.anticon-close.ant-modal-close-icon').click();
      cy.wait(2000);
      cy.contains("View all Tasks").click();
      cy.wait(2000);
      cy.get(".ant-modal-close-x").click();

    });
     
    it('My Tasks',() => {
      cy.contains('Performance evaluation').click();
      cy.wait(2000);
      cy.contains('View all Tasks').click();
      cy.wait(2000);
      cy.get('.anticon.anticon-close.ant-modal-close-icon').click();
      
    });

    it('Show apps',() => {
      cy.get('.manageAppsBtn___312Y8').click();
      cy.wait(2000);
      cy.get('.ant-modal-close-x').click();
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

    

  
    
    
  });


