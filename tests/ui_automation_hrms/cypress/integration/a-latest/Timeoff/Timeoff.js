const { eq } = require("lodash");
describe('Timeoff Automation', () => {
    before(() => {
      cy.visit('https://stghrms.paxanimi.ai/login');
    });
    let Manager_email= "khang.le@mailinator.com";
    let Employee_email = "lewis.nguyen@mailinator.com";
   // let HR_manager_email="sandeep@mailinator.com"
    let password = "12345678@Tc";
    
    it('Applying for leave request', () => {
        cy.get('#basic_userEmail.ant-input').type(Employee_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();
        cy.wait(3000);
        cy.contains("Timeoff").click({force:true});
        //cy.contains("Rejected").click();
        cy.contains('Request Time Off').click();
        cy.get('#basic_timeOffType').trigger('mousedown')
          .then(() => {
            cy.contains('Casual Leave').click();
          });
        cy.get('#basic_subject').type('function');
        let fromDate ="04/20/2022";         
        let toDate ="04/20/2022";
        cy.get('#basic_durationFrom ',{timeout:3000}).type(fromDate + '{enter}', {force: true});
         cy.get("#basic_durationTo", {timeout:3000}).type(toDate + '{enter}', {force: true});
        // cy.get('#basic_leaveTimeLists_0_startTime').type('9:00 am'+'{enter}',{force:true})
         //cy.get('#basic_leaveTimeLists_0_endTime').type('11:00 am'+'{enter}',{force:true})
        cy.get('#basic_description ').type('Attending function');
         cy.get('.ant-btn').then((resp)=>{
           cy.get(resp[2]).click();
         }).then(()=>{     
            cy.wait(10000);   
            cy.get('.ant-btn').then((resp)=>{
               cy.get(resp[4]).click();
               cy.wait(5000);
            });        
          });   
          cy.contains('View Request').click().then(()=>{
            cy.wait(3000);
            cy.get('p').then((resp)=>{
              cy.get(resp[0]).invoke('text').then((text)=>{
                let parts=text.split(' ');
                let moreparts=parts[2].split(']');
                let id_latest =moreparts[0];
                cy.writeFile("latest_id_timeoff.txt",id_latest);
                cy.wait(3000);
              });
            });
          });
    });

    it('logoff',()=>{
       cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
       .then(() =>{
         cy.contains('Logout').wait(2000).click({force:true});
        }); 
        cy.wait(3000);
    });

    it('Approve Timeoff request', () => {
        cy.get('#basic_userEmail.ant-input').type(Manager_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();
        cy.wait(3000);
        cy.contains("Timeoff").click({force:true});
        cy.wait(3000);
        cy.contains("Leave Requests").click();
        cy.contains('In Progress ').click();
        cy.wait(3000);
        cy.readFile("latest_id_timeoff.txt").then(function(value){
          //cy.get('.ant-pagination-item-link').eq(1).click();
          cy.log(value);
        
         cy.contains(value).click();
        });
        cy.wait(3000);
        cy.get('.ant-btn').then((resp)=>{
          cy.get(resp[1]).click();
        }).then(()=>{     
             cy.wait(5000);   
             cy.get('.ant-btn').then((resp)=>{
                cy.get(resp[2]).click();
                cy.wait(3000);
             });                            
          });
    });

    it('logoff',()=>{
      cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
      .then(() =>{
        cy.contains('Logout').wait(2000).click({force:true});
       }); 
       cy.wait(3000);
   });   

   it('Withdraw the leave request by employee', () => {
    cy.get('#basic_userEmail.ant-input').type(Employee_email);
    cy.get('#basic_password.ant-input').type(password);
    cy.get('button[type="submit"]').click();
    cy.wait(3000);
    cy.contains("Timeoff").click({force:true});
    cy.contains("Leave Requests").click();
    cy.wait(4000)
    cy.get('.ant-tabs-tab-btn').eq(9).click({force:true})
    cy.readFile("latest_id_timeoff.txt").then(function(value){
      cy.wait(3000)
      // cy.get('.ant-pagination-item-link').eq(1).click();
      // cy.get('.ant-pagination-item-link').eq(1).click();
      cy.log(value);
      cy.wait(3000);
      // cy.contains('button[type=">"]').click();
     
      cy.contains(value).click();
      cy.wait(3000);
    });
    cy.get('.ant-btn').then((resp)=>{
      cy.get(resp[0]).click();
    }).then(()=>{     
         cy.wait(5000);   
         cy.get('.ant-btn').then((resp)=>{
            cy.get(resp[2]).click();
               cy.wait(5000);
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
    
     it('Accepting the withdrawn leave request', () => {
     cy.get('#basic_userEmail.ant-input').type(Manager_email);
     cy.get('#basic_password.ant-input').type(password);
     cy.get('button[type="submit"]').click();
     cy.wait(3000);
    cy.contains("Timeoff").click({force:true});
    cy.wait(3000);
    cy.contains("Leave Requests").click();
    cy.contains('Progress').click();
    cy.wait(3000);
    cy.readFile("latest_id_timeoff.txt").then(function(value){
      // cy.get('.ant-pagination-item-link').eq(1).click();
      // cy.get('.ant-pagination-item-link').eq(1).click();
      cy.log(value);
      cy.contains(value).click();
    });
    cy.scrollTo('bottom', { duration: 2000 })
    cy.get('.ant-btn').then((resp)=>{
      cy.get(resp[1]).click();
    }).then(()=>{     
       cy.wait(5000);   
       cy.get('.ant-btn').then((resp)=>{
          cy.get(resp[1]).click();
          
       }); 
  });
           
    
  });
  it('logoff',()=>{
    cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
    .then(() =>{
      cy.contains('Logout').wait(2000).click({force:true});
     }); 
     cy.wait(3000);
 });
it('Applying for Special leave request', () => {
  cy.get('#basic_userEmail.ant-input').type(Employee_email);
  cy.get('#basic_password.ant-input').type(password);
  cy.get('button[type="submit"]').click();
  cy.wait(3000);
  cy.contains("Timeoff").click({force:true});
  cy.contains('Request Time Off').click();
  cy.get('#basic_timeOffType').trigger('mousedown')
    .then(() => {
      cy.contains('Wedding leave').click();
    });
  cy.get('#basic_subject').type('Marriage');
  let fromDate ="05/23/2022";         
  let toDate ="04/20/2022";
  cy.get('#basic_durationFrom ',{timeout:3000}).type(fromDate + '{enter}', {force: true});
   //cy.get("#basic_durationTo", {timeout:3000}).type(toDate + '{enter}', {force: true});
   //cy.pause();
  cy.get('#basic_description ').type('Attending function');
   cy.get('.ant-btn').then((resp)=>{
     cy.get(resp[2]).click();
   }).then(()=>{     
      cy.wait(10000);   
      cy.get('.ant-btn').then((resp)=>{
         cy.get(resp[4]).click();
         cy.wait(10000);
      });        
    });   
    cy.contains('Special Leave Requests').click();
    cy.contains('View Request').click().then(()=>{
      cy.wait(3000);
      cy.get('p').then((resp)=>{
        cy.get(resp[0]).invoke('text').then((text)=>{
          let parts=text.split(' ');
          let moreparts=parts[2].split(']');
          let id_latest =moreparts[0];
          cy.writeFile("latest_id_timeoff.txt",id_latest);
          cy.wait(3000);
        });
      });
    });
});

it('logoff',()=>{
 cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
 .then(() =>{
   cy.contains('Logout').wait(2000).click({force:true});
  }); 
  cy.wait(3000);
});

it('Approve Timeoff request', () => {
  cy.get('#basic_userEmail.ant-input').type(Manager_email);
  cy.get('#basic_password.ant-input').type(password);
  cy.get('button[type="submit"]').click();
  cy.wait(3000);
  cy.contains("Timeoff").click({force:true});
  cy.wait(3000);
  cy.contains("Special Leave Requests").click();
  //cy.contains('In Progress ').click();
  cy.wait(3000);
  cy.readFile("latest_id_timeoff.txt").then(function(value){
    //cy.get('.ant-pagination-item-link').eq(1).click();
    cy.log(value);
  
   cy.contains(value).click();
  });
  cy.wait(3000);
  cy.get('.ant-btn').then((resp)=>{
    cy.get(resp[1]).click();
  }).then(()=>{     
       cy.wait(5000);   
       cy.get('.ant-btn').then((resp)=>{
          cy.get(resp[2]).click();
          cy.wait(3000);
       });                            
    });
});

it('logoff',()=>{
cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
.then(() =>{
  cy.contains('Logout').wait(2000).click({force:true});
 }); 
 cy.wait(3000);
});   

it('Withdraw the leave request by employee', () => {
cy.get('#basic_userEmail.ant-input').type(Employee_email);
cy.get('#basic_password.ant-input').type(password);
cy.get('button[type="submit"]').click();
cy.wait(3000);
cy.contains("Timeoff").click({force:true});
cy.contains("Special Leave Requests").click();
cy.wait(4000)
cy.get('.ant-tabs-tab-btn').eq(9).click({force:true})
cy.readFile("latest_id_timeoff.txt").then(function(value){
cy.wait(3000)
// cy.get('.ant-pagination-item-link').eq(1).click();
// cy.get('.ant-pagination-item-link').eq(1).click();
cy.log(value);
cy.wait(3000);
// cy.contains('button[type=">"]').click();

cy.contains(value).click();
cy.wait(3000);
});
cy.get('.ant-btn').then((resp)=>{
cy.get(resp[0]).click();
}).then(()=>{     
   cy.wait(5000);   
   cy.get('.ant-btn').then((resp)=>{
      cy.get(resp[2]).click();
         cy.wait(5000);
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

it('Accepting the withdrawn leave request', () => {
cy.get('#basic_userEmail.ant-input').type(Manager_email);
cy.get('#basic_password.ant-input').type(password);
cy.get('button[type="submit"]').click();
cy.wait(3000);
cy.contains("Timeoff").click({force:true});
cy.wait(3000);
cy.contains("Special Leave Requests").click();
//cy.contains('Progress').click();
cy.wait(3000);
cy.readFile("latest_id_timeoff.txt").then(function(value){
// cy.get('.ant-pagination-item-link').eq(1).click();
// cy.get('.ant-pagination-item-link').eq(1).click();
cy.log(value);
cy.contains(value).click();
});
cy.scrollTo('bottom', { duration: 2000 })
cy.get('.ant-btn').then((resp)=>{
cy.get(resp[1]).click();
}).then(()=>{     
 cy.wait(5000);   
 cy.get('.ant-btn').then((resp)=>{
    cy.get(resp[1]).click();
    
 }); 
});
     

});
it('logoff',()=>{
  cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
  .then(() =>{
    cy.contains('Logout').wait(2000).click({force:true});
   }); 
   cy.wait(3000);
});

it('Applying for Work from home leave request', () => {
  cy.get('#basic_userEmail.ant-input').type(Employee_email);
  cy.get('#basic_password.ant-input').type(password);
  cy.get('button[type="submit"]').click();
  cy.wait(3000);
  cy.contains("Timeoff").click({force:true});
  cy.contains('Request Time Off').click();
  cy.get('#basic_timeOffType').trigger('mousedown')
    .then(() => {
      cy.contains('Unpaid Leave').click();
    });
  cy.get('#basic_subject').type('health issue');
  let fromDate ="05/02/2022";         
  let toDate ="05/02/2022";
  cy.get('#basic_durationFrom ',{timeout:3000}).type(fromDate + '{enter}', {force: true});
  cy.get("#basic_durationTo", {timeout:3000}).type(toDate + '{enter}', {force: true});
   //cy.pause();
  cy.get('#basic_description ').type('Attending function');
   cy.get('.ant-btn').then((resp)=>{
     cy.get(resp[2]).click();
   }).then(()=>{     
      cy.wait(10000);   
      cy.get('.ant-btn').then((resp)=>{
         cy.get(resp[4]).click();
         cy.wait(10000);
      });        
    });   
    cy.contains('LWP Requests').click();
    cy.contains('View Request').click().then(()=>{
      cy.wait(3000);
      cy.get('p').then((resp)=>{
        cy.get(resp[0]).invoke('text').then((text)=>{
          let parts=text.split(' ');
          let moreparts=parts[2].split(']');
          let id_latest =moreparts[0];
          cy.writeFile("latest_id_timeoff.txt",id_latest);
          cy.wait(3000);
        });
      });
    });
});

it('logoff',()=>{
 cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
 .then(() =>{
   cy.contains('Logout').wait(2000).click({force:true});
  }); 
  cy.wait(3000);
});

it('Approve Timeoff request', () => {
  cy.get('#basic_userEmail.ant-input').type(Manager_email);
  cy.get('#basic_password.ant-input').type(password);
  cy.get('button[type="submit"]').click();
  cy.wait(3000);
  cy.contains("Timeoff").click({force:true});
  cy.wait(3000);
  cy.contains("LWP Requests").click();
  //cy.contains('In Progress ').click();
  cy.wait(3000);
  cy.readFile("latest_id_timeoff.txt").then(function(value){
    //cy.get('.ant-pagination-item-link').eq(1).click();
    cy.log(value);
  
   cy.contains(value).click();
  });
  cy.wait(3000);
  cy.get('.ant-btn').then((resp)=>{
    cy.get(resp[1]).click();
  }).then(()=>{     
       cy.wait(5000);   
       cy.get('.ant-btn').then((resp)=>{
          cy.get(resp[2]).click();
          cy.wait(3000);
       });                            
    });
});

it('logoff',()=>{
cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
.then(() =>{
  cy.contains('Logout').wait(2000).click({force:true});
 }); 
 cy.wait(3000);
});   

it('Withdraw the leave request by employee', () => {
cy.get('#basic_userEmail.ant-input').type(Employee_email);
cy.get('#basic_password.ant-input').type(password);
cy.get('button[type="submit"]').click();
cy.wait(3000);
cy.contains("Timeoff").click({force:true});
cy.contains("LWP Requests").click();
cy.wait(4000)
cy.get('.ant-tabs-tab-btn').eq(9).click({force:true})
cy.readFile("latest_id_timeoff.txt").then(function(value){
cy.wait(3000)
// cy.get('.ant-pagination-item-link').eq(1).click();
// cy.get('.ant-pagination-item-link').eq(1).click();
cy.log(value);
cy.wait(3000);
// cy.contains('button[type=">"]').click();

cy.contains(value).click();
cy.wait(3000);
});
cy.get('.ant-btn').then((resp)=>{
cy.get(resp[0]).click();
}).then(()=>{     
   cy.wait(5000);   
   cy.get('.ant-btn').then((resp)=>{
      cy.get(resp[2]).click();
         cy.wait(5000);
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

it('Accepting the withdrawn leave request', () => {
cy.get('#basic_userEmail.ant-input').type(Manager_email);
cy.get('#basic_password.ant-input').type(password);
cy.get('button[type="submit"]').click();
cy.wait(3000);
cy.contains("Timeoff").click({force:true});
cy.wait(3000);
cy.contains("LWP Requests").click();
//cy.contains('Progress').click();
cy.wait(3000);
cy.readFile("latest_id_timeoff.txt").then(function(value){
// cy.get('.ant-pagination-item-link').eq(1).click();
// cy.get('.ant-pagination-item-link').eq(1).click();
cy.log(value);
cy.contains(value).click();
});
cy.scrollTo('bottom', { duration: 2000 })
cy.get('.ant-btn').then((resp)=>{
cy.get(resp[1]).click();
}).then(()=>{     
 cy.wait(5000);   
 cy.get('.ant-btn').then((resp)=>{
    cy.get(resp[1]).click();
    
 }); 
});
});
     
it('logoff',()=>{
       cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
       .then(() =>{
         cy.contains('Logout').wait(2000).click({force:true});
        }); 
        cy.wait(3000);
    });

it('Applying for Unpaid leave request', () => {
  cy.get('#basic_userEmail.ant-input').type(Employee_email);
  cy.get('#basic_password.ant-input').type(password);
  cy.get('button[type="submit"]').click();
  cy.wait(3000);
  cy.contains("Timeoff").click({force:true});
  cy.contains('Request Time Off').click();
  cy.get('#basic_timeOffType').trigger('mousedown')
    .then(() => {
      cy.contains('Work from Home').click();
    });
  cy.get('#basic_subject').type('work from home');
  let fromDate ="04/27/2022";         
  let toDate ="04/27/2022";
  cy.get('#basic_durationFrom ',{timeout:3000}).type(fromDate + '{enter}', {force: true});
  cy.get("#basic_durationTo", {timeout:3000}).type(toDate + '{enter}', {force: true});
   //cy.pause();
  cy.get('#basic_description ').type('Attending function');
   cy.get('.ant-btn').then((resp)=>{
     cy.get(resp[2]).click();
   }).then(()=>{     
      cy.wait(10000);   
      cy.get('.ant-btn').then((resp)=>{
         cy.get(resp[4]).click();
         cy.wait(10000);
      });        
    });   
    cy.contains('LWP Requests').click();
    cy.wait(3000)
    cy.contains('View Request').click().then(()=>{
      cy.wait(3000);
      cy.get('p').then((resp)=>{
        cy.get(resp[0]).invoke('text').then((text)=>{
          let parts=text.split(' ');
          let moreparts=parts[2].split(']');
          let id_latest =moreparts[0];
          cy.writeFile("latest_id_timeoff.txt",id_latest);
          cy.wait(3000);
        });
      });
    });
});

it('logoff',()=>{
 cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
 .then(() =>{
   cy.contains('Logout').wait(2000).click({force:true});
  }); 
  cy.wait(3000);
});

it('Approve Timeoff request', () => {
  cy.get('#basic_userEmail.ant-input').type(Manager_email);
  cy.get('#basic_password.ant-input').type(password);
  cy.get('button[type="submit"]').click();
  cy.wait(3000);
  cy.contains("Timeoff").click({force:true});
  cy.wait(3000);
  cy.contains("LWP Requests").click();
  //cy.contains('In Progress ').click();
  cy.wait(3000);
  cy.readFile("latest_id_timeoff.txt").then(function(value){
    //cy.get('.ant-pagination-item-link').eq(1).click();
    cy.log(value);
  
   cy.contains(value).click();
  });
  cy.wait(3000);
  cy.get('.ant-btn').then((resp)=>{
    cy.get(resp[1]).click();
  }).then(()=>{     
       cy.wait(5000);   
       cy.get('.ant-btn').then((resp)=>{
          cy.get(resp[2]).click();
          cy.wait(3000);
       });                            
    });
});

it('logoff',()=>{
cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
.then(() =>{
  cy.contains('Logout').wait(2000).click({force:true});
 }); 
 cy.wait(3000);
});   

it('Withdraw the leave request by employee', () => {
cy.get('#basic_userEmail.ant-input').type(Employee_email);
cy.get('#basic_password.ant-input').type(password);
cy.get('button[type="submit"]').click();
cy.wait(3000);
cy.contains("Timeoff").click({force:true});
cy.contains("LWP Requests").click();
cy.wait(4000)
cy.get('.ant-tabs-tab-btn').eq(9).click({force:true})
cy.readFile("latest_id_timeoff.txt").then(function(value){
cy.wait(3000)
// cy.get('.ant-pagination-item-link').eq(1).click();
// cy.get('.ant-pagination-item-link').eq(1).click();
cy.log(value);
cy.wait(3000);
// cy.contains('button[type=">"]').click();

cy.contains(value).click();
cy.wait(3000);
});
cy.get('.ant-btn').then((resp)=>{
cy.get(resp[0]).click();
}).then(()=>{     
   cy.wait(5000);   
   cy.get('.ant-btn').then((resp)=>{
      cy.get(resp[2]).click();
         cy.wait(5000);
   });                            
});
});

it('logoff',()=>{
cy.get('.account___1r_Ku').trigger('mousemove').click({force:true})
.then(() =>{
  cy.contains('Logout').wait(2000).click({force:true});
 }); 
 cy.wait(6000);
});  

it('Accepting the withdrawn leave request', () => {
cy.get('#basic_userEmail.ant-input').type(Manager_email);
cy.get('#basic_password.ant-input').type(password);
cy.get('button[type="submit"]').click();
cy.wait(3000);
cy.contains("Timeoff").click({force:true});
cy.wait(3000);
cy.contains("LWP Requests").click();
//cy.contains('Progress').click();
cy.wait(3000);
cy.readFile("latest_id_timeoff.txt").then(function(value){
// cy.get('.ant-pagination-item-link').eq(1).click();
// cy.get('.ant-pagination-item-link').eq(1).click();
cy.log(value);
cy.contains(value).click();
});
cy.scrollTo('bottom', { duration: 2000 })
cy.get('.ant-btn').then((resp)=>{
cy.get(resp[1]).click();
}).then(()=>{     
 cy.wait(5000);   
 cy.get('.ant-btn').then((resp)=>{
    cy.get(resp[1]).click();
    
 }); 
});
     

});
});
