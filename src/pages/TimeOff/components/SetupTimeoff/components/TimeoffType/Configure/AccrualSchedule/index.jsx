import React, { Component } from 'react';
import { Checkbox, Row, Col, Select, DatePicker, Collapse } from 'antd';
import ListReview from './ListReview';
import styles from './index.less';

class AccrualSchedule extends Component {
  onChange = () => {};

  render() {
    return (
      <div className={styles.accrualContent}>
        <div className={styles.title}>Accrual Schedule</div>
        <div className={styles.borderStyles} />
        <div className={styles.form}>
          <Row gutter={[31, 25]} justify="space-around">
            <Col xs={24} sm={24} md={24} lg={7} xl={7}>
              <Select className={styles.select} defaultValue="Accrual frequency" />
            </Col>
            <Col xs={24} sm={24} md={24} lg={7} xl={7}>
              <Select className={styles.select} defaultValue="Accrual frequency" />
            </Col>
            <Col xs={24} sm={24} md={24} lg={7} xl={7}>
              <Select className={styles.select} defaultValue="Accrual frequency" />
            </Col>
          </Row>
          <Checkbox className={styles.checkbox}>Use hire date anniveraries</Checkbox>
        </div>
        <div className={styles.listForm}>
          <ListReview />
        </div>
      </div>
    );
  }
}

export default AccrualSchedule;
