import { Col, Form, Input, Popconfirm, Radio, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { convertDaysToHours, convertHoursToDays, FORM_ITEM_NAME, TIME_TEXT } from '@/utils/timeOff';
import DelIcon from '@/assets/timeOff/del.svg';
import styles from './index.less';

const { CARRY_FORWARD_POLICY, FROM, TO, UNIT, ALLOWED, VALUE, MAXIMUM_CARRY_FORWARD_VALUE } =
  FORM_ITEM_NAME;

const COL_SPAN = {
  A: 10,
  B: 1,
  C: 4,
  D: 1,
  E: 7,
  F: 1,
};
const CarryForwardItem = (props) => {
  const { configs = {}, name = '', remove = () => {}, index = 0, form } = props;
  const [suffixText, setSuffixText] = useState(TIME_TEXT.d);

  const convertValues = (type) => {
    const formValues = form.getFieldsValue();
    let carryForwardArr = JSON.parse(JSON.stringify(formValues[CARRY_FORWARD_POLICY]));
    const temp = formValues[CARRY_FORWARD_POLICY][index]?.[VALUE];

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

    carryForwardArr = carryForwardArr.map((x, i) => {
      if (i === index) {
        return {
          ...x,
          [UNIT]: type,
          [VALUE]: value,
        };
      }
      return x;
    });

    form.setFieldsValue({
      [CARRY_FORWARD_POLICY]: [...carryForwardArr],
    });
  };

  const onUnitChange = (e) => {
    const { target: { value = '' } = {} || {} } = e;
    setSuffixText(TIME_TEXT[value]);
    convertValues(value);
  };

  useEffect(() => {
    setSuffixText(
      TIME_TEXT[configs[CARRY_FORWARD_POLICY]?.[index]?.[MAXIMUM_CARRY_FORWARD_VALUE]?.[UNIT]] ||
        TIME_TEXT.d,
    );
  }, [JSON.stringify(configs)]);

  return (
    <div className={styles.CarryForwardItem}>
      {index === 0 && (
        <Row className={styles.labels} gutter={[16, 16]} align="middle">
          <Col span={COL_SPAN.A}>
            <span>Carry Forward Cap</span>
          </Col>
          <Col span={COL_SPAN.B} />
          <Col span={COL_SPAN.C}>
            <span>Carry Forward Allowed</span>
          </Col>
          <Col span={COL_SPAN.D} />
          <Col span={COL_SPAN.E}>
            <span>Maximum Carry Forward Value</span>
          </Col>
          <Col span={COL_SPAN.F} />
        </Row>
      )}
      <div className={styles.container}>
        <Row align="middle" gutter={[16, 16]}>
          <Col sm={COL_SPAN.A}>
            <div className={styles.leftPart}>
              <span>From</span>
              <Form.Item
                name={[name, FROM]}
                rules={[{ required: true, message: 'Required field!' }]}
              >
                <Input placeholder="0" />
              </Form.Item>
              <span>Years to Less than</span>
              <Form.Item name={[name, TO]} rules={[{ required: true, message: 'Required field!' }]}>
                <Input placeholder="0" />
              </Form.Item>
              <span>Years of Service</span>
            </div>
          </Col>
          <Col sm={COL_SPAN.B}>
            <div className={styles.divider} dashed type="vertical" />
          </Col>

          <Col sm={COL_SPAN.C}>
            <Form.Item name={[name, ALLOWED]} valuePropName="value">
              <Radio.Group buttonStyle="solid" defaultValue>
                <Radio.Button value>Yes</Radio.Button>
                <Radio.Button value={false}>No</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col sm={COL_SPAN.D}>
            <div className={styles.divider} dashed type="vertical" />
          </Col>
          <Col sm={COL_SPAN.E}>
            <div className={styles.rightPart}>
              <div style={{ marginRight: 16 }}>
                <Form.Item
                  name={[name, VALUE]}
                  rules={[{ required: true, message: 'Required field!' }]}
                >
                  <Input suffix={suffixText} type="number" min={0} max={100000} defaultValue="0" />
                </Form.Item>
              </div>

              <Form.Item name={[name, UNIT]} valuePropName="value">
                <Radio.Group buttonStyle="solid" defaultValue="d" onChange={onUnitChange}>
                  <Radio.Button value="d">Days</Radio.Button>
                  <Radio.Button value="h">Hours</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </div>
          </Col>

          <Col span={COL_SPAN.F}>
            <div className={styles.actions}>
              <Popconfirm title="Sure to remove?" onConfirm={() => remove(name)}>
                <img src={DelIcon} alt="" />
              </Popconfirm>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default connect(() => ({}))(CarryForwardItem);
