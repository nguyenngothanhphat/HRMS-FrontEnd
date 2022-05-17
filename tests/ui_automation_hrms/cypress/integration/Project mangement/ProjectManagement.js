const { eq } = require("lodash");

describe('Project management Automation', () => {
    before(() => {
  cy.visit('https://stghrms.paxanimi.ai/login');
    });
  
    let employee_email = "khang.le@mailinator.com";
    let password = "12345678@Tc";
    
  
    it('Creating a project', () => {
       cy.loginAsSomeone(employee_email,password);
        cy.contains("Project Management").click({force:true})
        cy.wait(3000);
        cy.get('.ant-select-selection-item').click({force:true})
        cy.wait(3000);
        cy.contains("Add new Project").click({force:true}) 
        cy.get('#myForm_customerId').click();
        cy.wait(5000)
        cy.get('#myForm_customerId').type('Preetha' + '{enter}', {force: true})
        cy.wait(1000)
        cy.get('#myForm_engagementType').type('JV' + '{enter}', {force: true})
        //cy.get('#myForm_accountOwner').click()
        //cy.wait(10000)
        //cy.get('#myForm_accountOwner').type('Arun'+'{enter}',{force:true})
         cy.get('#myForm_projectStatus').type("Active"+'{enter}',{force:true});
        cy.get('#myForm_projectName').type('HARSHA');
        cy.get('#myForm_projectAlias').type('H1');
        let fromDate='05-21-2022';
        let toDate='06-04-2023';
        cy.get('#myForm_startDate',{timeout:3000}).type(fromDate + '{enter}', {force: true});
        cy.get('#myForm_tentativeEndDate',{timeout:3000}).type(toDate + '{enter}', {force: true});
        cy.get('#myForm_projectManager').click()
        cy.wait(4000)
        cy.get('#myForm_projectManager').type('arun'+'{enter}')
        cy.get('#myForm_estimation').type('13');
        cy.get('#myForm_billableHeadCount').type('12');
        cy.get('#myForm_bufferHeadCount').type('6')
        cy.get('#myForm_projectDescription').type('Project')
         cy.get('#myForm_engineeringOwner',{timeout:3000}).type('Kuntappa'+'{enter}', {force: true});
        cy.get('#myForm_division',{timeout:3000}).type('Software Services'+'{enter}', {force: true})
        cy.get('.ant-select-selection-overflow-item.ant-select-selection-overflow-item-suffix').type("Design"+'{enter}'+"Frontend"+'{enter}',{forcr:true});
        cy.contains('Submit').click()
        cy.wait(2000)
        
        
    //filter
      cy.get('.FilterButton___qz7iA').click({force:true});
      cy.wait(3000);
      cy.get('#filter_projectId').type('PREET-2')
      cy.wait(3000);
      cy.get('#filter_projectId').clear()
      cy.get('#filter_division').click({force:true})
      cy.get('.ant-select-item-option-content').eq(6).click({force:true})
      cy.wait(2000)
      cy.get('.anticon.anticon-close-circle').eq(0).click({force:true})
      cy.wait(3000)
      cy.get('#filter_projectName').type('HARSHA'+'{enter}',{force:true})
      cy.wait(3000)
      cy.get('.anticon.anticon-close-circle').eq(0).click({force:true})
      cy.wait(1000)
      cy.get('#filter_customerId').click({force:true})
      cy.get('.ant-select-item-option-content').eq(27).click({force:true})
      cy.wait(3000);
      cy.get('.anticon.anticon-close-circle').eq(0).click({force:true})
      cy.wait(1000)
      cy.get('#filter_engagementType').click({force:true})
      cy.get('.ant-select-item-option-content').eq(34).click({force:true})
      cy.wait(3000)
      cy.get('.anticon.anticon-close-circle').eq(0).click({force:true})
      cy.wait(1000)
      cy.get('#filter_projectManager').click({force:true})
      cy.get('.ant-select-item-option-content').eq(40).click({force:true})
      cy.wait(3000)
      cy.get('.anticon.anticon-close').eq(0).click({force:true})
      cy.get('#filter_projectStatus').click({force:true})
      cy.get('.ant-select-item-option-content').eq(49).click({force:true})
      cy.wait(3000)
      cy.get('.anticon.anticon-close-circle').eq(0).click({force:true})
      cy.wait(1000)
      cy.get('img[src="/static/closeX.af43fcde.svg"]').click( {force:true})
      //search
      cy.get('.ant-input-affix-wrapper').eq(1).type('preetha');
      cy.wait(5000);
      cy.contains("HARSHA").click({force:true});
      cy.wait(5000);
      cy.get('img[src="/static/edit.a12340a1.svg"]').click({force:true})
      cy.wait(1000)
      cy.get('#overviewForm_billableHeadCount').click({force:true});
      cy.wait(1000)
      cy.get('#basic_newBillableHeadCount').type('14')
      cy.get('.ant-form-item-control-input-content').eq(8).type('test')
      cy.contains('Save Changes').click({force:true});
      cy.wait(1000);
      cy.contains('Update').click({force:true});
      cy.wait(1000);
  

    //   //documents

      cy.contains('Documents').click({force:true});
      cy.get('img[src="/static/add.c4e84271.svg"]').click({force:true})
      cy.wait(1000);
      cy.get('#basic_documentType').click({force:true})
      cy.get('.ant-select-item-option-content').eq(0).click({force:true});
      cy.wait(1000)
      cy.get('#basic_documentName').type('doc-2')
      cy.get('#basic_comments').type('project-2')
      const filepath ="hulk.jpg";
      cy.get('input[type="file"]').attachFile(filepath)
      cy.wait(5000)
      cy.get('button[type="submit"]',{timeout: 8000 }).click({force:true})
      cy.wait(3000);
      cy.get('img[src="/static/view.892cc34b.svg"]').eq(0).click({force:true})
      cy.wait(2000);
      cy.get('img[src="/static/closeIconTimeOff.a323d33a.svg"]').click({force:true})
      //filter
      cy.get('img[src="/static/filter.5d3ad138.svg"]').click({force:true}) 
      cy.wait(2000);
      cy.get('#filter_type').click({force:true})
      cy.get('.ant-select-item-option-content').eq(0).click({force:true})
      cy.wait(3000)
      //cy.get('.anticon.anticon-close-circle').click({force:true})
      cy.get('#filter_uploadedBy',{duration:6000}).click({force:true})
      cy.wait(10000)
      cy.get('.ant-select-item-option-content').eq(6).click({force:true})
      cy.wait(3000)
      //cy.get('.anticon.anticon-close-circle').click({force:true}
      let Sdate='Apr 06, 2022'
      let Edate='Apr 07, 2023'
      cy.get('#filter_fromDate').type(Sdate+'{enter}',{force:true})

      //cy.get('.anticon.anticon-close-circle').click({force:true})
      cy.wait(3000)
      cy.get('#filter_toDate').type(Edate+'{enter}',{force:true})
      cy.wait(3000)
      //cy.get('.anticon.anticon-close-circle').click({force:true})
      cy.wait(3000)
      cy.get('button[type="submit"]',{timeout: 8000 }).click({force:true})
      cy.wait(3000);
      //clearing the filter
      cy.get('img[src="/static/filter.5d3ad138.svg"]').click({force:true}) 
      cy.get('.anticon.anticon-close-circle').eq(0).click({force:true})
      cy.get('.anticon.anticon-close-circle').eq(0).click({force:true})
      cy.get('.anticon.anticon-close-circle').eq(0).click({force:true})
      cy.get('.anticon.anticon-close-circle').eq(0).click({force:true})
      cy.get('button[type="submit"]',{timeout: 8000 }).click({force:true})
      cy.wait(3000);
      // cy.pause()
      cy.get('img[src="/static/closeX.af43fcde.svg"]').click({force:true})
      cy.get('.ant-input-affix-wrapper').eq(1).type('sow')
      cy.wait(3000)
      cy.get('.ant-input-affix-wrapper').eq(1).clear();
      cy.wait(1000)
      cy.get('img[src="/static/recycleBin.55acc149.svg"]').eq(0).click({force:true})
      cy.wait(3000)
      
      //add resources
      cy.contains('Resources').click({force:true})
      cy.wait(1000);
      cy.contains('Add Resource Type').click({force:true})
      cy.get('#basic_division').click({force:true})
      cy.get('.ant-select-item-option-content').eq(5).click({force:true});
      cy.get('#basic_resourceType').type('Account Manager').
      then(()=>{
        cy.contains('Account Manager').click({force:true})
      })
      cy.get('#basic_noOfResources').type('10')
      cy.get('#basic_billingStatus').click({force:true})
      cy.get('.ant-select-item-option-content').eq(20).click({force:true})
      cy.get('#basic_estimatedEffort').type(2)
      cy.get('#basic_technologies').click({force:true}).then(()=>{
        cy.get('.ant-select-item-option-content').eq(33).click({force:true})
      })
      cy.get('#basic_comments').click({force:true})
      cy.get('button[type="submit"]', { timeout: 8000 }).click({force:true})
      cy.pause()
      //filter
      cy.get('img[src="/static/filter.5d3ad138.svg"]').click({force:true})
      cy.wait(2000)
      cy.get('#filter_division').type('sales'+'{enter}',{force:true})
      cy.get('#filter_resourceType').click({force:true})
      cy.get('.ant-select-item-option-content').eq(14).click({force:true})
      cy.get('#filter_billingStatus').type('buffer'+"{enter}",{force:true})
      cy.wait(3000)
      cy.get('.ant-btn.btnApply___yDHKp').click({force:true}) 
      cy.get('img[src="/static/closeX.af43fcde.svg"]').click({force:true})
      cy.wait(3000)
      //clearing the filter
      cy.get('img[src="/static/filter.5d3ad138.svg"]').click({force:true})
      cy.get('.anticon.anticon-close-circle').eq(0).click({force:true})
      cy.get('.anticon.anticon-close-circle').eq(0).click({force:true})
     // cy.get('.anticon.anticon-close-circle').eq(0).click({force:true})
      cy.get('.ant-btn.btnApply___yDHKp').click({force:true}) 
      cy.get('img[src="/static/closeX.af43fcde.svg"]').click({force:true})
      cy.wait(1000)
      cy.get('.ant-input-affix-wrapper').eq(1).type('Process Analyst I');
      cy.wait(3000)
      cy.get('img[src="/static/orangeAdd.97483fe5.svg"]').eq(1).click({force:true});
      cy.wait(3000);
      //filter
      cy.get('img[src="/static/filter.5d3ad138.svg"]').eq(1).click({force:true})
      cy.wait(2000)
      cy.get('#filter_division').click({force:true})
      cy.get('.ant-select-item-option-content').eq(4).click({force:true})
      cy.get('#filter_designation').click({force:true})
      cy.get('.ant-select-item-option-content').eq(9).click({force:true})
      cy.contains('Submit', { timeout: 8000 }).click({force:true})
      cy.wait(2000)
     // cy.get('img[src="/static/closeX.af43fcde.svg"]').eq(0).click({force:true})
      //clearing the filter
      cy.get('img[src="/static/filter.5d3ad138.svg"]').eq(1).click({force:true})
      cy.get('.anticon.anticon-close-circle').eq(0).click({force:true})
      //cy.get('.anticon.anticon-close-circle').eq(0).click({force:true})
      cy.contains('Submit', { timeout: 8000 }).click({force:true})
      cy.wait(1000)
      //cy.get('img[src="/static/closeX.af43fcde.svg"]').eq(0).click({force:true})
      cy.get('.ant-input-affix-wrapper').eq(2).type('anh');
      cy.wait(1000)
      cy.get('.ant-modal-close-x').click({force:true})
      cy.wait(3000)
      
      //resources
      cy.get('.ant-tabs-tab-btn').eq(1).click({force:true})
      cy.contains('Add Resources').click({force:true})
      cy.get('img[src="/static/filter.5d3ad138.svg"]').eq(1).click({force:true})
      cy.wait(3000)
      cy.get('#filter_division').type('sales'+'{enter}',{force:true})
      cy.get('#filter_designation').click({force:true})
      cy.get('.ant-select-item-option-content').eq(14).click({force:true})
      cy.get('button[type="submit"]', { timeout: 8000 }).click({force:true})
      cy.wait(1000)
      cy.get('img[src="/static/filter.5d3ad138.svg"]').eq(1).click({force:true})
      cy.get('.anticon.anticon-close-circle').eq(0).click({force:true})
      cy.get('.anticon.anticon-close-circle').eq(0).click({force:true})
      cy.get('button[type="submit"]', { timeout: 8000 }).click({force:true})
      cy.wait(3000)
      //cy.get('img[src="/static/closeX.af43fcde.svg"]').eq(1).click({force:true})
      cy.get('.ant-input-affix-wrapper').eq(2).type('anh');
      cy.wait(3000)
      cy.get('.ant-checkbox-input').eq(1).click({force:true})
      cy.contains('Next').click({force:true})
      cy.wait(3000)
      cy.contains('Assign').click({force:true})
      cy.wait(1000)
      cy.contains('Yes').click({force:true})
      cy.wait(1000)
      cy.get('.ant-modal-close-x').click({force:true})
      //filter
      let sfromdate='Apr 26, 2022'
      let stodate="Apr 27, 2022"
      let efromdate='May 03, 2022'
      let etodate='May 11, 2022'
      let rfromdate='May 13, 2022'
      let rtodate='May 16, 2022'
      cy.get('img[src="/static/filter.5d3ad138.svg"]').click({force:true})
      cy.wait(3000)
      cy.get('#filter_designation').click({force:true})
      cy.get('.ant-select-item-option-content').eq(0).click({force:true})
      cy.get('#filter_billingStatus').type('buffer'+'{enter}',{force:true})
      cy.get('#filter_s_fromDate').type(sfromdate+'{enter}',{force:true})
      cy.get('#filter_s_toDate').type(stodate+'{enter}',{force:true})
      cy.get('#filter_e_fromDate').type(efromdate+'{enter}',{force:true})
      cy.get('#filter_e_toDate').type(etodate+'{enter}',{force:true})
      cy.get('#filter_r_fromDate').type(rfromdate+'{enter}',{force:true})
      cy.get('#filter_r_toDate').type(rtodate+'{enter}',{force:true})
      cy.scrollTo('bottom',{duration:3000})
      cy.wait(2000)
      cy.get('button[type="submit"]', { timeout: 8000 }).click({force:true})
      cy.wait(1000)
      cy.get('img[src="/static/closeX.af43fcde.svg"]').click({force:true})
      
      
      //planning
      cy.contains('Planning').click({force:true});
      cy.contains('Add Milestones').click({force:true});
      cy.get('#basic_milestoneName').type('MARCH')
      let startDate=('2022-04-22')
      let endDate=('2022-07-22')
      let startDate1=('2022-04-25')
      let endDate1=('2022-07-25')
      cy.get('#basic_startDate').type(startDate+'{enter}',{force:true})
      cy.get('#basic_endDate').type(endDate+'{enter}',{force:true})
      cy.get('#basic_description').type('important')
      cy.get('button[type="submit"]', { timeout: 8000 }).click({force:true})
      cy.wait(3000);
      cy.scrollTo('bottom',{duration:3000})
      cy.get('img[src="/static/edit2.b1774272.svg"]').eq(0).click({force:true})
      cy.scrollTo('top',{duration:3000})
      cy.get('.anticon.anticon-close-circle').eq(0).click({force:true})
      cy.get('#milestoneForm_startDate').type(startDate1+'{enter}',{force:true})
      cy.wait(1000);
      cy.get('.anticon.anticon-close-circle').eq(1).click({force:true})
      cy.get('#milestoneForm_endDate').type(endDate1+'{enter}',{force:true})
      cy.get('#milestoneForm_description').clear().type('very important')
      cy.get('button[type="submit"]', { timeout: 8000 }).click({force:true})
      cy.wait(3000);
      cy.get('img[src="/static/recycleBin.55acc149.svg"]').click({force:true})
      cy.contains("OK").click({force:true})
      // cy.pause()
      //tracking
      cy.scrollTo('top',{duration:3000})
      cy.contains('Tracking').click({force:true})
      cy.wait(3000);
      cy.contains('Reporting').click({force:true})
      cy.wait(3000);
      cy.contains('Audit Trail').click({force:true})
      cy.wait(3000);   
      //deleting the project
      cy.contains("Project Management").click({force:true})
      cy.wait(5000)
      cy.get('img[src="/static/edit2.b1774272.svg"]').eq(8).click({force:true})
      cy.wait(3000);
      cy.get('#basic_newStatus').click({force:true})
      cy.wait(1000)
      cy.get('.ant-select-item-option-content').eq(1).click({force:true})
      cy.get('#basic_reason').type('bad network')
      cy.get('button[type="submit"]', { timeout: 8000 }).click({force:true})
      cy.wait(3000);
      cy.get('.ant-btn.ant-btn-link.ant-btn-circle').eq(9).click();
      cy.get('button[type="submit"]').click();
    });
    
  });
  