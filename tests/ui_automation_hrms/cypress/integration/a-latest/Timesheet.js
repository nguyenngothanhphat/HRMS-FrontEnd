const { eq } = require("lodash");

describe('Timesheet',()=>{
    before(()=>{
        cy.visit('https://stghrms.paxanimi.ai/login');
    });
    let employee_email = "lewis.nguyen@mailinator.com";
    let Manager_email="khang.le@mailinator.com";
    let password = "12345678@Tc";
    it('sign in', () => {
        
        cy.get('#basic_userEmail.ant-input').type(employee_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();
        cy.wait(5000);
        cy.contains("Timesheet").click({force:true});
        cy.contains("Add Task").click({force:true})
        .then(()=>{
            cy.get('#basic_tasks_0_projectId').type('TM'+'{enter}')
            cy.get('#basic_tasks_0_taskName').type('python');
            cy.wait(1000);
            let startDate='6:00 am';
            let endDate='6:00 pm';
            cy.get("#basic_tasks_0_startTime",{timeout:3000}).type(startDate + '{enter}', {force: true})
            cy.get('#basic_tasks_0_endTime',{timeout:3000}).type(endDate + '{enter}', {force: true})
            cy.get('#basic_tasks_0_notes').type("important");
            cy.get("#basic_tasks_0_clientLocation").click();
            cy.get('button[type="Submit"]').click();
           cy.wait(10000);
           
            cy.contains("Add Task").click({force:true})
        .then(()=>{
            cy.get('#basic_tasks_0_projectId').click().type('TM'+'{enter}')
            cy.get('#basic_tasks_0_taskName').type('python');
            cy.wait(1000);
            let startDate1='7:00 pm';
            let endDate1='9:00 pm';
            cy.get("#basic_tasks_0_startTime",{timeout:3000}).type(startDate1 + '{enter}', {force: true})
            cy.get('#basic_tasks_0_endTime',{timeout:3000}).type(endDate1 + '{enter}', {force: true})
            cy.get('#basic_tasks_0_notes').type("important");
            cy.get("#basic_tasks_0_clientLocation").click();
            cy.get('button[type="Submit"]').click();
        //     cy.wait(10000);
            cy.wait(10000);
            // cy.scrollTo('left', { duration: 2000 });
            // cy.get('.alignCenter___oGMaJ').eq(0).click()
            cy.get('img[src="/static/del.130ca399.svg"]').eq(0).click({force:true})
            // cy.get('.actionsButton___1MBuf').click();
          
            // cy.wait(2000);
            cy.contains("Yes").click();
            cy.wait(3000)
            cy.get('img[src="/static/del.130ca399.svg"]').eq(0).click({force:true})
            // cy.get('.alignCenter___oGMaJ').eq(0).click()
            // cy.get('.actionsButton___1MBuf').eq(1).click();
            // cy.wait(2000);
            cy.contains("Yes").click();
        });   
       
        });
    });
    // it('logoff',()=>{
    //     cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
    //     .then(() =>{
    //       cy.contains('Logout').wait(2000).click({force:true});
    //      }); 
    //      cy.wait(3000);
    //  });
    //  it('Checking the timesheet of employee shown in manager profile',()=>{
    //     cy.get('#basic_userEmail.ant-input').type(Manager_email);
    //     cy.get('#basic_password.ant-input').type(password);
    //     cy.get('button[type="submit"]').click();
    //     cy.wait(5000);
    //     cy.contains("Timesheet").click({force:true});
    //     cy.contains('My Project').click();
    //     cy.contains('Team View').click();
    //     cy.get('.ant-input-affix-wrapper').eq(2).type('lewis');
        

    //  });  
    //  it('logoff',()=>{
    //     cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
    //     .then(() =>{
    //       cy.contains('Logout').wait(2000).click({force:true});
    //      }); 
    //      cy.wait(3000);
    //  });    
    //  it('Deleting the timesheet',()=>{
    //     cy.get('#basic_userEmail.ant-input').type(employee_email);
    //     cy.get('#basic_password.ant-input').type(password);
    //     cy.get('button[type="submit"]').click();
    //     cy.wait(5000);
    //     cy.contains("Timesheet").click({force:true});
    //     cy.wait(5000);
    //      cy.get('.alignCenter___oGMaJ').eq(0).click()
    //         // cy.get('.actionsButton___1MBuf').click();
          
    //         // cy.wait(2000);
    //         cy.contains("Yes").click();
    //         cy.wait(3000)
    //         cy.get('.alignCenter___oGMaJ').eq(0).click()
    //         // cy.get('.actionsButton___1MBuf').eq(1).click();
    //         // cy.wait(2000);
    //         cy.contains("Yes").click();
         
    //  });
    
  });