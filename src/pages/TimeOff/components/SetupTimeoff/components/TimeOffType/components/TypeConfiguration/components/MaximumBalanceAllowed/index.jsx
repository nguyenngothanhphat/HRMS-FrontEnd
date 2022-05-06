import { Card, Col, Form, Input, Row, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { convertDaysToHours, convertHoursToDays, FORM_ITEM_NAME, TIME_TEXT } from '@/utils/timeOff';
import styles from './index.less';

const {
  MAXIMUM_BALANCE_ALLOWED_UNIT,
  MAXIMUM_BALANCE_ALLOWED,
  UNIT,
  MAXIMUM_BALANCE_ALLOWED_VALUE,
} = FORM_ITEM_NAME;

const MaximumBalanceAllowed = (props) => {
  const { configs = {}, form, workHourPerDay = 0, renderErrorMessage = () => {} } = props;
  const [suffixText, setSuffixText] = useState(TIME_TEXT.d);

  const convertValues = (type) => {
    const formValues = form.getFieldsValue();
    const temp = formValues[MAXIMUM_BALANCE_ALLOWED_VALUE];

    if (workHourPerDay === 0) {
      renderErrorMessage();
    }
    if (workHourPerDay !== 0 && temp !== 0) {
      let value = '';
      switch (type) {
        case 'd':
          value = convertHoursToDays(workHourPerDay, temp);
          break;
        case 'h':
          value = convertDaysToHours(workHourPerDay, temp);
          break;

        default:
          break;
      }
      form.setFieldsValue({
        [MAXIMUM_BALANCE_ALLOWED_VALUE]: value,
      });
    }
  };

  const onUnitChange = (e) => {
    const { target: { value = '' } = {} || {} } = e;
    setSuffixText(TIME_TEXT[value]);
    convertValues(value);
  };

  useEffect(() => {
    setSuffixText(TIME_TEXT[configs?.[MAXIMUM_BALANCE_ALLOWED]?.[UNIT]] || TIME_TEXT.d);
  }, [JSON.stringify(configs)]);

  return (
    <Card title="Maximum Balance Allowed" className={styles.MaximumBalanceAllowed}>
      <Row gutter={[24, 24]} align="middle">
        <Col sm={10}>
          <span className={styles.label}>
            Maximum Leave Balance allowed (Leave accrual stops if an employee reaches this value).
          </span>
        </Col>
        <Col sm={12}>
          <div className={styles.rightPart}>
            <div style={{ marginRight: 16 }}>
              <Form.Item name={MAXIMUM_BALANCE_ALLOWED_VALUE}>
                <Input suffix={suffixText} type="number" min={0} max={100} defaultValue="0" />
              </Form.Item>
            </div>
            <div className={styles.viewTypeSelector}>
              <Form.Item name={MAXIMUM_BALANCE_ALLOWED_UNIT} valuePropName="value">
                <Radio.Group buttonStyle="solid" defaultValue="d" onChange={onUnitChange}>
                  <Radio.Button value="d">Days</Radio.Button>
                  <Radio.Button value="h">Hours</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
        </Col>
        <Col sm={2} />
      </Row>
    </Card>
  );
};
export default connect(() => ({}))(MaximumBalanceAllowed);
