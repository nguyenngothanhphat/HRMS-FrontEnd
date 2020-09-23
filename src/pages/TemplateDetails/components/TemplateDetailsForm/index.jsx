import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Typography, Button } from 'antd';
import FormOutlined from '@ant-design/icons';
import brandLogo from './assets/brand-logo.svg';
import styles from './index.less';

class TemplateDetailsForm extends PureComponent {
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
            <FormOutlined style={{ color: '#000000' }} />
            <Button
              type="primary"
              onClick={this.onClickPrev}
              className={styles.TemplateDetailsForm_template_button_primary}
            >
              Edit
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default TemplateDetailsForm;
