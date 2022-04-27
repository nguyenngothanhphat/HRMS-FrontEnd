// <reference types="cypress" />

const { Select, Input } = require("antd");
const { default: TextArea } = require("antd/lib/input/TextArea");

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
     it('Click The Directory', ()=> {   
        cy.contains("Directory").click({force:true});
        cy.wait(2000);  
        //Click the Filter tab
        cy.contains("Filter").click({force:true});
        cy.wait(2000);
        // cy.get('#filter_employeeId.ant-select-selection-search-input').trigger('mousedown').then(()=>{
        // cy.contains('19980').click({force:true});
        // cy.contains("Apply").click();
        // cy.wait(2000);
        // cy.contains("Clear").click();
        cy.get('.ant-select-selection-overflow').eq(0).trigger('mousedown').then(()=>{
        cy.wait(4000);
          cy.contains('Accounting').click({force:true});
        cy.wait(2000)
        cy.get('.anticon.anticon-close').click({force:true})
  
        cy.get('.ant-select-selection-overflow').eq(2).click().wait(2000)
        cy.contains('Sys Admin').click({force: true})
        cy.wait(2000)
        cy.get('.anticon.anticon-close').click({force:true})


        cy.get('.ant-select-selection-overflow').eq(4).click({force:true}).wait(2000)
        cy.contains('India').click({force:true})
        cy.wait(2000);
        cy.get('.anticon.anticon-close').click({force:true})
        
        
        // cy.get('.ant-select-selection-overflow').eq(5).click({force:true}).wait(2000)
        // cy.contains('Full Time').click({force:true})
        // cy.wait(2000);
        // cy.get('.anticon.anticon-close').click({force:true})

        

        cy.get('.ant-select-selection-overflow').eq(6).click().wait(2000)
        cy.contains('UI test').click({force: true})
        cy.wait(2000)
        cy.get('.anticon.anticon-close').click({force:true})

         cy.get('#filter_fromExp.ant-input-number-input').type(2);
        cy.wait(2000);
        cy.get('#filter_toExp.ant-input-number-input').type(4);
 

        
        
        

        // cy.get('.ant-select-selection-overflow-item.ant-select-selection-overflow-item-suffix').eq(2).trigger('mousedown').then(()=>{
        // cy.wait(2000);
        // cy.contains('Sys Admin').click({force:true});
        // cy.wait(4000);
        // cy.get('.anticon.anticon-close').click({force: true}).


        // cy.get('.ant-select-selection-overflow-item.ant-select-selection-overflow-item-suffix').eq(3).trigger('mousedown').then(()=>{
        // cy.wait(3000);
        // cy.contains('Hari A').click({force:true}); 
        // cy.wait(3000);
        // cy.get('.anticon.anticon-close').click({force:true});
        
        // cy.get('.ant-select-selection-overflow-item.ant-select-selection-overflow-item-suffix').eq(4).trigger('mousedown').then(()=>{
        // cy.wait(3000);
        // cy.contains('India').click({force:true}); 
        // cy.wait(3000);
        // cy.get('.anticon.anticon-close').click({force:true})
        // cy.wait(2000); 
         
        
        //  cy.get('.ant-select-selection-overflow-item.ant-select-selection-overflow-item-suffix').eq(6).trigger('mousedown').then(()=>{
        //  cy.wait(2000);
        //  cy.contains('Presentation').click({force:true});
        //  cy.wait(2000);
        //  cy.get('.anticon.anticon-close').click({force:true});
        
        // cy.get('#filter_fromExp.ant-input-number-input').type(2);
        // cy.wait(2000);
        // cy.get('#filter_toExp.ant-input-number-input').type(4);
 
         
         }); 
        });
         });
          // });
   //});
   
   
        //});