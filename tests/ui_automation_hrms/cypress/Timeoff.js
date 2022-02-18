const { eq } = require("lodash");
describe('Timeoff Automation', () => {
    before(() => {
      cy.visit('https://stghrms.paxanimi.ai/login');
    });
  
    let employee_email = "engineering-employee2@mailinator.com";
    let password = "12345678@Tc";
  
    it('sign in', () => {
        cy.get('#basic_userEmail.ant-input').type(employee_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();
  
        cy.wait(3000);
    
        cy.contains("Timeoff").click({force:true});
        cy.contains('Request Time Off').click();

        cy.get('#basic_timeOffType').trigger('mousedown')
          .then(() => {
            cy.contains('Sick Leave').click();
          });

        cy.get('#basic_subject').type('function');
        let fromDate ="12.27.21";         
        let toDate ="12.28.21";
        cy.get('#basic_durationFrom ',{timeout:3000}).type(fromDate + '{enter}', {force: true});
    
         cy.get("#basic_durationTo", {timeout:3000}).type(toDate + '{enter}', {force: true});

        cy.get('#basic_description ').type('Attending function');

         cy.get('.ant-btn').then((resp)=>{
           cy.get(resp[1]).click();
         }).then(()=>{     
            cy.wait(10000);   
            cy.get('.ant-btn').then((resp)=>{
               cy.get(resp[3]).click();
               cy.wait(10000);
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
                cy.pause();
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
    let employee_email1= "engineering-manager2@mailinator.com";
    let password1 = "12345678@Tc";
    

    it('Approve Timeoff', () => {
        cy.wait(3000);
        
        cy.get('#basic_userEmail.ant-input').type(employee_email1);
        cy.get('#basic_password.ant-input').type(password1);
        cy.get('button[type="submit"]').click();
        cy.wait(3000);
        cy.contains("Timeoff").click({force:true});
        cy.wait(3000);
        cy.contains("Leave Requests").click();
        cy.contains('In Progress ').click();
        cy.wait(3000);
        cy.readFile("latest_id_timeoff.txt").then(function(value){
          cy.log(value);
        
          cy.contains(value).click();

        });

        cy.wait(3000);
        
        cy.get('.ant-btn').then((resp)=>{
          cy.get(resp[1]).click();
        }).then(()=>{     
             cy.wait(10000);   
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
   it('sign in', () => {
    cy.get('#basic_userEmail.ant-input').type(employee_email);
    cy.get('#basic_password.ant-input').type(password);
    cy.get('button[type="submit"]').click();

    cy.wait(3000);
    cy.contains("Timeoff").click({force:true});
    cy.contains("Leave Requests").click();
    cy.contains("Approved").click();
    cy.readFile("latest_id_timeoff.txt").then(function(value){
      cy.log(value);
      cy.wait(3000);
      // cy.contains('button[type=">"]').click();
      cy.contains(value).click();
      cy.wait(3000);
    });
    cy.pause();
    cy.get('.ant-btn').then((resp)=>{
      cy.get(resp[1]).click();
    }).then(()=>{     
         cy.wait(10000);   
         cy.get('.ant-btn').then((resp)=>{
            cy.get(resp[2]).click();
         });                            
      });

   }); 
    
});