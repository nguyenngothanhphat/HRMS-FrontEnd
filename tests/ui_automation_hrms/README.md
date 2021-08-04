## About

* Cypress demo code that automates the "Time Off" flow for the HRMS application.

* This directory uses the same file structure that Cypress comes with. There are a few extra files I created, and a few extra commands that I added to make the code more modular.

* Common Functions / Methods that may be reused were added as Cypress commands and can be found under "cypress/support/index.js".

* I added variables such as the email addresses of the employee and the manager, and the password, as environment variables in "cypress.json" and are used in the JS files with Cypress tests, without the need for hard-coding these values in the test code.

* There are two JS files with Cypress tests: 
    * timeoff.spec.js : The JS file with the actual Time off automation test code.
    * failure.spec.js : The JS file with the code to demonstrate how Cypress handles errors.