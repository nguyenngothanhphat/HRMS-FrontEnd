import { Col, Form, Input, Row } from 'antd';
import React, { PureComponent } from 'react';
import s from './index.less';

export default class NewField extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <Form.Item>
          <Row>
            <Col span={8}>
              <p>Bank Account</p>
            </Col>
            <Col span={16}>
              <Input placeholder="Enter bank account" />
            </Col>
          </Row>
        </Form.Item>
      </div>
    );
  }
}
