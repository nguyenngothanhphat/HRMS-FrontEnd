import React, { PureComponent } from 'react';
import { Form, Col, Input } from 'antd';
// import styles from './index.less';

export default class AdhaarCardForm extends PureComponent {
  render() {
    return (
      <Col span={12}>
        <Form.Item
          name="adhaarNumber"
          label="Adhaar Number"
          rules={[
            {
              required: true,
              pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
              message: 'Invalid Adhaar Number',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Col>
    );
  }
}
