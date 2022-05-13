describe('Ticket Management', () => {
  before(() => {
    cy.visit('https://stghrms.paxanimi.ai/login');
  });

  let employee_email = 'narmada.biradar@mailinator.com';
  let password = '12345678@Tc';

  it('Add Tickets in HR Mngr', () => {
    cy.get('#basic_userEmail.ant-input').type(employee_email);
    cy.get('#basic_password.ant-input').type(password);
    cy.get('button[type="submit"]').click();
    cy.wait(1000);
    cy.contains('Home').click({ force: true });
    cy.wait(3000);
    cy.get('.ant-dropdown-trigger.action___3ut1O.notify___2Rxx5')
      .click({
        force: true,
      })
      .wait(2000);
    cy.contains('Raise Ticket').click({ force: true }).wait(8000);
    cy.get('#basic_supportTeam.ant-select-selection-search-input')
      .click({ force: true })
      .wait(3000);
    cy.get('.ant-select-item-option-content').eq(0).click({ force: true }).wait(2000);
    cy.get('#basic_queryType.ant-select-selection-search-input').click({ force: true }).wait(1500);
    cy.get('.ant-select-item-option-content').eq(6).click({ force: true }).wait(1500);
    cy.get('#basic_priority.ant-select-selection-search-input').click({ force: true }).wait(1500);
    cy.get('.ant-select-item-option-content').eq(10).click({ force: true }).wait(1500);
    cy.get('#basic_subject.ant-input').type('Testing Ticket Management').wait(1500);
    cy.get('#basic_description.ant-input').type('Testing Ticket Management').wait(1500);
    cy.get('.ant-btn.ant-btn-primary.btnSubmit___3MTaI').click({ force: true }).wait(1500);
    cy.contains('Ticket Management').click({ force: true }).wait(2000);
    cy.get('.ant-dropdown-trigger').eq(6).click({ force: true }).wait(2000);
    cy.get(
      '.ant-dropdown-menu-item.ant-dropdown-menu-item-active.ant-dropdown-menu-item-only-child',
    )
      .eq(1)
      .click({ force: true })
      .wait(2000);
    cy.get('.ant-tabs-tab-btn').eq(3).click({ force: true }).wait(2000);
    cy.get('.ant-pagination-item-link').eq(1).click({ force: true }).wait(2000);
  });
  it('logoff And Login HR', () => {
    cy.get('.account___1r_Ku')
      .trigger('mousemove')
      .click({ force: true })
      .then(() => {
        cy.contains('Logout').wait(2000).click({ force: true }).wait(2000);
        cy.get('#basic_userEmail.ant-input').type('pooja.bm@mailinator.com');
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click({ force: true }).wait(2000);
        cy.contains('Ticket Management').click({ force: true }).wait(2000);
        cy.get('.ant-tabs-tab-btn').eq(1).click({ force: true }).wait(2000);
        cy.get('.ticketID___p7dyV').eq(4).click({ force: true }).wait(2000);
        cy.get('.note__textareaContent___2S9ir').type('Ticket In progress').wait(2000);
        cy.get('.ant-btn.btnSend___1IRR6').click({ force: true });
        cy.get('.ant-select-selection-item').eq(0).click({ force: true }).wait(2000);
        cy.get('.ant-select-item-option-content').eq(1).click({ force: true }).wait(2000);
        cy.get('.ant-btn.btnUpdate___1QQ4t').click({ force: true }).wait(2000);
        cy.contains('Ticket Management').click({ force: true }).wait(2000);
        cy.get('.ant-tabs-tab-btn').eq(1).click({ force: true }).wait(2000);
        cy.get('.ant-tabs-tab-btn').eq(3).click({ force: true }).wait(2000);
        cy.get('.ticketID___p7dyV').eq(2).click({ force: true }).wait(2000);
        cy.get('.note__textareaContent___2S9ir').type('Clint Pending').wait(2000);
        cy.get('.ant-btn.btnSend___1IRR6').click({ force: true });
        cy.get('.ant-select-selection-search').click({ force: true }).wait(2000);
        cy.get('.ant-select-item-option-content').eq(2).click({ force: true }).wait(2000);
        cy.get('.ant-btn.btnUpdate___1QQ4t').click({ force: true }).wait(2000);
        cy.contains('Ticket Management').click({ force: true }).wait(2000);
        cy.get('.ant-tabs-tab-btn').eq(1).click({ force: true }).wait(2000);
        cy.get('.ant-tabs-tab-btn').eq(4).click({ force: true }).wait;
        cy.get('.ticketID___p7dyV').eq(0).click({ force: true }).wait(2000);
        cy.get('.note__textareaContent___2S9ir').type('Ticket Resloved ').wait(2000);
        cy.get('.ant-btn.btnSend___1IRR6').click({ force: true });
        cy.get('.ant-select-selection-search').click({ force: true }).wait(2000);
        cy.get('.ant-select-item-option-content').eq(3).click({ force: true }).wait(2000);
        cy.get('.ant-btn.btnUpdate___1QQ4t').click({ force: true }).wait(2000);
        cy.contains('Ticket Management').click({ force: true }).wait(2000);
        cy.get('.ant-tabs-tab-btn').eq(1).click({ force: true }).wait(2000);
      });
  });
  it('logoff And Login HR Manager', () => {
    cy.get('.account___1r_Ku')
      .trigger('mousemove')
      .click({ force: true })
      .then(() => {
        cy.contains('Logout').wait(2000).click({ force: true }).wait(2000);
        cy.get('#basic_userEmail.ant-input').type('narmada.biradar@mailinator.com');
        cy.get('#basic_password.ant-input').type(password);
        cy.get('button[type="submit"]').click({ force: true }).wait(2000);
        cy.contains('Ticket Management').click({ force: true }).wait(2000);
        cy.get('.ant-tabs-tab-btn').eq(1).click({ force: true }).wait(2000);
        cy.get('.ant-tabs-tab-btn').eq(3).click({ force: true }).wait(2000);
        cy.get('.ant-tabs-tab-btn').eq(4).click({ force: true }).wait(2000);
        cy.get('.ant-tabs-tab-btn').eq(5).click({ force: true }).wait(2000);
        cy.get('.ant-tabs-tab-btn').eq(6).click({ force: true }).wait(2000);
        cy.get('.ticketID___2v9Be').eq(5).click({ force: true }).wait(2000);
        cy.get('.note__textareaContent___2S9ir').type('Ticket Closed').wait(2000);
        cy.get('.ant-btn.btnSend___1IRR6').click({ force: true });
        cy.get('.ant-select-selection-search').click({ force: true }).wait(2000);
        cy.get('.ant-select-item-option-content').eq(4).click({ force: true }).wait(2000);
        cy.get('.ant-btn.btnUpdate___1QQ4t').click({ force: true }).wait(2000);
        cy.contains('Ticket Management').click({ force: true }).wait(2000);
        cy.get('.ant-tabs-tab-btn').eq(7).click({ force: true }).wait(2000);
      });
  });
});
