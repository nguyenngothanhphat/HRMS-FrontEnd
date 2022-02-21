describe('Timesheet',()=>{
    before(()=>{
        cy.visit('https://stghrms.paxanimi.ai/login');
    });
    let employee_email = "comp1-hr-manager@mailinator.com";
    let password = "12345678@Tc";
    it('sign in', () => {
        
        cy.get('#basic_userEmail.ant-input').type(employee_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();
        cy.wait(5000);
        cy.contains("Timesheet").click({force:true});
        cy.contains("Add Task").click({force:true})
        .then(()=>{
            cy.get('#basic_tasks_0_projectId').click().trigger('mousedown')
            .then(()=>{
                cy.contains('Test').click({force:true});
            });
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
            cy.get('.actionsButton___1MBuf').click();
            cy.wait(2000);
            cy.contains("Yes").click();

        });
       
    });
});describe('Timesheet',()=>{
    before(()=>{
        cy.visit('https://stghrms.paxanimi.ai/login');
    });
    let employee_email = "comp1-hr-manager@mailinator.com";
    let password = "12345678@Tc";
    it('sign in', () => {
        cy.get('#basic_userEmail.ant-input').type(employee_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();
        cy.wait(5000);
        cy.contains("Timesheet").click({force:true});
        cy.contains("Add Task").click({force:true})
        .then(()=>{
            cy.get('#basic_tasks_0_projectId').click().trigger('mousedown')
            .then(()=>{
                cy.contains('Test').click({force:true});
            });
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
            cy.get('.actionsButton___1MBuf').click();
            cy.wait(2000);
            cy.contains("Yes").click();

        });
       
    });
});