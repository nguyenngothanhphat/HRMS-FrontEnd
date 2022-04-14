import { Card, Col, Form, Input, Radio, Row } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const NegativeLeaveBalance = () => {
  const [unit, setUnit] = useState('d');
  const onUnitChange = (e) => {
    const { target: { value = '' } = {} || {} } = e;
    setUnit(value);
  };

  return (
    <Card title="Negative Leave Balance" className={styles.NegativeLeaveBalance}>
      <Row gutter={[24, 24]} align="middle" style={{ marginBottom: '24px' }}>
        <Col sm={10}>
          <span className={styles.label}>Negative Leave Balance allowed ?</span>
        </Col>
        <Col sm={8}>
          <div className={styles.viewTypeSelector}>
            <Form.Item name="negativeLeaveBalance.allowed" valuePropName="value">
              <Radio.Group buttonStyle="solid" defaultValue={false}>
                <Radio.Button value>Yes</Radio.Button>
                <Radio.Button value={false}>No</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </div>
        </Col>
        <Col sm={6} />
      </Row>
      <Row gutter={[24, 24]} align="middle">
        <Col sm={10}>
          <span className={styles.label}>Maximum Negative Leave Balance</span>
        </Col>
        <Col sm={10}>
          <div className={styles.rightPart}>
            <div style={{ marginRight: 16 }}>
              <Form.Item name="negativeLeaveBalance.maximum.value">
                <Input suffix="days" type="number" min={0} max={100000} defaultValue="0" />
              </Form.Item>
            </div>
            <div className={styles.viewTypeSelector}>
              <Form.Item name="negativeLeaveBalance.maximum.unit" valuePropName="value">
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
export default connect(() => ({}))(NegativeLeaveBalance);
