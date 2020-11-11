import React, { Component } from 'react';
import { Checkbox, Row, Col, Select, DatePicker } from 'antd';
import ListReview from './ListReview';
import styles from './index.less';

class AccrualSchedule extends Component {
  onChange = () => {};

  render() {
    return (
      <Row className={styles.accrualContent}>
        <Col span={9} className={styles.form}>
          <Select className={styles.select} />
          <div style={{ marginTop: '20px', paddingBottom: '20px' }}>
            <Select className={styles.select} />
          </div>
          <DatePicker className={styles.datePicker} />
          <Checkbox>Use hire date anniveraries</Checkbox>
        </Col>
        <Col span={15} className={styles.listForm}>
          <ListReview />
        </Col>
      </Row>
    );
  }
}

export default AccrualSchedule;
