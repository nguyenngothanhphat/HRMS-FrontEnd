import React, { Component } from 'react';
import { Select, Form, Divider, Row, Col, Button } from 'antd';

import styles from './index.less';

class AssignPolicy extends Component {
  onChange = () => {};

  render() {
    return (
      <div className={styles.balance}>
        <div className={styles.balanceFrom}>
          <div className={styles.header}>Standard Holiday calendar</div>
          <Divider />
          <Form>
            <div className={styles.fromBody}>
              <div className={styles.textContent}>Standard Holiday calendar</div>
              <Row>
                <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                  <Form.Item
                    label="Assign to"
                    rules={[{ required: true, message: 'Please select' }]}
                  >
                    <Select className={styles.select} placeholder="All employees" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                  <Form.Item
                    label="Excluding"
                    rules={[{ required: true, message: 'Please select' }]}
                  >
                    <Select className={styles.select} placeholder="None" />
                  </Form.Item>
                </Col>
              </Row>
              <div className={styles.textContent}>Standard Workhours and days</div>
              <Row>
                <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                  <Form.Item
                    label="Assign to"
                    rules={[{ required: true, message: 'Please select' }]}
                  >
                    <Select className={styles.select} placeholder="All employees" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                  <Form.Item
                    label="Excluding"
                    rules={[{ required: true, message: 'Please select' }]}
                  >
                    <Select className={styles.select} placeholder="None" />
                  </Form.Item>
                </Col>
              </Row>
              <div className={styles.textContent}>Standard Workhours and days</div>
              <Row>
                <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                  <Form.Item
                    label="Assign to"
                    rules={[{ required: true, message: 'Please select' }]}
                  >
                    <Select className={styles.select} placeholder="All employees" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                  <Form.Item
                    label="Excluding"
                    rules={[{ required: true, message: 'Please select' }]}
                  >
                    <Select className={styles.select} placeholder="None" />
                  </Form.Item>
                </Col>
              </Row>
              <Row className={styles.footer}>
                <Col xs={24} sm={24} md={24} lg={10} xl={5}>
                  <Button className={styles.btnSubmit}>Finish</Button>
                </Col>
              </Row>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default AssignPolicy;
