import { Button, Card, Col, Form, Radio, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { FORM_ITEM_NAME, TIMEOFF_ACCRUAL_METHOD } from '@/constants/timeOff';
import AccrualRate from './components/AccrualRate';
import styles from './index.less';

const { UNLIMITED, DAYS_OF_YEAR, DAYS_OF_QUARTER, DAYS_OF_MONTH, DAYS_OF_FORTNIGHT } =
  TIMEOFF_ACCRUAL_METHOD;

const { ACCRUAL_POLICY_ACCRUAL_METHOD, ACCRUAL_POLICY, ACCRUAL_METHOD } = FORM_ITEM_NAME;

const AccrualPolicy = (props) => {
  const { configs = {} } = props;
  const [selectedType, setSelectedType] = useState('');

  const onChange = (e) => {
    setSelectedType(e.target.value);
  };

  useEffect(() => {
    setSelectedType(configs?.[ACCRUAL_POLICY]?.[ACCRUAL_METHOD]);
  }, [JSON.stringify(configs)]);

  return (
    <Card title="Accrual Policy" className={styles.AccrualPolicy}>
      <div className={styles.accrualMethod}>
        <span className={styles.label}>Accrual Method</span>
        <Form.Item
          rules={[{ required: true, message: 'Required field!' }]}
          name={ACCRUAL_POLICY_ACCRUAL_METHOD}
          valuePropName="value"
        >
          <Radio.Group onChange={onChange}>
            <Space direction="vertical">
              <Space direction="vertical">
                <Radio value={UNLIMITED}>Unlimited</Radio>
                <Radio value={DAYS_OF_YEAR}>Days / Year (Frontload)</Radio>
              </Space>
              <Space direction="horizontal">
                <Radio value={DAYS_OF_QUARTER}>Days / Quarter Worked</Radio>
                <Radio value={DAYS_OF_MONTH}>Days / Month worked</Radio>
                <Radio value={DAYS_OF_FORTNIGHT}>Days / Fortnight worked</Radio>
              </Space>
            </Space>
          </Radio.Group>
        </Form.Item>
      </div>
      {selectedType && selectedType !== UNLIMITED && (
        <div className={styles.accrualRate}>
          <span className={styles.label}>Accrual Rate</span>
          <div className={styles.items}>
            <Row gutter={[24, 24]}>
              <Form.List name={FORM_ITEM_NAME.ACCRUAL_POLICY_ACCRUAL_RATE}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name }) => (
                      <Col span={24} key={key}>
                        <AccrualRate name={name} remove={remove} selectedType={selectedType} />
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
      )}
    </Card>
  );
};
export default connect(() => ({}))(AccrualPolicy);
