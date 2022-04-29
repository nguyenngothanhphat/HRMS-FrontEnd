describe('Home Page', () => {
  before(() => {
    cy.visit('https://stghrms.paxanimi.ai/login');
  });

  let employee_email = 'sandeep@mailinator.com';
  let password = '12345678@Tc';

  it('Login', () => {
    cy.get('#basic_userEmail.ant-input').type(employee_email);
    cy.get('#basic_password.ant-input').type(password);
    cy.get('button[type="submit"]').click();
    cy.wait(3000);
    cy.contains('Home').click({ force: true });
    cy.wait(3000);
    //});

    // it('Notification', () => {
    cy.get('.number___T4TGu').click();
    cy.wait(2000);
    cy.get('.ant-modal-close-x').click();
    cy.wait(2000);
    // });

    // it('My Calender', () => {

    cy.get('.ant-tabs-tab-btn').eq(1).click({ force: true }).wait(2000);
    cy.get('.ant-tabs-content-holder').scrollTo('bottom').wait(2000);
    cy.get('.ant-tabs-content-holder').scrollTo('top').wait(2000);
    cy.get('.information___10ZEI').eq(0).click({ force: true }).wait(3000);
    cy.go('back');

    cy.get('.ant-tabs-tab-btn').eq(2).click({ force: true }).wait(2000);
    cy.get('.viewBtn___1gb7A').eq(0).click({ force: true }).wait(2000);
    cy.get('.ant-select-selector').click({ force: true }).wait(2000);
    cy.get('.ant-select-item-option-content').eq(2).click({ force: true }).wait(2000);
    cy.get('.anticon.anticon-close.ant-modal-close-icon')
      .click({
        force: true,
      })
      .wait(2000);

    ////Quick Apps
    // cy.get(
    //   '.ant-layout-content.ant-pro-basicLayout-content.ant-pro-basicLayout-has-header.wrapContentCollapsed',
    // ).scrollTo('bottom');
    cy.get('.QuickLinks___2rJmn').click({ force: true });
    cy.get('.linkIcon___138HR').eq(0).click({ force: true }).wait(2000);
    cy.go('back').wait(2000);
    cy.get('.linkIcon___138HR').eq(1).click({ force: true }).wait(2000);
    cy.go('back').wait(2000);
    cy.get('.linkIcon___138HR').eq(2).click({ force: true }).wait(2000);
    cy.get('.anticon.anticon-close.ant-modal-close-icon')
      .click({
        force: true,
      })
      .wait(2000);
    cy.get('.linkIcon___138HR').eq(3).click({ force: true }).wait(2000);
    cy.get('img[src="/static/downloadIconTimeOff.6e0a32bc.svg"]')
      .click({
        force: true,
      })
      .wait(2000);

    cy.get('img[src="/static/closeIconTimeOff.a323d33a.svg"]')
      .click({
        force: true,
      })
      .wait(2000);

    // //banner
    cy.get('.slick-arrow.slick-next').eq(0).click();
    cy.wait(1000);
    cy.get('.slick-arrow.slick-next').eq(0).click();
    cy.wait(1000);
    cy.get('.slick-arrow.slick-prev').eq(0).click();
    cy.wait(1000);
    cy.get('.slick-arrow.slick-prev').eq(0).click();
    cy.wait(1000);

    //Time Sheet
    cy.get('.actionIcon___1er_V').eq(0).click({ force: true }).wait(2000);
    cy.go('back').wait(2000);

    //Time Off
    cy.get('.ant-btn.applyTimeOffBtn___3EgOb').click({ force: true }).wait(2000);
    cy.go('back').wait(2000);

    //Birthday post
    cy.get('.slick-arrow.slick-next').eq(1).click();
    cy.wait(1000);
    cy.get('.slick-arrow.slick-next').eq(1).click();
    cy.wait(1000);
    cy.get('.slick-arrow.slick-prev').eq(1).click();
    cy.wait(1000);
    cy.get('.slick-arrow.slick-prev').eq(1).click();
    cy.wait(1000);
    cy.get('img[src="/static/like.df42eecb.svg"]').eq(0).click({ force: true }).wait(2000);
    cy.get('span[style="font-weight: 500; color: rgb(44, 109, 249);"]')
      .eq(0)
      .click({ force: true })
      .wait(2000);
    cy.get('.name___146NX.isMe___3vSjm').click({ force: true }).wait(2000);
    cy.go('back').wait(2000);
    cy.get('span[style="font-weight: 500; color: rgb(44, 109, 249);"]')
      .eq(0)
      .click({ force: true })
      .wait(2000);
    cy.get('.anticon.anticon-close.ant-modal-close-icon')
      .click({
        force: true,
      })
      .wait(2000);

    cy.get('img[src="/static/comment.93cdebaf.svg"]').eq(0).click({ force: true }).wait(2000);
    cy.get('span[style="font-weight: 500; color: rgb(44, 109, 249);"]')
      .eq(1)
      .click({
        force: true,
      })
      .wait(2000);
    cy.get('.name___146NX.isMe___3vSjm').click({ force: true }).wait(2000);
    cy.go('back').wait(2000);
    cy.get('img[src="/static/comment.93cdebaf.svg"]').eq(0).click({ force: true }).wait(2000);
    cy.get('span[style="font-weight: 500; color: rgb(44, 109, 249);"]')
      .eq(1)
      .click({
        force: true,
      })
      .wait(2000);

    cy.get('.anticon.anticon-close.ant-modal-close-icon').eq(1).click({ force: true }).wait(2000);
    cy.get('.anticon.anticon-close.ant-modal-close-icon').eq(0).click({ force: true }).wait(2000);

    cy.get('img[src="/static/comment.93cdebaf.svg"]').eq(0).click({ force: true }).wait(2000);
    cy.get('.commentBox___3AjXE').type('Happy Birthday').wait(2000);
    cy.get('.ant-btn.commentBtn___2F_Lq').click({ force: true }).wait(2000);
    cy.get('.ant-btn.commentBtn___2F_Lq').click({ force: true }).wait(2000);
    cy.get('.anticon.anticon-close.ant-modal-close-icon')
      .click({
        force: true,
      })
      .wait(2000);
  });
});
