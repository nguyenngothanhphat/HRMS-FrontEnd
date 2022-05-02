let HR_manager_Email="narmada.biradar@mailinator.com"
let password="12345678@Tc"
describe('Timesheet',()=>{
    before(()=>{
        cy.visit('https://stghrms.paxanimi.ai/login');
    });
   it('checking HR report',()=>{
    cy.loginAsSomeone(HR_manager_Email,password);
    cy.contains("Timesheet").click({force:true});
    cy.wait(3000);
    cy.get('.ant-tabs-tab-btn').eq(1).click({force:true})
    cy.wait(5000);
    //cy.logout();

   })
    it('checking finance report in HR profile ', () => {
        cy.get('.ant-tabs-tab-btn').eq(2).click({force:true})
        cy.wait(10000);
        cy.get('.ant-checkbox-input').eq(2).click({force:true});
        cy.wait(1000)
        cy.get('.ant-checkbox-input').eq(3).click({force:true});
        cy.wait(1000)
        cy.get('.ant-checkbox-input').eq(0).click({force:true});
        cy.wait(1000)
        cy.scrollTo("bottom",{duration:3000});
        cy.scrollTo("top",{duration:3000});
        //cy.get('.ant-checkbox-input').eq(0).click({force:true});
        cy.wait(1000)
        cy.get('.dropdown___2atUF').eq(0).click({force:true})
        cy.wait(2000);
        cy.get('.ant-checkbox-inner').eq(12).click({force:true})
        cy.wait(3000);
        cy.get('.dropdown___2atUF').eq(1).click({force:true})
        cy.wait(3000);
        cy.get('.dropdown___2atUF').eq(1).click({force:true})
        cy.wait(3000);
        cy.get('.anticon.anticon-search').eq(1).type('hrms').click({force:true})
        cy.wait(4000);
        cy.contains('Monthly').click({force:true});
        cy.wait(3000)
        cy.scrollTo("bottom",{duration:3000});
        cy.get('.dropdown___2atUF').eq(0).click({force:true})
        cy.wait(2000);
        cy.get('.ant-checkbox-inner').eq(12).click({force:true})
        cy.wait(3000);
        cy.get('.dropdown___2atUF').eq(1).click({force:true})
        cy.wait(3000);
        cy.get('.dropdown___2atUF').eq(1).click({force:true})
        cy.wait(3000);
        cy.get('.anticon.anticon-search').eq(1).type('hrms').click({force:true})
        cy.wait(2000);
        cy.logout();
    })
    it('checking the my projects',()=>{
        
        cy.get('.ant-tabs-tab-btn').eq(3).click({force:true})
        cy.wait(5000);
        cy.contains('Team View').click({force:true})
        cy.wait(2000);
        //cy.get("img[src='/static/filter.5d3ad138.svg']").eq(1).click({force:true});
        cy.get('.ant-input-affix-wrapper').type('Aashwij Pai',{duration:2000}+'{enter}').click({force:true})
        cy.wait(3000);
        cy.get('.ant-select-selector',{duration:3000}).eq(2).click({force:true})
        cy.wait(3000)
        cy.get('.ant-select-item-option-content').eq(2).click({force:true})
        cy.get('.ant-select-selector').eq(3).click({force:true})
        cy.wait(3000)
        cy.get('.ant-select-item-option-content').eq(14).click({force:true})
        cy.wait(3000)
        cy.get('.anticon.anticon-close-circle.ant-input-clear-icon').click({force:true})
        cy.wait(3000);
        cy.get('.anticon.anticon-close').eq(0).click({force:true})
        cy.wait(1000)
        cy.get('.anticon.anticon-close').eq(0).click({force:true})
        cy.wait(1000)
        cy.contains('Settings').click({force:true})

    })
   
})   