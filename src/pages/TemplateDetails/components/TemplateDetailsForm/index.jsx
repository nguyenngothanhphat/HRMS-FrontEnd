import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Typography, Button } from 'antd';
import CustomModal from '@/components/CustomModal/index';

import EditForm from '../EditForm';
import ModalContent from '../ModalContent';

import brandLogo from './assets/brand-logo.svg';
import formOutlined from './assets/form-outlined.svg';

import styles from './index.less';

class TemplateDetailsForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openModal: true,
      currentModal: 1,
    };
  }

  onNext = () => {
    const { currentModal } = this.state;
    // const value = ;
    this.setState({
      currentModal: currentModal + 1,
      openModal: currentModal !== 3,
    });
  };

  onClickEdit = () => {
    this.setState({
      openModal: true,
      currentModal: 1,
    });
  };

  closeModal = () => {
    this.setState({
      openModal: false,
    });
  };

  _renderModal = () => {
    const { currentModal, openModal } = this.state;
    switch (currentModal) {
      case 1:
        return (
          <CustomModal open={openModal} closeModal={this.closeModal}>
            <EditForm onNext={this.onNext} />
          </CustomModal>
        );
      case 2:
        return (
          <CustomModal open={openModal} closeModal={this.closeModal}>
            <ModalContent onNext={this.onNext} content={0} />
          </CustomModal>
        );
      case 3:
        return (
          <CustomModal open={openModal} closeModal={this.closeModal}>
            <ModalContent onNext={this.onNext} content={1} />
          </CustomModal>
        );
      default:
        return null;
    }
  };

  render() {
    const templateDetail = {
      title: 'title',
      date: `17/18/2020`,
      content: (
        <Typography.Text>
          THIS AGREEMENT made as of the ______day of__________________, 20__ , between [name of
          employer] a corporation incorporated under the laws of the Province of Ontario, and having
          its principal place of business at _______________________(the “Employer”); and [name of
          employee], of the City of ____________________in the Province of Ontario (the “Employee”).{' '}
          <br />
          <br />
          WHEREAS the Employer desires to obtain the benefit of the services of the Employee, and
          the Employee desires to render such services on the terms and conditions set forth.
          <br />
          <br /> IN CONSIDERATION of the promises and other good and valuable consideration (the
          sufficiency and receipt of which are hereby acknowledged) the parties agree as follows:
          <br />
          <br />
          The Employee agrees that he will at all times faithfully, industriously, and to the best
          of his skill, ability, experience and talents, perform all of the duties required of his
          position. <br />
          <br />
          In carrying out these duties and responsibilities, the Employee shall comply with all
          Employer policies, procedures, rules and regulations, both written and oral, as are
          announced by the Employer from time to time. <br />
          <br />
          It is also understood and agreed to by the Employee that his assignment, duties and
          responsibilities and reporting arrangements may be changed by the Employer in its sole
          discretion without causing termination of this agreement. <br />
          <br />
          The Employee agrees that he will at all times faithfully, industriously, and to the best
          of his skill, ability, experience and talents, perform all of the duties required of his
          position. <br />
          <br />
          In carrying out these duties and responsibilities, the Employee shall comply with all
          Employer policies, procedures, rules and regulations, both written and oral, as are
          announced by the Employer from time to time.
        </Typography.Text>
      ),
    };
    return (
      <div className={styles.TemplateDetailsForm}>
        <div className={styles.TemplateDetailsForm_header}>
          <Form>
            <Form.Item
              label="Enter template title"
              name="templateTitle"
              required={false}
              rules={[{ required: true, message: 'Please input template title!' }]}
            >
              <Row gutter={[24, 0]}>
                <Col span={16}>
                  <Input />
                </Col>
                <Col span={8}>
                  <Input defaultValue="Terralogic.png" />
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.TemplateDetailsForm_template}>
          <div className={styles.TemplateDetailsForm_template_header}>
            <img src={brandLogo} alt="brand-logo" />
            <p>{templateDetail.date}</p>
          </div>
          <hr />
          <div className={styles.TemplateDetailsForm_template_content}>
            {templateDetail.content}
          </div>
          <div className={styles.TemplateDetailsForm_template_button}>
            {' '}
            <Button
              type="primary"
              onClick={this.onClickEdit}
              className={styles.TemplateDetailsForm_template_button_primary}
            >
              <img src={formOutlined} alt="form-outline" />
              Edit
            </Button>
          </div>
        </div>

        {this._renderModal()}
      </div>
    );
  }
}

export default TemplateDetailsForm;
