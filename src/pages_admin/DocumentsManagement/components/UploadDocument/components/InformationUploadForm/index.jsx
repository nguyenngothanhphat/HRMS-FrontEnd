import React, { PureComponent } from 'react';
import { Form, Select, Input, Button, Row, Col, DatePicker } from 'antd';

import styles from './index.less';

const { Option } = Select;

export default class InformationUploadForm extends PureComponent {
  onFinish = (fieldsValue) => {
    console.log('fieldsValue', fieldsValue);
  };

  render() {
    return (
      <div className={styles.InformationUploadForm}>
        <div className={styles.formTitle}>
          <span>Document Information</span>
        </div>
        <Form name="uploadForm" layout="vertical" onFinish={this.onFinish}>
          <Row gutter={['20', '20']}>
            <Col span={12}>
              <Form.Item
                label="Employee ID"
                name="employeeId"
                rules={[
                  {
                    required: true,
                    message: 'Please input employee ID!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Employee Name" name="employeeName">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={['20', '20']}>
            <Col span={12}>
              <Form.Item
                label="Document Type"
                name="documentType"
                rules={[{ required: true, message: 'Please select document type!' }]}
              >
                <Select onChange={() => {}}>
                  <Option value="Type 1">Type 1</Option>
                  <Option value="Type 2">Type 2</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Company"
                name="company"
                rules={[{ required: true, message: 'Please select company!' }]}
              >
                <Select onChange={() => {}}>
                  <Option value="Company A">Company A</Option>
                  <Option value="Company B">Company B</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={['20', '20']}>
            <Col span={12}>
              <Form.Item
                name="visaNumber"
                label="Visa Number"
                rules={[
                  {
                    required: true,
                    pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                    message: 'Invalid Visa Number',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="visaType"
                label="Visa Type"
                rules={[{ required: true, message: 'Please select visa type!' }]}
              >
                <Select onChange={() => {}}>
                  <Option value="Type 1">Type 1</Option>
                  <Option value="Type 2">Type 2</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={['20', '20']}>
            <Col span={12}>
              <Form.Item
                name="country"
                label="Country"
                rules={[{ required: true, message: 'Please select country!' }]}
              >
                <Select onChange={() => {}}>
                  <Option value="US">US</Option>
                  <Option value="India">India</Option>
                  <Option value="Vietnam">Vietnam</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="entryType"
                label="Entry Type"
                rules={[{ required: true, message: 'Please select entry type!' }]}
              >
                <Select onChange={() => {}}>
                  <Option value="Type 1">Type 1</Option>
                  <Option value="Type 2">Type 2</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={['20', '20']}>
            <Col span={12}>
              <Form.Item
                name="issuedOn"
                label="Issued On"
                rules={[{ required: true, message: 'Please select issued time!' }]}
              >
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="validStill"
                label="Valid Still"
                rules={[{ required: true, message: 'Please select expired time!' }]}
              >
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
