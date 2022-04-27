

describe('customer management', () =>{
    before( () => {
        cy.visit('https://stghrms.paxanimi.ai/login');
        cy.login('sandeep@mailinator.com','12345678@Tc')
    });
    it('customer management', () =>{
        cy.contains('Customer Management').click({force:true});
        cy.wait(2000)
        cy.scrollTo('bottom').wait(2000)
        cy.get('[type="button"]').eq(3).click({force:true})
        cy.get('[type="button"]').eq(2).click({force:true})
        cy.scrollTo('top').wait(2000)
        cy.contains('10101').click();
        cy.wait(5000)
        cy.contains('Customer Management').click({force:true});
        cy.wait(8000)
        cy.contains('Kai Thị Hoàng Linh').trigger('mouseover', {force:true}).wait(2000);
        // cy.contains('View full profile').click();
        cy.get('.closeButton___3cknv').click({force:true})
        cy.contains('Add new customer').click({force:true})
        cy.add('preetha','terralogic','9502985592','preetha@terralogic.com','3-104','chittoor','chii','51712')
        cy.wait(2000)
        cy.add1('test')
        cy.wait(3000)
        cy.contains('Filter').click();
        cy.add_customer('Yen Yen')
        cy.wait(2000)
        cy.contains('Settings').click({force:true})
    })
    
});
