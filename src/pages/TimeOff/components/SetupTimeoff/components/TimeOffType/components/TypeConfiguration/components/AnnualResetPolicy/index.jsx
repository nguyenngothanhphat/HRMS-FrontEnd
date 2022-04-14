import { Card, Col, Form, DatePicker, Row, Radio, Space } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const AnnualResetPolicy = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onChange = () => {};
  return (
    <Card title="Negative Leave Balance" className={styles.AnnualResetPolicy}>
      <Row gutter={[24, 24]} align="middle">
        <Col sm={18}>
          <div className={styles.annualReset}>
            <span className={styles.label}>How do you want to reset?</span>
            <Radio.Group name="accrualMethod" defaultValue={1}>
              <Space direction="horizontal">
                <Radio value={1}>Anniversary Date</Radio>
                <Radio value={2}>Calendar Date</Radio>
              </Space>
            </Radio.Group>
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 24]} align="middle">
        <span className={styles.label}>Select Date</span>
        <Col sm={18}>
          <Form.Item>
            <DatePicker
              onChange={onChange}
              format={isOpen ? 'MM-DD-YYYY' : 'dddd'}
              onOpenChange={(status) => {
                setIsOpen(status);
              }}
            />
          </Form.Item>
        </Col>
        <Col sm={14} />
      </Row>
    </Card>
  );
};
export default connect(() => ({}))(AnnualResetPolicy);
