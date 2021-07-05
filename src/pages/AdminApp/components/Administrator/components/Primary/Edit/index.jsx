import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, message } from 'antd';

import styles from './index.less';

class EditPrimary extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (value) => {};

  handleChangeField = (value) => {};

  onFinish = (value) => {
    message.success('Save change !');
  };

  handleCancel = () => {
    const { onCancel = () => {} } = this.props;
    onCancel();
  };

  render() {
    const { primaryAdmin: { firstName = '', email = '', position = '' } = {} } = this.props;
    return (
      <div className={styles.primaryEdit}>
        <Form
          className={styles.formAdminstrator}
          onValuesChange={this.handleChange}
          onFinish={this.onFinish}
          initialValues={{
            firstName,
            email,
            position,
          }}
        >
          <Row>
            <Col span={24} className={styles.rowItem}>
              <Col span={8}>
                <div className={styles.formAdminstrator__left}>
                  <div>Employee Name</div>
                </div>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="firstName"
                  className={styles.formAdminstrator__right}
                  rules={[
                    {
                      required: true,
                      message: 'Please input value',
                    },
                  ]}
                >
                  <Input
                    className={styles.inputForm}
                    onChange={(e) => this.handleChangeField(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Col>
            <Col span={24} className={styles.rowItem}>
              <Col span={8}>
                <div className={styles.formAdminstrator__left}>
                  <div>Email</div>
                </div>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="email"
                  className={styles.formAdminstrator__right}
                  rules={[
                    {
                      required: true,
                      message: 'Please input value',
                    },
                    {
                      type: 'email',
                      message: 'Invalid email !',
                    },
                  ]}
                >
                  <Input
                    className={styles.inputForm}
                    onChange={(e) => this.handleChangeField(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Col>
            <Col span={24} className={styles.rowItem}>
              <Col span={8}>
                <div className={styles.formAdminstrator__left}>
                  <div>Position</div>
                </div>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="position"
                  className={styles.formAdminstrator__right}
                  rules={[
                    {
                      required: true,
                      message: 'Please input value',
                    },
                  ]}
                >
                  <Input
                    className={styles.inputForm}
                    onChange={(e) => this.handleChangeField(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Col>
          </Row>

          <div className={styles.primaryEdit__bottom}>
            <Button onClick={this.handleCancel} className={`${styles.btn} ${styles.cancelBtn}`}>
              Cancel
            </Button>
            <Button htmlType="submit" className={`${styles.btn} ${styles.saveBtn}`}>
              Save
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default EditPrimary;
