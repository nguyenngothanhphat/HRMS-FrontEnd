// <reference types="cypress" />

const { Select, Input } = require("antd");

describe('HRMS URL', () => {
    before(() => {
      cy.visit('https://stghrms.paxanimi.ai/login');
    });
  
    let employee_email = "comp1-hr-manager@mailinator.com";
    let password = "12345678@Tc";
    
  
    it('Login HR', () => {
      
  
        cy.get('#basic_userEmail.ant-input').type(employee_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();
    
    });    
    // it('Click The Directory', () => {

    
    //     cy.contains("Directory").click({force:true});
    //     cy.wait(2000); 
    // }); 
     it('Click The Directory', ()=> {   
        cy.contains("Directory").click({force:true});
        cy.wait(2000);  
        //Click the Filter tab
        cy.contains("Filter").click({force:true});
        cy.wait(1000);
        //search the Name Of employee
        cy.get('.ant-input.formInput___1ZlYR').type('sravan');
        cy.wait(2000);
        cy.contains("Reset").click();
        cy.wait(2000);
        //Select the Title of Employees of list
        cy.get('.ant-select.formSelectTitle___TbiTl.ant-select-single.ant-select-allow-clear.ant-select-show-arrow.ant-select-show-search').trigger('mousedown').then(()=>{
        cy.contains('HR Manager').click();
        cy.wait(2000);
        cy.contains("Reset").click();
        cy.wait(2000);
        cy.get('.ant-select.formSelect___2f-NS.ant-select-multiple.ant-select-allow-clear.ant-select-show-arrow.ant-select-show-search').eq(0).trigger('mousedown').then(()=>{
        cy.contains('Finance').click({force:true});
        cy.wait(2000);
        cy.contains("Reset").click();
        cy.wait(2000);

        cy.get('.ant-select.formSelect___2f-NS.ant-select-multiple.ant-select-allow-clear.ant-select-show-arrow.ant-select-show-search').eq(1).trigger('mousedown').then(()=>{
        cy.contains('Presentation').click();
        cy.wait(2000);
         cy.contains("Reset").click();
         cy.wait(4000);
        //Select Interns Time Employeer
        cy.contains("Interns").click();
        cy.wait(2000);
        cy.contains("Reset").click();
        cy.wait(2000);
        //Select Part Time Employeer
        cy.contains("Part Time").click();
        cy.wait(2000);
        cy.contains("Reset").click();
        cy.wait(2000);
        //Select Full Time Employeer
        cy.contains("Full Time").click();
        cy.wait(2000);
        cy.contains("Reset").click();
        cy.wait(2000);
        // Selsect a page Number
        cy.get('.ant-select.ant-select-sm.ant-pagination-options-size-changer.ant-select-single.ant-select-show-arrow').trigger('mousedown').then(()=>{
        cy.contains('25 / page').click();
        cy.wait(4000);
        //Log Out        
        cy.get('.ant-dropdown-trigger.action___3ut1O.account___1r_Ku').trigger('mousemove')
        .click({force:true})
        .then(() =>{
        cy.contains('Logout').wait(2000).click({force:true});
        });
       });
     });

        });                
    }); 

});
});  
  
        
      
// describe('HRMS URL', () => {
//   before(() => {
//     cy.visit('https://stghrms.paxanimi.ai/login');
//   });
//       let employee_email = "engineering-employee@mailinator.com";
//       let password = "12345678@Tc";


//       it('Login HR', () => {


//       cy.get('#basic_userEmail.ant-input').type(employee_email);
//       cy.get('#basic_password.ant-input').type(password);
//       cy.get('button[type="submit"]').click();

//       });    
       
//       it('Click The Directory', ()=> {   
//       cy.contains("Directory").click({force:true});
//       cy.wait(2000);  
//       //Click the Filter tab
//       cy.contains("Filter").click({force:true});
//       cy.wait(1000);
//       });
//     });

//       //search the Name Of employee
//       cy.get('.ant-input.formInput___1ZlYR').type('sravan');
//       cy.wait(2000);
//       cy.contains("Reset").click();
//       cy.wait(2000);
//       //Select the Title of Employees of list
//       cy.get('.ant-select.formSelectTitle___TbiTl.ant-select-single.ant-select-allow-clear.ant-select-show-arrow.ant-select-show-search').trigger('mousedown').then(()=>{
//       cy.contains('HR Manager').click();
//       cy.wait(2000);
//       cy.contains("Reset").click();
//       cy.wait(2000);
//       cy.get('.ant-select.formSelect___2f-NS.ant-select-multiple.ant-select-allow-clear.ant-select-show-arrow.ant-select-show-search').eq(0).trigger('mousedown').then(()=>{
//       cy.contains('Finance').click({force:true});
//       cy.wait(2000);
//       cy.contains("Reset").click();
//       cy.wait(2000);

//       cy.get('.ant-select.formSelect___2f-NS.ant-select-multiple.ant-select-allow-clear.ant-select-show-arrow.ant-select-show-search').eq(1).trigger('mousedown').then(()=>{
//       cy.contains('Presentation').click();
//       cy.wait(2000);
//       cy.contains("Reset").click();
//       cy.wait(4000);
//       //Select Interns Time Employeer
//       cy.contains("Interns").click();
//       cy.wait(2000);
//       cy.contains("Reset").click();
//       cy.wait(2000);
//       //Select Part Time Employeer
//       cy.contains("Part Time").click();
//       cy.wait(2000);
//       cy.contains("Reset").click();
//       cy.wait(2000);
//       //Select Full Time Employeer
//       cy.contains("Full Time").click();
//       cy.wait(2000);
//       cy.contains("Reset").click();
//       cy.wait(2000);
//       // Selsect a page Number
//       cy.get('.ant-select.ant-select-sm.ant-pagination-options-size-changer.ant-select-single.ant-select-show-arrow').trigger('mousedown').then(()=>{
//       cy.contains('25 / page').click();
//       cy.wait(4000);
//       //Log Out        
//       cy.get('.ant-dropdown-trigger.action___3ut1O.account___1r_Ku').trigger('mousemove')
//       .click({force:true})
//       .then(() =>{
//       cy.contains('Logout').wait(2000).click({force:true});
//       });
//       });
//       });

//       });                
//       }); 

//       });

//     });