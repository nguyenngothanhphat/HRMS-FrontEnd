describe('Ticket Management', () => {
  before(() => {
    cy.visit('https://stghrms.paxanimi.ai/login');
  });

  let employee_email = 'narmada.biradar@mailinator.com';
  let password = '12345678@Tc';

  it('Ticket Management', () => {
    cy.get('#basic_userEmail.ant-input').type(employee_email);
    cy.get('#basic_password.ant-input').type(password);
    cy.get('button[type="submit"]').click();
    cy.wait(1000);
    cy.contains('Ticket Management').click({ force: true });
    cy.wait(3000);
    cy.get('.ant-tabs-tab-btn').eq(1).click({ force: true }).wait(2000);
    cy.get('.ant-tabs-tab-btn').eq(3).click();
    cy.wait(3000);
    cy.get('.ant-tabs-tab-btn').eq(4).click();
    cy.wait(2000);
    cy.get('.ant-tabs-tab-btn').eq(5).click();
    cy.wait(2000);
    cy.get('.ant-tabs-tab-btn').eq(6).click();
    cy.wait(2000);

    cy.get('.ant-tabs-tab-btn').eq(2).click();
    cy.wait(3000);
    cy.get('.FilterButton___qz7iA').click({ force: true });
    cy.wait(2000);
    cy.get('#formFilter_employeeRaise.ant-input')
      .type('Narmada Vivekanad Biradar')
      .click({ force: true })
      .wait(2000);
    cy.get('.anticon.anticon-close-circle.ant-input-clear-icon').eq(0).click({
      force: true,
    });

    cy.get('.ant-select-selection-placeholder').eq(1).click({ force: true });
    cy.get('.ant-select-item.ant-select-item-option.ant-select-item-option-active')
      .eq(0)
      .click({ force: true })
      .wait(2000);
    cy.get('.ant-select-selection-item-remove').click({ force: true });

    cy.get('.ant-select-selection-placeholder').eq(2).click({ force: true }).wait(2000);
    cy.get('.ant-select-item.ant-select-item-option.ant-select-item-option-active')
      .eq(1)
      .click({ force: true })
      .wait(2000);
    cy.get('.ant-select-selection-item-remove').click({ force: true });

    cy.get('.ant-select-selection-placeholder').eq(3).click({ force: true }).wait(2000);
    cy.get('.ant-select-item.ant-select-item-option.ant-select-item-option-active')
      .eq(2)
      .click({ force: true })
      .wait(2000);
    cy.get('.ant-select-selection-item-remove').click({ force: true });

    cy.get('.ant-picker-input')
      .eq(0)
      .type('15-03-2022' + '{enter}');
    cy.get('.ant-picker-input')
      .eq(1)
      .type('30-03-2022' + '{enter}')
      .wait(2000);
    cy.get('.anticon.anticon-close-circle').eq(2).click({ force: true });
    cy.get('.anticon.anticon-close-circle').eq(1).click({ force: true }).wait(2000);

    cy.get('.ant-tabs-tab-btn').eq(3).click();
    cy.wait(3000);
    cy.get('.FilterButton___qz7iA').click({ force: true }).wait(2000);

    cy.get('.ant-input-affix-wrapper.ant-select-selection-search-input')
      .eq(0)
      .type('Narmada Vivekanad Biradar')
      .click({ force: true })
      .wait(2000);
    cy.get('.anticon.anticon-close-circle.ant-input-clear-icon').eq(0).click({ force: true });

    cy.get('.ant-select-selection-placeholder').eq(0).click({ force: true });
    cy.get('.ant-select-item.ant-select-item-option.ant-select-item-option-active')
      .eq(0)
      .click({ force: true })
      .wait(2000);
    cy.get('.ant-select-selection-item-remove').click({ force: true });

    cy.get('.ant-select-selection-placeholder').eq(2).click({ force: true }).wait(2000);
    cy.get('.ant-select-item.ant-select-item-option.ant-select-item-option-active')
      .eq(1)
      .click({ force: true })
      .wait(2000);
    cy.get('.ant-select-selection-item-remove').click({ force: true });

    cy.get('.ant-select-selection-placeholder').eq(3).click({ force: true }).wait(2000);
    cy.get('.ant-select-item.ant-select-item-option.ant-select-item-option-active')
      .eq(2)
      .click({ force: true })
      .wait(2000);
    cy.get('.ant-select-selection-item-remove').click({ force: true });

    cy.get('.ant-input-affix-wrapper.ant-select-selection-search-input')
      .eq(1)
      .type('sandeep')
      .click({ force: true })
      .wait(2000);
    cy.get('.anticon.anticon-close-circle.ant-input-clear-icon').eq(1).click({ force: true });

    cy.get('.ant-picker-input')
      .eq(0)
      .type('15-03-2022' + '{enter}');
    cy.get('.ant-picker-input')
      .eq(1)
      .type('30-03-2022' + '{enter}')
      .wait(2000);
    cy.get('.anticon.anticon-close-circle').eq(3).click({ force: true });
    cy.get('.anticon.anticon-close-circle').eq(2).click({ force: true }).wait(2000);

    cy.get('.ant-tabs-tab-btn').eq(4).click({ force: true });
    cy.wait(2000);
    cy.get('.FilterButton___qz7iA').click({ force: true });
    cy.get('.ant-input-affix-wrapper.ant-select-selection-search-input')
      .eq(0)
      .type('Narmada Vivekanad Biradar' + '{enter}')
      .wait(2000);
    cy.get('.anticon.anticon-close-circle.ant-input-clear-icon').eq(0).click({ force: true });

    cy.get('.ant-tabs-tab-btn').eq(5).click({ force: true });
    cy.wait(2000);

    cy.get('.ant-tabs-tab-btn').eq(6).click();
    cy.wait(2000);
    cy.get('.FilterButton___qz7iA').click({ force: true });

    cy.get('.ant-input-affix-wrapper.ant-select-selection-search-input')
      .eq(0)
      .type('sandeep')
      .wait(2000);
    cy.get('.anticon.anticon-close-circle.ant-input-clear-icon').eq(0).click({ force: true });

    cy.get('.ant-select-selection-placeholder').eq(1).wait(2000).click({ force: true });
    cy.get('.ant-select-item.ant-select-item-option.ant-select-item-option-active')
      .eq(0)
      .click({ force: true })
      .wait(2000);
    cy.get('.ant-select-selection-item-remove').click({ force: true }).wait(2000);

    cy.get('.ant-select-selection-placeholder').eq(2).wait(2000).click({ force: true });
    cy.get('.ant-select-item.ant-select-item-option.ant-select-item-option-active')
      .eq(1)
      .click({ force: true })
      .wait(2000);
    cy.get('.ant-select-selection-item-remove').click({ force: true }).wait(2000);

    cy.get('.ant-select-selection-placeholder').eq(3).wait(2000).click({ force: true });
    cy.get('.ant-select-item.ant-select-item-option.ant-select-item-option-active')
      .eq(2)
      .click({ force: true })
      .wait(2000);
    cy.get('.ant-select-selection-item-remove').click({ force: true }).wait(2000);

    // cy.get('.ant-input-affix-wrapper.ant-select-selection-search-input')
    //   .eq(1)
    //   .type('sandeep')
    //   .wait(2000);
    // cy.get('.anticon.anticon-close-circle.ant-input-clear-icon')
    //   .eq(1)
    //   .click({ force: true });

    cy.get('.ant-picker-input')
      .eq(0)
      .type('15-03-2022' + '{enter}');
    cy.get('.ant-picker-input')
      .eq(1)
      .type('30-03-2022' + '{enter}')
      .wait(2000);
    cy.get('.anticon.anticon-close-circle').eq(3).click({ force: true });
    cy.get('.anticon.anticon-close-circle').eq(2).click({ force: true }).wait(2000);

    cy.get('.ant-tabs-tab-btn').eq(7).click({ force: true });
    cy.wait(2000);

    cy.get('.FilterButton___qz7iA').click({ force: true });
    cy.get('.ant-input-affix-wrapper.ant-select-selection-search-input')
      .eq(0)
      .type('Aashwij Pai' + '{enter}')
      .wait(2000);
    cy.get('.anticon.anticon-close-circle.ant-input-clear-icon').eq(0).click({ force: true });

    cy.get('.ant-select-selection-placeholder').eq(1).click({ force: true });
    cy.get('.ant-select-item.ant-select-item-option.ant-select-item-option-active')
      .eq(0)
      .click({ force: true })
      .wait(2000);
    cy.get('.ant-select-selection-item-remove').click({ force: true });

    cy.get('.ant-select-selection-placeholder').eq(2).click({ force: true }).wait(2000);
    cy.get('.ant-select-item.ant-select-item-option.ant-select-item-option-active')
      .eq(1)
      .click({ force: true })
      .wait(2000);
    cy.get('.ant-select-selection-item-remove').click({ force: true });

    cy.get('.ant-select-selection-placeholder').eq(3).click({ force: true });
    cy.get('.ant-select-item.ant-select-item-option.ant-select-item-option-active')
      .eq(2)
      .click({ force: true })
      .wait(2000);
    cy.get('.ant-select-selection-item-remove').click({ force: true });

    cy.get('.ant-input-affix-wrapper.ant-select-selection-search-input')
      .eq(1)
      .type('aashwij')
      .wait(2000);
    cy.get('.anticon.anticon-close-circle.ant-input-clear-icon').eq(1).click({ force: true });

    cy.get('.ant-picker-input')
      .eq(0)
      .type('15-03-2022' + '{enter}');
    cy.get('.ant-picker-input')
      .eq(1)
      .type('30-03-2022' + '{enter}')
      .wait(2000);
    cy.get('.anticon.anticon-close-circle').eq(3).click({ force: true });
    cy.get('.anticon.anticon-close-circle').eq(2).click({ force: true }).wait(2000);
  });
});
