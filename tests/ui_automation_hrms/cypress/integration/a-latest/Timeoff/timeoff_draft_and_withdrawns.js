describe('Timeoff Automation', () => {
    before(() => {
      cy.visit('https://stghrms.paxanimi.ai/login');
    });
    let Manager_email= "rajeeve@mailinator.com";
    let Employee_email = "lewis.nguyen@mailinator.com";
    let HR_manager_email="narmada.biradar@mailinator.com"
    let password = "12345678@Tc";
    
    it('Applying for leave request drafts and discard drafts', () => {
      cy.get('#basic_userEmail.ant-input').type(Employee_email);
      cy.get('#basic_password.ant-input').type(password);
      cy.get('button[type="submit"]').click();
      cy.wait(3000);
      cy.contains("Timeoff").click({force:true});
      cy.contains('Request Time Off').click();
      cy.wait(2000);
      cy.get('#basic_timeOffType').trigger('mousedown')
        .then(() => {
          cy.contains('Casual Leave').click();
        });
      cy.get('#basic_subject').type('function');
      let fromDate ="04/20/2022";         
      let toDate ="04/20/2022";
      cy.get('#basic_durationFrom ',{timeout:3000}).type(fromDate + '{enter}', {force: true});
       cy.get("#basic_durationTo", {timeout:3000}).type(toDate + '{enter}', {force: true});
      cy.get('#basic_description ').type('Attending function');
       cy.get('.ant-btn').then((resp)=>{
         cy.get(resp[1]).click();
       }).then(()=>{     
          cy.wait(3000);   
          cy.get('.ant-btn').then((resp)=>{
             cy.get(resp[4]).click();
             cy.wait(10000);
             
             cy.contains('Drafts').click()
             cy.contains('View Request').click({force:true})
             cy.contains('Discard').click({force:true})
             cy.contains('Proceed').click({force:true})
             cy.wait(3000);
          });
        });
    });
    
    it('logoff',()=>{
      cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
      .then(() =>{
        cy.contains('Logout').wait(2000).click({force:true});
       }); 
       cy.wait(5000);
   });
    it('Applying for leave request and withdrawn', () => {
      cy.get('#basic_userEmail.ant-input').type(Employee_email);
      cy.get('#basic_password.ant-input').type(password);
      cy.get('button[type="submit"]').click();
      cy.wait(3000);
      cy.contains("Timeoff").click({force:true});
      cy.contains('Request Time Off').click();
      cy.wait(2000);
      cy.get('#basic_timeOffType').trigger('mousedown')
        .then(() => {
          cy.contains('Casual Leave').click();
        });
      cy.get('#basic_subject').type('function');
      let fromDate ="04/19/2022";         
      let toDate ="04/19/2022";
      cy.get('#basic_durationFrom ',{timeout:3000}).type(fromDate + '{enter}', {force: true});
       cy.get("#basic_durationTo", {timeout:3000}).type(toDate + '{enter}', {force: true});
       //cy.pause();
      cy.get('#basic_description ').type('Attending function');
       cy.get('.ant-btn').then((resp)=>{
         cy.get(resp[1]).click();
       }).then(()=>{     
          cy.wait(3000);   
          cy.get('.ant-btn').then((resp)=>{
             cy.get(resp[4]).click();
             cy.wait(10000);
             cy.contains('Drafts').click()
             cy.contains('View Request').click({force:true})
             cy.contains('Edit').click({force:true})
             cy.get('#basic_leaveTimeLists_0_period').then(()=>{
               cy.contains('Whole day').click({force:true})
             })
             cy.get('.ant-btn').then((resp)=>{
              cy.get(resp[2]).click();
            }).then(()=>{     
               cy.wait(3000);   
               cy.get('.ant-btn').then((resp)=>{
                  cy.get(resp[4]).click();
                  cy.wait(3000);
                  cy.get('p').then((resp)=>{
                    cy.get(resp[0]).invoke('text').then((text)=>{
                      let parts=text.split(' ');
                      let moreparts=parts[2].split(']');
                      let id_latest =moreparts[0];
                      cy.writeFile("latest_id_timeoff.txt",id_latest);
                      cy.wait(3000);
                      //cy.contains('Timeoff').click()
                      // cy.readFile("latest_id_timeoff.txt").then(function(value){
                      //   //cy.get('.ant-pagination-item-link').eq(1).click();
                      //   cy.log(value);
                      
                      //  cy.contains(value).click();
                      // });
                      cy.contains('Withdraw').click({force:true})
                      cy.contains('Proceed').click({force:true})
                    });
                  });
               })
              })
          });        
         });   
       });
       it('logoff',()=>{
        cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
        .then(() =>{
          cy.contains('Logout').wait(2000).click({force:true});
         }); 
         cy.wait(5000);
     });
     it('checking the ticks for rejecting and aprroving in manager profile',()=>{
      cy.get('#basic_userEmail.ant-input').type(Manager_email);
      cy.get('#basic_password.ant-input').type(password);
      cy.get('button[type="submit"]').click();
      cy.wait(3000);
      cy.contains("Timeoff").click({force:true});
      cy.contains("Team Requests").click({force:true})
      cy.contains('Progress').click({force:true});
      cy.wait(3000);
      //cy.readFile("latest_id_timeoff.txt").then(function(value){
      // cy.get('.ant-pagination-item-link').eq(1).click();
      // cy.get('.ant-pagination-item-link').eq(1).click();
      //cy.get('img[src="/static/approveTR.fcbbe348.svg"]').click({force:true})
      //cy.get('img[src="/static/cancelTR.1d196678.svg"]').click({force:true})
      //cy.get('img[src="/static/approveTR.fcbbe348.svg"]').eq(0).click({force:true});
      cy.get('img[src="/static/cancelTR.1d196678.svg"]').eq(0).click({force:true})
      cy.wait(2000)
      cy.contains('Submit').click()
      cy.wait(3000);
      cy.get('img[src="/static/approveTR.fcbbe348.svg"]').eq(0).click({force:true});
      cy.wait(3000);
      //cy.contains('Submit').click()
    //});
     });
     it('logoff',()=>{
      cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
      .then(() =>{
        cy.contains('Logout').wait(2000).click({force:true});
       }); 
       cy.wait(5000);
   });
    
     it('checking the ticks for rejecting and aprroving in HR manager profile',()=>{
      cy.get('#basic_userEmail.ant-input').type(HR_manager_email);
      cy.get('#basic_password.ant-input').type(password);
      cy.get('button[type="submit"]').click();
      cy.wait(3000);
      cy.contains("Timeoff").click({force:true});
      cy.wait(2000)
      //cy.contains('Company Wide Requests').click();
      cy.contains('In Progress').click();
      cy.wait(3000);
      //cy.readFile("latest_id_timeoff.txt").then(function(value){
      //cy.get('.ant-pagination-item-link').eq(1).click();
      //cy.get('.ant-pagination-item-link').eq(1).click();
      //cy.get('.ant-pagination-item-link').eq(1).click();
      //cy.log(value);
      //cy.get('img[src="/static/approveTR.fcbbe348.svg"]').click({force:true})
      //cy.get('img[src="/static/cancelTR.1d196678.svg"]').eq(0).click({force:true})
     
      //cy.get('img[src="/static/approveTR.fcbbe348.svg"]').eq(0).click({force:true});
      cy.get('img[src="/static/cancelTR.1d196678.svg"]').eq(0).click({force:true})
      cy.contains('Submit').click()
      cy.wait(5000);
      cy.get('img[src="/static/approveTR.fcbbe348.svg"]').eq(0).click({force:true});
      cy.wait(5000)
    //});
     });
     it('logoff',()=>{
      cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
      .then(() =>{
        cy.contains('Logout').wait(2000).click({force:true});
       }); 
       cy.wait(5000);
      });
    
     it('checking the bulk approvals and rejections in Hr manager profile',()=>{
      cy.get('#basic_userEmail.ant-input').type(HR_manager_email);
      cy.get('#basic_password.ant-input').type(password);
      cy.get('button[type="submit"]').click();
      cy.wait(3000);
      cy.contains("Timeoff").click({force:true});
      cy.wait(2000)
      cy.get('.ant-checkbox-inner').eq(1).click({force:true})
      cy.get('.ant-checkbox-inner').eq(2).click({force:true})
       cy.get('img[src="/static/approveTR.fcbbe348.svg"]').eq(0).click({force:true});
       cy.wait(4000)
       cy.get('.ant-checkbox-inner').eq(1).click({force:true})
      cy.get('.ant-checkbox-inner').eq(2).click({force:true})
       cy.get('img[src="/static/cancelTR.1d196678.svg"]').eq(0).click({force:true})
       cy.contains("Submit").click()
       cy.wait(5000)

     })
     it('logoff',()=>{
      cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
      .then(() =>{
        cy.contains('Logout').wait(2000).click({force:true});
       }); 
       cy.wait(5000);
   });
    
     it('checking the bulk approvals and rejections in manager profile',()=>{
      cy.get('#basic_userEmail.ant-input').type(Manager_email);
      cy.get('#basic_password.ant-input').type(password);
      cy.get('button[type="submit"]').click();
      cy.wait(3000);
      cy.contains("Timeoff").click({force:true});
      cy.wait(2000)
      cy.get('.ant-checkbox-inner').eq(1).click({force:true})
      cy.get('.ant-checkbox-inner').eq(2).click({force:true})
       cy.get('img[src="/static/approveTR.fcbbe348.svg"]').eq(0).click({force:true});
       cy.wait(3000)
       cy.get('.ant-checkbox-inner').eq(1).click({force:true})
       cy.get('.ant-checkbox-inner').eq(2).click({force:true})
       cy.get('img[src="/static/cancelTR.1d196678.svg"]').eq(0).click({force:true})
       cy.contains("Submit").click()
       cy.wait(5000);

     })
     it('logoff',()=>{
      cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
      .then(() =>{
        cy.contains('Logout').wait(2000).click({force:true});
       }); 
       cy.wait(5000);
   });

    it('chacking leave balance ,timeoff calender and holidays', () => {
        cy.get('#basic_userEmail.ant-input').type(Employee_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();
        cy.wait(3000);
        cy.contains("Timeoff").click({force:true});
        cy.contains('View Leave breakdown').click({force:true})
        cy.wait(2000);
        cy.scrollTo('center',{duration:3000})
        cy.wait(3000);
        cy.contains("Time off Calendar").click();
        cy.scrollTo('bottom',{duration:3000})
        cy.wait(3000)
        cy.get('img[src="/static/calendar_icon.3cdf2957.svg"]').click({force:true});
        cy.wait(3000)
        cy.scrollTo('bottom',{duration:3000})
        cy.contains('Holidays').click();
        cy.get('img[src="/static/calendar_icon.3cdf2957.svg"]').click({force:true});
        cy.wait(3000)
        cy.scrollTo('bottom',{duration:3000})
        cy.get('img[src="/static/list_icon.d28ad44d.svg"]').click({force:true});
        cy.wait(3000);
        cy.scrollTo('bottom',{duration:3000})
        cy.wait(5000)
    });
    it('logoff',()=>{
      cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
      .then(() =>{
        cy.contains('Logout').wait(2000).click({force:true});
       }); 
       cy.wait(3000);
   });
   it('checking search,filter,request_tabs in HR_manager profile',()=>{
    cy.get('#basic_userEmail.ant-input').type(HR_manager_email);
    cy.get('#basic_password.ant-input').type(password);
    cy.get('button[type="submit"]').click();
    cy.wait(3000);
    cy.contains("Timeoff").click({force:true});
    cy.contains('My Requests').click({force:true});
    cy.wait(3000)
    cy.contains('Team Requests').click({force:true});
    cy.wait(3000);
    cy.contains('Company Wide Requests').click({force:true});
    cy.get('img[src="/static/offboarding-filter.d7143a22.svg"]').click({force:true})
    cy.get('.ant-checkbox-inner').eq(13).click({force:true})
    cy.get('.ant-checkbox-inner').eq(14).click({force:true})
    cy.get('.ant-checkbox-inner').eq(15).click({force:true})
    cy.get('.ant-picker-input').eq(0).type('01.17.2022'+'{enter}')
    cy.get('.ant-picker-input').eq(1).type('01.25.2022'+'{enter}')
    cy.get('button[type="submit"]').click({force:true})
    cy.get('.ant-input-prefix').eq(1).type('anil')
    cy.wait(5000)
   })
   it('logoff',()=>{
    cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
    .then(() =>{
      cy.contains('Logout').wait(2000).click({force:true});
     }); 
     cy.wait(3000);
  });
  it('checking search,filter,request_tabs in Manager profile',()=>{
    cy.get('#basic_userEmail.ant-input').type(Manager_email);
    cy.get('#basic_password.ant-input').type(password);
    cy.get('button[type="submit"]').click();
    cy.wait(3000);
    cy.contains("Timeoff").click({force:true});
    cy.contains('My Requests').click({force:true});
    cy.wait(3000)
    cy.contains('Team Requests').click({force:true});
    cy.wait(3000);
    cy.get('img[src="/static/offboarding-filter.d7143a22.svg"]').click({force:true})
    cy.get('.ant-checkbox-inner').eq(13).click({force:true})
    cy.get('.ant-checkbox-inner').eq(14).click({force:true})
    cy.get('.ant-checkbox-inner').eq(15).click({force:true})
    cy.get('.ant-picker-input').eq(0).type('01.17.2022'+'{enter}')
    cy.get('.ant-picker-input').eq(1).type('01.25.2022'+'{enter}')
    cy.get('button[type="submit"]').click({force:true})
    cy.get('.ant-input-prefix').eq(1).type('anil')
   });
});
