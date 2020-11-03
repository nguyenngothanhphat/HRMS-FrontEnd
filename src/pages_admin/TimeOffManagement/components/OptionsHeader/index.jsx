import React, { PureComponent } from 'react';
import { Row, Col, Form, Select, DatePicker } from 'antd';
import styles from './index.less';

const { Option } = Select;
export default class OptionsHeader extends PureComponent {
  render() {
    const dateFormat = 'Do MMM YYYY';
    return (
      <div className={styles.OptionsHeader}>
        <div className={styles.container}>
          <Form name="uploadForm" ref={this.formRef}>
            <Row gutter={['20', '20']}>
              <Col xs={5}>
                <Form.Item label="User ID - Name" name="userIdName">
                  <Select onChange={() => {}}>
                    <Option value="Company A">User A</Option>
                    <Option value="Company B">User B</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={5}>
                <Form.Item label="Duration" name="duration">
                  <DatePicker placeholder="From Date" format={dateFormat} />
                </Form.Item>
              </Col>
              <Col xs={5}>
                <Form.Item label="" name="duration">
                  <DatePicker placeholder="To Date" format={dateFormat} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}
