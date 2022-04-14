import { Button, Card, Col, Form, Radio, Row, Space } from 'antd';
import React from 'react';
import { connect } from 'umi';
import AccrualRate from './components/AccrualRate';
import styles from './index.less';

const AccrualPolicy = () => {
  return (
    <Card title="Accrual Policy" className={styles.AccrualPolicy}>
      <div className={styles.accrualMethod}>
        <span className={styles.label}>Accrual Method</span>
        <Form.Item
          rules={[{ required: true, message: 'Required field!' }]}
          name="accrualPolicy.accrualMethod"
          valuePropName="value"
        >
          <Radio.Group>
            <Space direction="vertical">
              <Space direction="vertical">
                <Radio value="unlimited">Unlimited</Radio>
                <Radio value="daysOfYear">Days / Year (Frontload)</Radio>
              </Space>
              <Space direction="horizontal">
                <Radio value="daysOfQuarter">Days / Quarter Worked</Radio>
                <Radio value="daysOfMonth">Days / Month worked</Radio>
                <Radio value="daysOfFortnight">Days / Fortnight worked</Radio>
              </Space>
            </Space>
          </Radio.Group>
        </Form.Item>
      </div>
      <div className={styles.accrualRate}>
        <span className={styles.label}>Accrual Rate</span>
        <div className={styles.items}>
          <Row gutter={[24, 24]}>
            <Form.List name="accrualPolicy.accrualRate">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Col span={24} key={key}>
                      <AccrualRate name={name} remove={remove} />
                    </Col>
                  ))}
                  <Col span={24}>
                    <Form.Item>
                      <Button onClick={add}>Add a new accrual rate</Button>
                    </Form.Item>
                  </Col>
                </>
              )}
            </Form.List>
          </Row>
        </div>
      </div>
    </Card>
  );
};
export default connect(() => ({}))(AccrualPolicy);
