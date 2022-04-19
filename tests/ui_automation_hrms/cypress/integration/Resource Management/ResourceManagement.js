const { takeRight } = require('lodash');
const { eq } = require('lodash');

describe('ResourceManagement Automation', () => {
  before(() => {
    cy.visit('https://stghrms.paxanimi.ai/login');
  });

  let employee_email = 'narmada.biradar@mailinator.com';
  let password = '12345678@Tc';

  it('Resource Management', () => {
    cy.get('#basic_userEmail.ant-input').type(employee_email);
    cy.get('#basic_password.ant-input').type(password);
    cy.get('button[type="submit"]').click();
    cy.wait(2000);
    cy.contains('Resource Management').click({ force: true });
    cy.wait(2000);
    cy.contains('Resources').click();
    cy.wait(2000);

    cy.contains('Name').click({ force: true });
    cy.wait(2000);
    cy.contains('Name').click({ force: true });
    cy.wait(2000);
    cy.contains('Name').click({ force: true });
    cy.wait(2000);

    cy.contains('Division').click({ force: true });
    cy.wait(2000);
    cy.contains('Division').click({ force: true });
    cy.wait(2000);
    cy.contains('Division').click({ force: true });
    cy.wait(2000);

    cy.contains('Designation').click({ force: true });
    cy.wait(2000);
    cy.contains('Designation').click({ force: true });
    cy.wait(2000);
    cy.contains('Designation').click({ force: true });
    cy.wait(2000);

    cy.contains('Experience').click({ force: true });
    cy.wait(2000);
    cy.contains('Experience').click({ force: true });
    cy.wait(2000);
    cy.contains('Experience').click({ force: true });
    cy.wait(2000);

    cy.get('.anticon.anticon-plus-circle').eq(1).click({ force: true });
    cy.wait(2000);
    cy.get('.ant-input').eq(2).type('Good Work');
    cy.wait(2000);
    cy.get('.anticon.anticon-close.ant-modal-close-icon').eq(0).click({ force: true });
    cy.wait(2000);
    cy.get('.buttonAdd___3D70J').eq(1).click({ force: true });
    cy.wait(2000);
    cy.get('.ant-form-item-control-input-content').eq(1).click();
    cy.wait(2000);
    cy.get('.ant-select-item-option-content').eq(2).click();
    cy.wait(1000);
    cy.get('.ant-form-item-control-input-content').eq(2).click();
    cy.wait(1000);
    cy.get('.ant-select-item-option-content').eq(6).click();
    cy.wait(1000);
    cy.get('.ant-form-item-control-input-content').eq(3).type(1);
    cy.wait(1000);
    cy.get('.ant-form-item-control-input-content')
      .eq(4)
      .type('2022-03-09' + '{enter}')
      .wait(1000);
    cy.get('.ant-form-item-control-input-content')
      .eq(5)
      .type('2022-03-12' + '{enter}');
    cy.get('.ant-form-item-control-input-content')
      .eq(6)
      .type('2022-03-25' + '{enter}')
      .wait(1000);
    cy.get('.ant-form-item-control-input-content').eq(7).type('hello').wait(1000);
    cy.get('.anticon.anticon-close.ant-modal-close-icon').eq(1).click().wait(1000);
    cy.get('.buttonEdit___2k5N_').eq(2).click({ force: true }).wait(1000);
    cy.get('.anticon.anticon-close.ant-modal-close-icon').eq(2).click();

    cy.get('.filterIcon___3tcsv').click();
    cy.wait(2000);

    // cy.get('.ant-select-selection-overflow').eq(0).click({ force: true }).wait(2000);
    // cy.get('.ant-select-item-option-content').eq(1).click().wait(2000);
    // cy.contains('Apply').click({ force: true });
    // cy.wait(2000);
    // cy.get('.ant-select-clear').click();

    // cy.get('.ant-select-selection-search-input').eq(3).wait(2000).click();
    // cy.contains(' Process Analyst I').click({ force: true });
    // cy.wait(2000);
    // cy.contains('Apply').click({ force: true });
    // cy.wait(2000);
    // cy.get('.ant-select-clear').click();

    // cy.get('.ant-select-selection-search-input').eq(4).wait(2000).click({ force: true });
    // cy.contains('Unpaid').click();
    // cy.wait(2000);
    // cy.contains('Apply').click({ force: true });
    // cy.wait(2000);
    // cy.get('.ant-select-clear').click({ force: true });

    // cy.get('.ant-select-selection-search-input').eq(5).wait(2000).click({ force: true });
    // cy.get('.ant-select-item.ant-select-item-option.ant-select-item-option-active')
    //   .eq(3)
    //   .wait(2000)
    //   .click({ force: true });
    // cy.wait(2000);
    // cy.contains('Apply').click({ force: true });
    // cy.wait(2000);
    // cy.get('.ant-select-clear').click({ force: true });

    // cy.get('.ant-select-selection-search-input').eq(2).wait(4000).click({ force: true });
    // cy.contains('Hari A').click({ force: true });
    // cy.wait(2000);
    // cy.contains('Apply').click({ force: true });
    // cy.wait(2000);
    // cy.get('.ant-select-clear').click({ force: true });
    // cy.wait(2000);

    // cy.get('.ant-input.experience___2Xmly').eq(0).type('2');
    // cy.wait(2000);
    // cy.get('.ant-input.experience___2Xmly').eq(1).type('5');
    // cy.wait(2000);
    // cy.contains('Apply').click({ force: true });
    // cy.wait(2000);
    // cy.contains('Clear').click({ force: true });
    // cy.wait(2000);

    cy.get('.ant-tabs-tab-btn').eq(2).click();
    cy.wait(2000);

    cy.contains('Project Name').click({ force: true });
    cy.wait(2000);
    cy.contains('Project Name').click({ force: true });
    cy.wait(2000);
    cy.contains('Project Name').click({ force: true });
    cy.wait(2000);

    cy.get('.ant-table-column-title').eq(1).click({ force: true });
    cy.wait(2000);
    cy.get('.ant-table-column-title').eq(1).click({ force: true });
    cy.wait(2000);
    cy.get('.ant-table-column-title').eq(1).click({ force: true });
    cy.wait(2000);

    cy.get('.ant-table-column-title').eq(2).click({ force: true });
    cy.wait(2000);
    cy.get('.ant-table-column-title').eq(2).click({ force: true });
    cy.wait(2000);
    cy.get('.ant-table-column-title').eq(2).click({ force: true });
    cy.wait(2000);

    cy.get('.ant-table-column-title').eq(3).click({ force: true });
    cy.wait(2000);
    cy.get('.ant-table-column-title').eq(3).click({ force: true });
    cy.wait(2000);
    cy.get('.ant-table-column-title').eq(3).click({ force: true });
    cy.wait(2000);

    cy.get('.ant-table-column-title').eq(4).click({ force: true });
    cy.wait(2000);

    cy.get('.ant-table-column-title').eq(5).click({ force: true });
    cy.wait(2000);

    cy.get('.ant-table-column-title').eq(6).click({ force: true });
    cy.wait(2000);

    cy.get('.ant-table-column-title').eq(7).click({ force: true });
    cy.wait(2000);

    cy.get('.ant-table-column-title').eq(8).click({ force: true });
    cy.wait(2000);

    cy.get('.ant-table-column-title').eq(9).scrollIntoView(takeRight).click({ force: true });
    cy.wait(2000);

    cy.get('.ant-table-column-title').eq(10).scrollIntoView(takeRight).click({ force: true });
    cy.wait(2000);

    cy.get('.ant-table-column-title').eq(11).scrollIntoView(takeRight).click({ force: true });
    cy.wait(2000);

    cy.get('.ant-table-column-title').eq(12).scrollIntoView(takeRight).click({ force: true });
    cy.wait(2000);

    cy.get('.ant-table-column-title').eq(13).scrollIntoView(takeRight).click({ force: true });
    cy.wait(2000);

    cy.get('.ant-table-column-title').eq(14).scrollIntoView(takeRight).click({ force: true });
    cy.wait(2000);

    cy.get('.ant-table-column-title').eq(15).scrollIntoView(takeRight).click({ force: true });
    cy.wait(2000);

    cy.get('.filterIcon___E7VXK').click({ force: true });
    cy.wait(2000);

    cy.get('.ant-select-selector').eq(2).click().wait(1000);
    cy.wait(2000);
    cy.get('.ant-select-item-option-content').eq(2).click();
    cy.wait(2000);
    cy.contains('Apply').click().wait(2000);
    cy.get('.anticon.anticon-close').eq(0).click().wait(2000);
    cy.contains('Apply').click().wait(2000);

    cy.get('.ant-select-selector').eq(1).click({ force: true }).wait(1000);
    cy.wait(2000);
    cy.get('.ant-select-item-option-content').eq(2).click({ force: true });
    cy.wait(2000);
    cy.contains('Apply').click().wait(2000);
    cy.get('.anticon.anticon-close').eq(0).click().wait(2000);
    cy.contains('Apply').click().wait(2000);

    cy.get('.ant-select-selector').eq(3).click().wait(1000);
    cy.get('.ant-select-item-option-content').eq(9).click({ force: true });
    cy.wait(2000);
    cy.contains('Apply').click().wait(2000);
    cy.get('.anticon.anticon-close').eq(0).click().wait(2000);
    cy.contains('Apply').click().wait(2000);

    cy.get('.ant-select-selector').eq(4).click().wait(1000);
    cy.contains('Fixed Bid').click();
    cy.wait(2000);
    cy.contains('Apply').click().wait(2000);
    cy.get('.anticon.anticon-close').eq(0).click().wait(2000);
    cy.contains('Apply').click().wait(2000);

    cy.get('.ant-select-selector').eq(5).click().wait(1000);
    cy.contains('Kuntappa').click({ force: true });
    cy.wait(2000);
    cy.contains('Apply').click({ force: true }).wait(2000);
    cy.get('.anticon.anticon-close').eq(0).click().wait(2000);
    cy.contains('Apply').click().wait(2000);

    cy.get('.ant-select-selector').eq(6).click().wait(1000);
    cy.get('.ant-select-selector').eq(6).click().wait(1000);
    cy.contains('Close').click();
  });
});
