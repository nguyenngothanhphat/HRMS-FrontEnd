
const { eq } = require("lodash");
let Employee_email="lewis.nguyen@mailinator.com";
let Manager_email="khang.le@mailinator.com";
let password="12345678@Tc";
let startDate1='7:00 pm';
let endDate1='9:00 pm';
let startDate='6:00 am';
let endDate='7:00 am';
describe('Timesheet',()=>{
   before(()=>{
       cy.visit('https://stghrms.paxanimi.ai/login');
   });
  
   it('creating a timesheet and importing ', () => {
       
       cy.loginAsSomeone(Manager_email,password);
       cy.wait(3000)
       cy.contains("Timesheet").click({force:true});
       cy.get('img[src="/static/prev.70a7a235.svg"]').click({force:true});
       cy.contains("Add Task").click({force:true})
       .then(()=>{
           cy.CreatingTimesheet(startDate,endDate);
           cy.CreatingTimesheet(startDate1,endDate1);
           cy.get('img[src="/static/next.a010f3e5.svg"]').click({force:true});
           cy.contains('Import').click({force:true});
           cy.wait(3000)
           cy.get('.icon___pFaX8').eq(1).click({force:true});
           cy.wait(3000);
           cy.get('.ant-checkbox-inner').eq(0).click({force:true});
           cy.get('.ant-btn.ant-btn-primary.btnSubmit___OG7Vc').click({force:true});
           cy.wait(3000)
           cy.contains('Weekly').click({force:true});
           cy.wait(4000);
           cy.contains('Monthly').click({force:true})
           cy.wait(4000);
           cy.logout(); 


      
       });
   });
    
      
    it('Deleting the timesheet',()=>{
       cy.loginAsSomeone(Manager_email,password);
       cy.contains("Timesheet").click({force:true});
       cy.wait(5000);
       cy.DeletingTimesheet();
       cy.get('img[src="/static/prev.70a7a235.svg"]').click({force:true});
       cy.wait(3000);
       cy.get('img[src="/static/next.a010f3e5.svg"]').click({force:true});
       cy.wait(3000);
       cy.DeletingTimesheet();;
       cy.get('img[src="/static/prev.70a7a235.svg"]').click({force:true});
       cy.wait(3000);
       cy.DeletingTimesheet();
       cy.DeletingTimesheet();
       cy.wait(3000);
       cy.contains("Request Leave").click({force:true})
       cy.wait(1000)
       cy.contains('Continue').click({force:true})
        
     });
     
    
 });