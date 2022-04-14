import { Card, Col, Form, InputNumber, Row, Radio } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const MaximumBalanceAllowed = () => {
  const [unit, setUnit] = useState('d');
  const onUnitChange = (e) => {
    const { target: { value = '' } = {} || {} } = e;
    setUnit(value);
  };

  return (
    <Card title="Maximum Balance Allowed" className={styles.MaximumBalanceAllowed}>
      <Row gutter={[24, 24]} align="middle">
        <Col sm={10}>
          <span className={styles.label}>
            Maximum Leave Balance allowed (Leave accrual stops if an employee reaches this value).
          </span>
        </Col>
        <Col sm={10}>
          <div className={styles.rightPart}>
            <div style={{ marginRight: 16 }}>
              <Form.Item name="maximumBalanceAllowed.value">
                <InputNumber prefix="days" min={0} max={100000} defaultValue="0" />
              </Form.Item>
            </div>
            <div className={styles.viewTypeSelector}>
              <Form.Item name="maximumBalanceAllowed.unit" valuePropName="value">
                <Radio.Group buttonStyle="solid" defaultValue="d" onChange={onUnitChange}>
                  <Radio.Button value="d">Days</Radio.Button>
                  <Radio.Button value="h">Hours</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
        </Col>
        <Col sm={4} />
      </Row>
    </Card>
  );
};
export default connect(() => ({}))(MaximumBalanceAllowed);
