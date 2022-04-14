import { Col, Form, Input, InputNumber, Popconfirm, Radio, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import DelIcon from '@/assets/timeOff/del.svg';
import styles from './index.less';
import TimeOffRequestsTable from '@/pages/TimeOff/components/EmployeeLandingPage/components/TimeOffRequestsTable';

const COL_SPAN = {
  A: 9,
  B: 1,
  C: 4,
  D: 1,
  E: 7,
  F: 2,
};
const CarryForwardItem = (props) => {
  const { name = '', remove = () => {}, index = 0 } = props;

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
              <Form.Item name={[name, 'carryForwardCap.from']}>
                <Input placeholder="0" />
              </Form.Item>
              <span>Years to Less than</span>
              <Form.Item name={[name, 'carryForwardCap.to']}>
                <Input placeholder="0" />
              </Form.Item>
              <span>Years of Service</span>
            </div>
          </Col>
          <Col sm={COL_SPAN.B}>
            <div className={styles.divider} dashed type="vertical" />
          </Col>

          <Col sm={COL_SPAN.C}>
            <Form.Item name={[name, 'carryForwardAllowed']} valuePropName="value">
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
                <Form.Item name={[name, 'maximumCarryForwardValue.value']}>
                  <InputNumber prefix="days" min={0} max={100000} defaultValue={0} />
                </Form.Item>
              </div>

              <Form.Item name={[name, 'maximumCarryForwardValue.unit']} valuePropName="value">
                <Radio.Group buttonStyle="solid" defaultValue="d">
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
