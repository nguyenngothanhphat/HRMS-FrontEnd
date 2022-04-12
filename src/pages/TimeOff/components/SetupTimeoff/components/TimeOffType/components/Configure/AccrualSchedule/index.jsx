import React, { Component } from 'react';
import {
  Checkbox,
  // Row,
  Col,
  Select,
  // DatePicker, Collapse,
  Divider,
} from 'antd';
import ListReview from './ListReview';
import styles from './index.less';

class AccrualSchedule extends Component {
  onChange = () => {};

  render() {
    // const { accruallSchedule } = this.props;
    return (
      <div className={styles.accrualSection}>
        <div className={styles.title}>Accrual Schedule</div>
        <div className={styles.borderStyles} />
        <div className={styles.accrualContent}>
          <div className={styles.form}>
            {/* <Row gutter={[24, 12]} className={styles.accrualList}>
              <Col xs={24} sm={24} md={24} lg={7} xl={7} span={7}>
                <Select className={styles.select} defaultValue="Accrual frequency" />
              </Col>
              <Col xs={24} sm={24} md={24} lg={7} xl={7} span={7}>
                <Select className={styles.select} defaultValue="Accrual frequency" />
              </Col>
              <Col xs={24} sm={24} md={24} lg={7} xl={7} span={7}>
                <Select className={styles.select} defaultValue="Accrual frequency" />
              </Col>
            </Row>
            <Checkbox className={styles.checkbox}>Use hire date anniveraries</Checkbox> */}
            <div className={styles.accrualList}>
              <div>
                <Select className={styles.select} defaultValue="Accrual frequency" />
              </div>
              <Col span={7}>
                <Select className={styles.select} defaultValue="Accrual frequency" />
              </Col>
              <div>
                <Select className={styles.select} defaultValue="Accrual frequency" />
              </div>
            </div>
            <Checkbox className={styles.checkbox}>Use hire date anniveraries</Checkbox>
          </div>

          <Divider className={styles.divider} />

          <div className={styles.listForm}>
            <ListReview />
          </div>
        </div>
      </div>
    );
  }
}

export default AccrualSchedule;
