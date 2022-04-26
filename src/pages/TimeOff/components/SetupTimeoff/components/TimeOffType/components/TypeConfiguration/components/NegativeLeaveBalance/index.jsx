import { Card, Col, Form, Input, Radio, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { convertDaysToHours, convertHoursToDays, FORM_ITEM_NAME, TIME_TEXT } from '@/utils/timeOff';
import styles from './index.less';

const {
  NEGATIVE_LEAVE_BALANCE,
  MAXIMUM,
  UNIT,
  NEGATIVE_LEAVE_BALANCE_MAXIMUM_UNIT,
  NEGATIVE_LEAVE_BALANCE_ALLOWED,
  NEGATIVE_LEAVE_BALANCE_MAXIMUM_VALUE,
} = FORM_ITEM_NAME;

const NegativeLeaveBalance = (props) => {
  const { configs = {}, form } = props;
  const [suffixText, setSuffixText] = useState(TIME_TEXT.d);

  const convertValues = (type) => {
    const formValues = form.getFieldsValue();
    const temp = formValues[NEGATIVE_LEAVE_BALANCE_MAXIMUM_VALUE];

    let value = '';
    switch (type) {
      case 'd':
        value = convertHoursToDays(8, temp);
        break;
      case 'h':
        value = convertDaysToHours(8, temp);
        break;

      default:
        break;
    }
    form.setFieldsValue({
      [NEGATIVE_LEAVE_BALANCE_MAXIMUM_VALUE]: value,
    });
  };

  const onUnitChange = (e) => {
    const { target: { value = '' } = {} || {} } = e;
    setSuffixText(TIME_TEXT[value]);
    convertValues(value);
  };

  useEffect(() => {
    const suffixTextTemp = TIME_TEXT[configs[NEGATIVE_LEAVE_BALANCE]?.[MAXIMUM]?.[UNIT]];
    setSuffixText(suffixTextTemp || TIME_TEXT.d);
  }, [JSON.stringify(configs)]);

  return (
    <Card title="Negative Leave Balance" className={styles.NegativeLeaveBalance}>
      <Row gutter={[24, 24]} align="middle" style={{ marginBottom: '24px' }}>
        <Col sm={10}>
          <span className={styles.label}>Negative Leave Balance allowed ?</span>
        </Col>
        <Col sm={8}>
          <div className={styles.viewTypeSelector}>
            <Form.Item name={NEGATIVE_LEAVE_BALANCE_ALLOWED} valuePropName="value">
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
              <Form.Item name={NEGATIVE_LEAVE_BALANCE_MAXIMUM_VALUE}>
                <Input suffix={suffixText} type="number" min={0} max={100000} defaultValue="0" />
              </Form.Item>
            </div>
            <div className={styles.viewTypeSelector}>
              <Form.Item name={NEGATIVE_LEAVE_BALANCE_MAXIMUM_UNIT} valuePropName="value">
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
