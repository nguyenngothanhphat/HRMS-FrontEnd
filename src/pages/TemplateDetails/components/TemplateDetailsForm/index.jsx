import React, { PureComponent } from 'react';
import { Form, Input, Row, Col } from 'antd';
import brandLogo from './assets/brand-logo.svg';
import styles from './index.less';

class TemplateDetailsForm extends PureComponent {
  render() {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
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
            <p>17/18/2020</p>
          </div>
          <div className={styles.TemplateDetailsForm_template_content}>asdasd</div>
          <div className={styles.TemplateDetailsForm_template_button}>asdasd</div>
        </div>
      </div>
    );
  }
}

export default TemplateDetailsForm;
