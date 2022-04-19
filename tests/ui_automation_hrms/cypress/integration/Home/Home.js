const { Select, Input } = require('antd');
const { eq } = require('lodash');

describe('Home Page', () => {
  before(() => {
    cy.visit('https://stghrms.paxanimi.ai/login');
  });

  let employee_email = 'narmada.biradar@mailinator.com';
  let password = '12345678@Tc';

  it('Login HR', () => {
    cy.get('#basic_userEmail.ant-input').type(employee_email);
    cy.get('#basic_password.ant-input').type(password);
    cy.get('button[type="submit"]').click();
    cy.wait(3000);
    cy.contains('Home').click({ force: true });
    cy.wait(3000);
  });

  it('Click The header', () => {
    cy.get('.action___3ut1O.notify___2Rxx5').eq(0).click();
    cy.wait(2000);
    cy.get('.menuItemLink__withIcon___25NPY').eq(0).click();
    cy.wait(2000);
    cy.get('.ant-modal-close-x').click();
    cy.wait(2000);
  });

  it('Click The Notification', () => {
    cy.get('.number___T4TGu').click();
    cy.wait(3000);
    cy.get('.ant-modal-close-x').click();
    cy.wait(2000);
    // cy.get('.reply___Lon08').eq(0).click();
    // cy.wait(2500);
  });

  it('Click The poster', () => {
    cy.get('.slick-arrow.slick-next').eq(0).click();
    cy.wait(1000);
    cy.get('.slick-arrow.slick-next').eq(0).click();
    cy.wait(1000);
    cy.get('.slick-arrow.slick-prev').eq(0).click();
    cy.wait(1000);
    cy.get('.slick-arrow.slick-prev').eq(0).click();
    cy.wait(1000);
  });

  it('Click The Birthday Poster', () => {
    cy.get('.slick-arrow.slick-next').eq(1).click();
    cy.wait(1000);
    cy.get('.slick-arrow.slick-next').eq(1).click();
    cy.wait(1000);
    cy.get('.slick-arrow.slick-prev').eq(1).click();
    cy.wait(1000);
    cy.get('.slick-arrow.slick-prev').eq(1).click();
    cy.wait(1000);
    cy.get('.likes___3aJGa').eq(3).click({ force: true });
    cy.wait(2000);
    cy.get('.comments___3-2mD').eq(3).click({ force: true });
    cy.wait(2000);
    cy.get('.likes___2TNSg').click();
    cy.wait(2000);
    cy.get('.ant-modal-close-x').eq(1).click();
    cy.wait(2000);
    cy.get('.commentBox___3AjXE').type('Happy Birthday');
    cy.wait(2000);
    cy.get('.ant-modal-close-x').eq(0).click();
    cy.wait(2000);
  });

  it('My Team', () => {
    cy.get('.ant-tabs-tab-btn').eq(0).click();
    cy.wait(2000);
    cy.get('.ant-tabs-tab-btn').eq(1).click();
    cy.wait(2000);
    cy.get('.ant-tabs-tab-btn').eq(2).click();
    cy.wait(2000);
  });

  it('Quick Apps', () => {
    cy.get('.iconCircle___3_3BW').eq(2).click();
    cy.wait(2000);
    cy.get('.ant-modal-close-x').click();
    cy.wait(1000);
  });

  it('Feedback', () => {
    cy.get('.ant-btn.btnFeedback___2bnJB').click();
    cy.wait(2000);
    cy.get('.ant-radio-input').eq(0).click();
    cy.wait(2000);
    cy.get('.ant-input.fieldModal___1PouH').type('Hello');
    cy.wait(2000);
    cy.get('.ant-modal-close-x').click();
  });
});
