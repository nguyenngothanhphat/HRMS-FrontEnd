import { Button, Card, Col, Form, Radio, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { FORM_ITEM_NAME } from '@/utils/timeOff';
import AccrualRate from './components/AccrualRate';
import styles from './index.less';

const { ACCRUAL_POLICY_ACCRUAL_METHOD } = FORM_ITEM_NAME;

const AccrualPolicy = (props) => {
  const { form = {} } = props;

  const [isUnlimited, setIsUnlimited] = useState(false);

  const onChange = (e) => {
    setIsUnlimited(e.target.value === 'unlimited');
  };

  useEffect(() => {
    const values = form.getFieldsValue();
    setIsUnlimited(values[ACCRUAL_POLICY_ACCRUAL_METHOD] === 'unlimited');
  }, []);

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
      {!isUnlimited && (
        <div className={styles.accrualRate}>
          <span className={styles.label}>Accrual Rate</span>
          <div className={styles.items}>
            <Row gutter={[24, 24]}>
              <Form.List name={FORM_ITEM_NAME.ACCRUAL_POLICY_ACCRUAL_RATE}>
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
      )}
    </Card>
  );
};
export default connect(() => ({}))(AccrualPolicy);
