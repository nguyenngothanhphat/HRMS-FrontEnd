///<reference types="cypress" />


describe('Timeoff Automation', ()=>{
    before(() => {      // this code ensures that it visits the following URL before running the tests
        cy.visit('https://stghrms.paxanimi.ai/login');
    });

    let employee_email = "comp1-employee-hre@mailinator.com";
    let manager_email = "comp1-hr-manager@mailinator.com";
    let password = '12345678@Tc';


    it ('Applies For and Accepts Timeoff', ()=> {
        cy.pause();
    
        cy.get('#basic_email.ant-input').type(employee_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();

        cy.wait(3000); // waiting for page to load

        cy.contains("Timeoff").click();

        cy.wait(3000); // waiting for page to load

        cy.pause();

        cy.contains("Request Time Off").click();

        cy.wait(4000); // waiting for page to load

        cy.get("#basic_timeOffType").trigger('mousemove').click().then(()=>{
            cy.contains("Casual Leave").click();
        });

        cy.get("#basic_subject").type("Leave Application");


        let fromDate = "07.19.21";
        let toDate = "07.20.21";
        cy.get("#basic_durationFrom").type(fromDate, {force: true});
        cy.get("#basic_durationTo").type(toDate, {force: true});

        cy.get("#basic_description").type("Renovating house. Would appreciate 2 days off.");

        cy.pause(); // Login as employee and apply for leave.

        cy.get(".ant-btn").then((resp)=>{
            cy.get(resp[1]).click();
        }).then(()=>{
            cy.wait(10000);
            cy.get(".ant-btn").then((resp)=>{
                cy.get(resp[3]).click();
            });
        });

        cy.contains("View Request").click().then(()=>{
            cy.wait(3000); // waiting for page to fully load
            cy.get("p").then((response)=>{
                cy.get(response[0]).invoke('text').then((text)=>{
                    let parts = text.split(' ');
                    let moreparts = parts[2].split(']');
                    let id_latest = moreparts[0];

                    cy.writeFile("latest_id_timeoff.txt", id_latest);
                });
            });
        });

        cy.get(".ant-dropdown-trigger").then((resp)=>{
            cy.get(resp[1]).trigger('mousemove').click();
            cy.contains("Logout").click();
        });

        cy.get('#basic_email.ant-input').type(manager_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();

        cy.wait(2000); // waiting for page to load
        cy.contains("Timeoff").click();

        cy.readFile("latest_id_timeoff.txt").then((text)=>{
            cy.wait(3000); // waiting for page to load
            cy.contains(text).click();
            cy.wait(2000); // waiting for page to load

            cy.pause(); // Login as manager and approve it.

            cy.contains("Accept").click();
        });

        cy.get(".ant-dropdown-trigger").then((resp)=>{
            cy.get(resp[1]).trigger('mousemove').click();
            cy.contains("Logout").click();
        });
        

    });

    it ("Restores Leave Count", () => {

        cy.get('#basic_email.ant-input').type(employee_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();

        cy.wait(3000); // waiting for page to load
        cy.contains("Timeoff").click();

        cy.wait(3000); // waiting for page to load

        cy.pause();  // Login as the employee and verify approval.

        cy.contains("Approved").click();

        cy.wait(3000);

        cy.readFile("latest_id_timeoff.txt").then((text)=>{
            cy.wait(3000); // waiting for page to load
            cy.contains(text).click();
            cy.wait(3000); // waiting for page to load
            cy.contains("Withdraw").click();
            cy.wait(2000);

            cy.pause(); // Apply for withdrawal.

            cy.get("textarea").then((resp)=>{
                cy.get(resp[0]).type("Renovation postponed. Will save for later.", {force:true});
                cy.contains("Submit").click();
            })
        });

        cy.wait(10000); // waiting for request to be sent

        cy.contains("Dashboard").click();
        
        cy.get(".ant-dropdown-trigger").then((resp)=>{
            cy.get(resp[1]).trigger('mousemove').click();
            cy.contains("Logout").click();
        });

        cy.wait(3000);
        cy.get('#basic_email.ant-input').type(manager_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();
        
        cy.wait(3000); // waiting for page to load
        cy.contains("Timeoff").click();

        cy.wait(3000);

        cy.contains("Withdraw").click();

        cy.wait(3000);

        cy.readFile("latest_id_timeoff.txt").then((text)=>{
            cy.wait(3000); // waiting for page to load
            cy.contains(text).click();
            cy.wait(3000); // waiting for page to load

            cy.pause(); // Login as manager and approve withdrawal request.

            cy.contains("Accept withdraw").click();
            cy.wait(10000);
            cy.contains("OK").click();
        });

        cy.get(".ant-dropdown-trigger").then((resp)=>{
            cy.get(resp[1]).trigger('mousemove').click();
            cy.contains("Logout").click();
        });

        cy.wait(3000);
        cy.get('#basic_email.ant-input').type(employee_email);
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click();


        cy.wait(3000); // waiting for page to load

        cy.contains("Timeoff").click();

        cy.wait(3000); // waiting for page to load

        cy.pause(); // Finally, log in as employee and verify approval of withdrawal.

    });

});




