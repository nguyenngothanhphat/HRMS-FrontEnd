const { eq } = require("lodash");

describe('Timeoff Automation', () => {
    before(() => {
      cy.visit('https://stghrms.paxanimi.ai/login');
    });

    let employee_email = "comp1-hr-manager@mailinator.com";
    let password = '12345678@Tc';

    it('Log In and Resource Management', () => {
        //cy.pause();

        cy.get('#basic_userEmail.ant-input').type(employee_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();
        cy.wait(1000);
        cy.contains('Resource Management').click({force:true});
        cy.wait(2000);
        cy.contains('Resources').click();
        cy.wait(2000);

        cy.contains('Name').click({force:true});
        cy.wait(2000)
        cy.contains('Name').click({force:true});
        cy.wait(2000)
        cy.contains('Name').click({force:true});
        cy.wait(2000)

        cy.contains('Division').click({force:true});
        cy.wait(2000)
        cy.contains('Division').click({force:true});
        cy.wait(2000)
        cy.contains('Division').click({force:true});
        cy.wait(2000)

        
        cy.contains('Designation').click({force:true});
        cy.wait(2000)
        cy.contains('Designation').click({force:true});
        cy.wait(2000)
        cy.contains('Designation').click({force:true});
        cy.wait(2000)

        
        cy.contains('Experience').click({force:true});
        cy.wait(2000)
        cy.contains('Experience').click({force:true});
        cy.wait(2000)
        cy.contains('Experience').click({force:true});
        cy.wait(2000)
        cy.get('.buttonEdit___2k5N_').eq(0).click({force:true});
        cy.wait(3000);
        cy.get('.anticon.anticon-close.ant-modal-close-icon').click();
        cy.wait(2000);
        cy.get('.ant-select-selection-item').eq(0).click();
        cy.wait(2000);
        cy.contains('Available now (829').click();
        cy.wait(2000);
        cy.get('.filterIcon___3tcsv').click();
        cy.wait(2000);

        

        cy.contains('Select priority').click({force:true});
        cy.wait(2000);
        cy.contains('UI Design').click();
        cy.wait(2000);
        cy.contains('Apply').click({force:true});
        cy.wait(2000);
        cy.get('.ant-select-clear').click({force:true});
        cy.wait(2000);

        cy.contains('Select designation').click({force:true});
        cy.contains(' Process Analyst I').click();
        cy.wait(2000);
        cy.contains('Apply').click({force:true});
        cy.wait(2000);
        cy.get('.ant-select-clear').click();

        cy.contains('Select name').click({force:true});
        cy.wait(2000);
        cy.contains('Hari A').click();
        cy.wait(2000);
        cy.contains('Apply').click({force:true});
        cy.wait(2000);
        cy.get('.ant-select-clear').click({force:true});
        cy.wait(2000);

        

        cy.contains('Select location').eq(0).click({force:true});
        cy.wait(2000);
        cy.contains('Buffer').click();
        cy.wait(2000);
        cy.contains('Apply').click({force:true});
        cy.wait(2000);
        cy.get('.ant-select-clear').click({force:true});

        cy.get('.ant-select-selection-overflow').eq(2).click({force:true});
        cy.wait(2000);
        cy.contains('Test').click();
        cy.wait(2000);
        cy.contains('Apply').click({force:true});
        cy.wait(2000);
        cy.get('.ant-select-clear').click({force:true});
        cy.wait(2000);

        // cy.contains('Select billing status').click({force:true});
        // cy.wait(2000);
        // cy.contains('Buffer').click({force:true});
        // cy.wait(2000);
        // cy.contains('Apply').click({force:true});
        // cy.wait(3000);
        // cy.get('.ant-select-clear').click({force:true});
        // cy.wait(2000);
        cy.get('.ant-input.experience___2Xmly').eq(0).type(1);
        cy.wait(2000)
        cy.get('.ant-input.experience___2Xmly').eq(1).type(2);
        cy.wait(2000)
        cy.contains('Clear').click({force:true});
        cy.wait(3000);

        cy.contains('Projects').click();
        cy.wait(2000);

        cy.contains('Project Name').click({force:true});
        cy.wait(2000);
        cy.contains('Project Name').click({force:true});
        cy.wait(2000);
        cy.contains('Project Name').click({force:true});
        cy.wait(2000);

        cy.get('.ant-table-column-title').eq(1).click({force:true});
        cy.wait(2000);
        cy.get('.ant-table-column-title').eq(1).click({force:true});
        cy.wait(2000)
        cy.get('.ant-table-column-title').eq(1).click({force:true});
        cy.wait(2000)  
        
        cy.get('.ant-table-column-title').eq(2).click({force:true});
        cy.wait(2000)
        cy.get('.ant-table-column-title').eq(2).click({force:true});
        cy.wait(2000)
        cy.get('.ant-table-column-title').eq(2).click({force:true});
        cy.wait(2000)

        cy.get('.ant-table-column-title').eq(3).click({force:true});
        cy.wait(2000)
        cy.get('.ant-table-column-title').eq(3).click({force:true});
        cy.wait(2000)
        cy.get('.ant-table-column-title').eq(3).click({force:true});
        cy.wait(2000)

        cy.get('.ant-table-column-title').eq(4).click({force:true});
        cy.wait(2000)

        cy.get('.ant-table-column-title').eq(5).click({force:true});
        cy.wait(2000)

        cy.get('.ant-table-column-title').eq(6).click({force:true});
        cy.wait(2000)

        cy.get('.ant-table-column-title').eq(7).click({force:true});
        cy.wait(2000)

        cy.get('.ant-table-column-title').eq(8).click({force:true});
        cy.wait(2000)

        cy.get('.ant-table-column-title').eq(9).click({force:true});
        cy.wait(2000)

        cy.get('.ant-table-column-title').eq(10).click({force:true});
        cy.wait(2000)

        cy.get('.ant-table-column-title').eq(11).click({force:true});
        cy.wait(2000)

        cy.get('.ant-table-column-title').eq(12).click({force:true});
        cy.wait(2000)

        cy.get('.ant-table-column-title').eq(13).click({force:true});
        cy.wait(2000)

        cy.get('.ant-table-column-title').eq(14).click({force:true});
        cy.wait(2000)

        cy.get('.ant-table-column-title').eq(15).click({force:true});
        cy.wait(2000)

        cy.get('.ant-table-column-title').eq(16).click({force:true});
        cy.wait(2000)


        cy.contains('Filter').click();
        cy.wait(2000);

        cy.contains('Select Division').click({force:true});
        cy.wait(2000);
        cy.get('.ant-select-item-option-content').eq(0).click();
        cy.contains('Apply').click({force:true});
        cy.wait(2000);
        cy.get('.ant-select-clear').click({force:true});
        cy.wait(2000)

        // cy.contains('Select Project Name').click({force:true});
        // cy.wait(2000);
        // cy.get('.ant-select-item-option-content').eq(35).click({force:true});
        // cy.contains('Apply').click({force:true});
        // cy.wait(2000);
        // cy.get('.ant-select-clear').click({force:true});
        // cy.wait(2000)


        cy.contains('Select Customer').click({force:true});
        cy.wait(2000);
        cy.get('.ant-select-item-option-content').eq(7).click({force:true});
        cy.contains('Apply').click({force:true});
        cy.wait(2000);
        cy.get('.ant-select-clear').click({force:true});
        cy.wait(2000)

        cy.contains('Select Engagement Type').click({force:true});
        cy.wait(2000);
        cy.contains('Staff Augmentation').click({force:true});
        cy.contains('Apply').click({force:true});
        cy.wait(2000);
        cy.get('.ant-select-clear').click({force:true});
        cy.wait(2000)

        
        cy.contains('Select Project Manager').click({force:true});
        cy.wait(2000);
        cy.contains('Hari A').click({force:true});
        cy.contains('Apply').click({force:true});
        cy.wait(2000);
        cy.get('.ant-select-selection-item-remove').click({force:true});
        cy.wait(2000)

        
        cy.contains('Select Status').click({force:true});
        cy.wait(2000);
        cy.contains('Hari A').click({force:true});
        cy.contains('Apply').click({force:true});
        cy.wait(2000);
        cy.get('.ant-select-selection-item-remove').click({force:true});
        cy.wait(2000)
        
        

        
    });

    
    

});
