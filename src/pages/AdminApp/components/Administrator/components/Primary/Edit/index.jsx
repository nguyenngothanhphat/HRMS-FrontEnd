import React, { Component } from 'react';
import { Row, Col, Form, Input } from 'antd';

import styles from './index.less';

class EditPrimary extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.primaryList}>
          <Form className={styles.formAdminstrator}>
            <Row gutter={[0, 16]}>
              <Col span={8}>
                <div className={styles.primaryContent__left}>
                  <div>Employee Name</div>
                </div>
              </Col>
              <Col span={16}>
                <Form.Item name="employeeName">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

export default EditPrimary;
