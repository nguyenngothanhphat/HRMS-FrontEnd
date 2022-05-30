import { Checkbox, Col, DatePicker, Form, Input, Row } from 'antd';
import moment from 'moment';
import React from 'react';
import styles from './index.less';

const Certification = (props) => {
  const {
    certification: {
      name = '', // name
      neverExpired = false,
      issuedDate = '',
      expiryDate = '',
    } = {},
  } = props;

  return (
    <div className={styles.Certification}>
      <Form
        name="basic"
        initialValues={{
          name,
          neverExpired,
          issuedDate: issuedDate ? moment(issuedDate) : null,
          expiryDate: expiryDate ? moment(expiryDate) : null,
        }}
      >
        <Form.Item label="Certification name" name="name" labelCol={{ span: 24 }}>
          <Input disabled placeholder="Certification name" />
        </Form.Item>

        <Form.Item name="neverExpired" valuePropName="checked">
          <Checkbox disabled>Never expires</Checkbox>
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label="Issued date" name="issuedDate" labelCol={{ span: 24 }}>
              <DatePicker placeholder="Issued date" format="MM/DD/YYYY" disabled />
            </Form.Item>
          </Col>
          {!neverExpired && (
            <Col span={12}>
              <Form.Item label="Validity date" name="expiryDate" labelCol={{ span: 24 }}>
                <DatePicker placeholder="Validity date" disabled format="MM/DD/YYYY" />
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </div>
  );
};
export default Certification;
