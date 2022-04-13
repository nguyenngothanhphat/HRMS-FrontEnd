import { Card, Col, Form, InputNumber, Row, Radio } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const NegativeLeaveBalance = (props) => {
  const { dispatch } = props;
  const onChange = () => {};
  return (
    <Card title="Negative Leave Balance" className={styles.LeaveType}>
      <Row gutter={[24, 24]} align="middle" style={{ marginBottom: '24px' }}>
        <Col sm={10}>
          <span className={styles.label}>Negative Leave Balance allowed ?</span>
        </Col>
        <Col sm={8}>
          <div className={styles.viewTypeSelector}>
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="Yes">Yes</Radio.Button>
              <Radio.Button value="No">No</Radio.Button>
            </Radio.Group>
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
            <Form.Item>
              <InputNumber
                prefix="days"
                min={0}
                max={100000}
                defaultValue="0"
                onChange={onChange}
              />
              <span className={styles.prefix}>days</span>
            </Form.Item>
            <div className={styles.viewTypeSelector}>
              <Radio.Group buttonStyle="solid">
                <Radio.Button value="Day">Day</Radio.Button>
                <Radio.Button value="Hours">Hours</Radio.Button>
              </Radio.Group>
            </div>
          </div>
        </Col>
        <Col sm={4} />
      </Row>
    </Card>
  );
};
export default connect(() => ({}))(NegativeLeaveBalance);
