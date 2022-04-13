import { Card, Col, Radio, Row, Space } from 'antd';
import React from 'react';
import { connect } from 'umi';
import AccrualRate from './components/AccrualRate';
import styles from './index.less';

const AccrualPolicy = () => {
  const data = [
    {
      from: 0,
      to: 5,
      daysPerYear: 0,
    },
    {
      from: 5,
      to: 10,
      daysPerYear: 0,
    },
  ];

  return (
    <Card title="Accrual Policy" className={styles.AccrualPolicy}>
      <div className={styles.accrualMethod}>
        <span className={styles.label}>Accrual Method</span>
        <Radio.Group name="radiogroup" defaultValue={1}>
          <Space direction="vertical">
            <Space direction="vertical">
              <Radio value={1}>Unlimited</Radio>
              <Radio value={2}>Days / Year (Frontload)</Radio>
            </Space>
            <Space direction="horizontal">
              <Radio value={3}>Days / Quarter Worked</Radio>
              <Radio value={4}>Days / Month worked</Radio>
              <Radio value={5}>Days / Fortnight worked</Radio>
            </Space>
          </Space>
        </Radio.Group>
      </div>
      <div className={styles.accrualRate}>
        <span className={styles.label}>Accrual Rate</span>
        <div className={styles.items}>
          <Row gutter={[24, 24]}>
            {data.map((x, i) => (
              <Col span={24}>
                <AccrualRate key={`${i + 1}`} item={x} />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </Card>
  );
};
export default connect(() => ({}))(AccrualPolicy);
