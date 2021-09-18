///<reference types="cypress" />

let password = Cypress.env("password");


// Due to Cypress' limitations of only being able to run one tab/window at a time, even activating all the employees in a 40 man company takes about 10 minutes to complete.


// Before running this script:
// 1. Sign up with an email as admin.
// 2. Generate a CSV file with employees using the python script in tests/scale_testing/Employee_Spreadsheet_Generator/.
// 3. Use the import employees option on the UI to import employees from the CSV file generated in step 2.
// 4. Move the CSV file into the cypress/fixtures/ folder.
// 5. Set the variable "csvfilename" below to the name of your CSV file that you want to import employees from. 
// 6. Set the variable "number_of_employees" to the number of employees in your CSV file.


let csvfilename = "<YOUR_CSV_FILE>.csv"; // this is an example value. Change it to be accurate to your case.

let number_of_employees = 40;   // this is an example value. Change it to be accurate to your case.





let arr = [];

describe("Get employees", () => {
    it('Doing it', () => {
        cy.pause();

        // the python script called below parses a CSV file and builds a list of employees
        let cmd = "python cypress/integration/verify_employees/get_work_emails.py cypress/fixtures/" + csvfilename;

        // cy.pause();

        cy.exec(cmd).then((resp) => {
            let strarr = resp.stdout;
            let newstr = "";
            
            for (let i = 0; i < strarr.length; i++){
                if (strarr[i] != "'"){
                    newstr += strarr[i];
                }
                else{
                    newstr += '"';
                }
            }
        
            arr = JSON.parse(newstr);

            cy.writeFile("arr_of_emps.txt", arr);
            cy.writeFile("total_number.txt", String(arr.length));

            number_of_employees = arr.length;
        
            console.log(arr);
        
        });
    });

});




for (let i = 0; i < number_of_employees; i++){

    describe('To be done', () => {
        it ('Gets account creation verification link', ()=> {

            cy.readFile("arr_of_emps.txt").then((resp)=>{
                let emps = JSON.parse(resp);
                cy.writeFile("cur_email.txt", emps[i]);
            });

            cy.visit("https://www.mailinator.com/");
            
            cy.readFile('cur_email.txt').then((resp) => {
                let cur_email = resp;

                let search_keyword = cur_email.split('@');
                console.log(search_keyword[0]);

                cy.get("#addOverlay", {timeout: 8000}).type(search_keyword[0]);
                cy.get("#go-to-public").click();


                cy.contains("hrms", {timeout: 8000}).click();


            }).then(()=>{
                cy.contains("VERIFY EMAIL").dblclick({force: true});
                cy.get("#pills-json-tab").get("pre").invoke('text').then((text)=>{
                    let obj = JSON.parse(text);
                    let large_text = obj.parts[0].body;
        
                    let code_regex_string = /\S*(www.mailinator.com)\S*/;
                    let matched = large_text.match(code_regex_string);
                    let matched_parts = matched[0].split('"')
                    console.log(matched_parts[1]);

                    let verify_link = matched_parts[1];
                    return verify_link;
                    }).then((return_val)=>{
                        cy.writeFile('verify_account_link.txt', return_val)
                });
            });

        });

        it ('Verifies account creation', ()=> {
            let link_to_visit;

            cy.readFile('verify_account_link.txt').then((resp)=>{
                link_to_visit = resp;
            }).then(()=>{
                cy.visit(link_to_visit);
                cy.contains("LOGIN", {timeout: 8000}).click({force: true});
            });

        });

        it ('Gets account credentials', ()=> {

            cy.visit("https://www.mailinator.com/");

            cy.readFile('cur_email.txt').then((resp) => {
                let cur_email = resp;

                let search_keyword = cur_email.split('@');
                console.log(search_keyword[0]);



                cy.wait(2000); //waiting for the email with the creds to be sent




                cy.get("#addOverlay", {timeout: 8000}).type(search_keyword[0]);
                cy.get("#go-to-public").click();
                cy.contains("hrms", {timeout: 8000}).click();
            }).then(()=>{
                cy.get("#pills-json-tab").get("pre").invoke('text').then((text)=>{
                    let obj = JSON.parse(text);
                    let large_text = obj.parts[0].body;

                    let code_regex_string = /\>[<0-9A-Za-z>]{8}\</;
                    let matched = large_text.match(code_regex_string);
                    console.log(matched);
                    let genword = matched[0].substring(1, matched[0].length - 1);
                    console.log(genword);
                    return genword;
                }).then((return_val)=>{
                    cy.writeFile('generated_password.txt', return_val)
                });
            });

        });

        it ('Change password', ()=> {

            cy.visit('https://stghrms.paxanimi.ai/login');

            cy.readFile("cur_email.txt").then((email)=> {
                cy.readFile("generated_password.txt").then((pwd)=>{
                    cy.loginAsSomeone(email, pwd).then(()=>{
                        cy.get('#basic_currentPassword.ant-input', {timeout:8000}).type(pwd);
                        cy.get('#basic_newPassword.ant-input', {timeout:8000}).type(password);
                        cy.get('#basic_confirmPassword.ant-input', {timeout:8000}).type(password);
                        cy.contains('Change password', {timeout:8000}).click();
                    });
                }) 
            });

        });
    });
};
