const { eq } = require('lodash');
const { TypedRule } = require('tslint/lib/rules');

describe('Dashboard Automation', () => {
  before(() => {
    cy.visit('https://stghrms.paxanimi.ai/login');
    cy.get('#basic_userEmail.ant-input').type('sandeep@mailinator.com');
    cy.get('#basic_password.ant-input').type('12345678@Tc');
  });

  it('Log In HRMS', () => {
    cy.get('button[type="submit"]').click();
    cy.wait(1000);
    cy.contains('Dashboard').click({ force: true });
    cy.wait(2000);
    cy.get('.manageWidgets___k1JOt').click();
    cy.wait(2000);
    cy.contains('Done').click();
    cy.wait(2000);
    cy.get('.manageWidgets___k1JOt').click({ force: true });
    cy.wait(2000);
    cy.get('.ant-btn.btnCancel___2InPX').click({ force: true });
    cy.wait(2000);
    //});

    // it('My Calender', () => {
    cy.get('.ant-tabs-tab-btn').eq(0).click();
    cy.get('img[src="/static/smallRightArrow.e2ea1246.svg"]')
      .eq(0)
      .click({ force: true });
    cy.wait(2000);
    cy.get('img[src="/static/smallLeftArrow.e194d918.svg"]').eq(0).click();
    cy.wait(1500);
    //Holiday Calender
    cy.get('.ant-tabs-tab-btn').eq(1).scrollIntoView(top).click().wait(1500);
    cy.get('img[src="/static/smallRightArrow.e2ea1246.svg"]')
      .eq(0)
      .click({ force: true })
      .scrollIntoView(top)
      .wait(1500);
    cy.get('img[src="/static/smallLeftArrow.e194d918.svg"]')
      .eq(0)
      .click()
      .wait(1500);
    cy.get('.viewAllMeetingBtn___1FKV8').click().wait(2000);
    cy.get('.ant-modal-close-x').click();
    // });

    // it('TimeSheet', () => {
    cy.get(
      '.ant-picker-calendar.ant-picker-calendar-full.CustomCalendar___2J4ay',
    )
      .scrollTo('bottom')
      .click()
      .wait(1500);
    cy.get(
      '.ant-picker-calendar.ant-picker-calendar-full.CustomCalendar___2J4ay',
    )
      .scrollTo('top')
      .click();
    cy.get('img[src="/static/smallRightArrow.e2ea1246.svg" ]')
      .eq(1)
      .click({ focus: true });
    cy.wait(2000);
    cy.get('img[src="/static/smallLeftArrow.e194d918.svg" ]')
      .eq(1)
      .click({ force: true });
    cy.wait(1500);
    cy.get('.fillTimesheetBtn___a6Bzv').click({ force: true });
    cy.wait(2500);
    cy.contains('Dashboard').click({ force: true }).wait(2000);
    //});

    // Log Activity

    cy.get('.ant-tabs-tab-btn')
      .eq(2)
      .click({ force: true })
      .scrollIntoView(top)
      .wait(2000);
    //view button in pending Approuvals

    cy.get('.viewBtn___3JdKe').eq(0).click({ force: true }).wait(1500);
    cy.get('.anticon.anticon-close.ant-modal-close-icon').click().wait(1500);
    cy.get('.viewBtn___3JdKe').eq(0).click({ force: true }).wait(1500);
    cy.get('.ant-btn.btnCancel___12wc_').click({ force: true }).wait(2000);
    cy.get('.viewBtn___3JdKe').eq(1).click({ force: true }).wait(1500);
    cy.contains('Approve').click({ force: true }).wait(2000);
    cy.get('.viewAllBtn___1tsgc').click({ force: true }).wait(3000);
    cy.contains('Dashboard').click({ force: true }).wait(1500);
    cy.get('.ant-tabs-tab-btn').eq(3).click({ fource: true }).wait(1500);
    cy.get('.ant-tabs-tab-btn').eq(4).click({ fource: true }).wait(1500);
    //view button my tickets
    // cy.get('.viewBtn___1gb7A').click({ force: true }).wait(1500);
    // cy.get('.ant-select-selection-item').eq(2).click({ fource: true });
    // cy.get('.ant-select-item-option-content').eq(3).click({ force: true }).wait(2000);
    // cy.get('.ant-btn').eq(2).click({ fource: true }).wait(2000);
    // cy.get('.anticon.anticon-close.ant-modal-close-icon').click({ fource: true });
    //click the bottom view button
    cy.get('.viewAllBtn___1tsgc').click({ focus: true }).wait(2000);
    cy.get('.ant-modal-close-x').click({ fource: true });

    //my Task
    cy.get('.ant-tabs-tab-btn')
      .eq(5)
      .click({ force: true })
      .scrollIntoView(top)
      .wait(1500);
    cy.get('.header__actions___eSYoj').click({ focus: true }); //sort
    cy.get('.viewAllBtn___pupxV').click({ fource: true }).wait(1500);
    cy.get('.ant-checkbox-input').eq(4).click({ fource: true }).wait(2000);
    cy.get('.ant-modal-close-x').click({ fource: true });

    //my projects
    cy.get('.ant-tabs-tab-btn')
      .eq(6)
      .click({ force: true })
      .scrollIntoView(top)
      .wait(1500);
    cy.get('.header__actions___eSYoj').click({ focus: true }).wait(1500); //sorting
    // cy.get('.viewAllBtn___pupxV').click({ force: true }).wait(2000);
    // cy.get('.ant-modal-close-x').click({ fource: true }).wait(1500);

    //my team
    cy.get('.ant-tabs-tab-btn').eq(7).click({ fource: true }).wait(2000);
    cy.get('.container___1OJXO').eq(0).click({ fource: true }).wait(2000);
    cy.go('back').wait(2000);
    cy.get('.Resources___1O9wB')
      .scrollTo('bottom')
      .click({ force: true })
      .wait(2000);
    cy.get('.Resources___1O9wB')
      .scrollTo('top')
      .click({ force: true })
      .wait(2000);

    //team leave calender
    cy.get('.ant-tabs-tab-btn').eq(8).click({ fource: true }).wait(2000);
    cy.get('.ant-avatar-group').eq(8).click({ fource: true }).wait(2000);
    cy.get('.ant-picker-calendar-date-content').eq(82).click().wait(2000);
    cy.get('.ant-picker-calendar-date-content').eq(43).click().wait(2000);
    cy.get('img[src="/static/smallRightArrow.e2ea1246.svg" ]')
      .eq(2)
      .click({ force: true })
      .wait(1500);
    cy.get('img[src="/static/smallLeftArrow.e194d918.svg"]')
      .eq(2)
      .click({ fource: true })
      .wait(1500);
    cy.get('.viewAllBtn___1pTAS').click({ force: true }).wait(2000);
    cy.go('back').wait(2000);

    //my apps
    cy.get('.manageAppsBtn___312Y8').click({ fource: true }).wait(2000);
    cy.get('.anticon.anticon-close.ant-modal-close-icon').click({
      fource: true,
    });
    cy.get('.ant-col.ant-col-8.AppCard___3DaAf')
      .eq(0)
      .click({ force: true })
      .wait(2000);
    cy.go('back').wait(2000);
    cy.get('.ant-col.ant-col-8.AppCard___3DaAf')
      .eq(1)
      .click({ force: true })
      .wait(2000);
    cy.go('back').wait(2000);
    cy.get('.ant-col.ant-col-8.AppCard___3DaAf')
      .eq(2)
      .click({ force: true })
      .wait(2000);
    cy.go('back').wait(2000);
  });
});
