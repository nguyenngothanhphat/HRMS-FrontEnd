import React, { PureComponent } from 'react';
import { Form, Select, Input, Button, Row, Col, DatePicker } from 'antd';

import styles from './index.less';

const { Option } = Select;

export default class InformationUploadForm extends PureComponent {
  onFinish = (fieldsValue) => {
    //
  };

  render() {
    return (
      <div className={styles.InformationUploadForm}>
        <div className={styles.formTitle}>
          <span>Document Information</span>
        </div>
        <Form name="uploadForm" onFinish={this.onFinish}>
          <Row gutter={['20', '20']}>
            <Col span={12}>
              <Form.Item
                name="employeeId"
                rules={[
                  {
                    required: true,
                    message: 'Please input employee ID!',
                  },
                ]}
              >
                <span className={styles.inputLabel}>Employee ID</span>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="employeeName">
                <span className={styles.inputLabel}>Employee Name</span>
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={['20', '20']}>
            <Col span={12}>
              <Form.Item
                name="documentType"
                rules={[{ required: true, message: 'Please select document type!' }]}
              >
                <span className={styles.inputLabel}>Document Type</span>
                <Select onChange={() => {}}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={['20', '20']}>
            <Col span={12}>
              <Form.Item
                name="visaNumber"
                rules={[{ required: true, message: 'Please input visa number!' }]}
              >
                <span className={styles.inputLabel}>Visa Number</span>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="visaType"
                rules={[{ required: true, message: 'Please select visa type!' }]}
              >
                <span className={styles.inputLabel}>Visa Type</span>
                <Select onChange={() => {}}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={['20', '20']}>
            <Col span={12}>
              <Form.Item
                name="country"
                rules={[{ required: true, message: 'Please select country!' }]}
              >
                <span className={styles.inputLabel}>Country</span>
                <Select onChange={() => {}}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="entryType"
                rules={[{ required: true, message: 'Please select entry type!' }]}
              >
                <span className={styles.inputLabel}>Entry Type</span>
                <Select onChange={() => {}}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={['20', '20']}>
            <Col span={12}>
              <Form.Item
                name="issuedOn"
                rules={[{ required: true, message: 'Please select issued time!' }]}
              >
                <span className={styles.inputLabel}>Issued On</span>
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="validStill"
                rules={[{ required: true, message: 'Please select valid time!' }]}
              >
                <span className={styles.inputLabel}>Valid Still</span>
                <DatePicker />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Upload
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
