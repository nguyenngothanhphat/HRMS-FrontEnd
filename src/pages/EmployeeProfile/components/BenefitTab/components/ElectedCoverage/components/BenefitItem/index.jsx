import { Col, Row } from 'antd';
import moment from 'moment';
import React from 'react';
import styles from './index.less';

const BenefitItem = (props) => {
  const { item = {} } = props;
  const { category, name, deductionDate } = item;

  return (
    <div className={styles.BenefitItem}>
      <Row className={styles.eachLine}>
        <Col span={24}>
          <span className={styles.name}>{category}</span>
        </Col>
      </Row>
      <Row className={styles.eachLine}>
        <Col span={6}>
          <span className={styles.label}>Plan</span>
        </Col>
        <Col span={18}>
          <span className={styles.linkValue}>{name}</span>
        </Col>
      </Row>
      <Row className={styles.eachLine}>
        <Col span={6}>
          <span className={styles.label}>Coverage End Date</span>
        </Col>
        <Col span={18}>
          <span className={styles.value}>
            {moment(deductionDate, 'YYYY-MM-DD').locale('en').format('Do MMMM YYYY')}
          </span>
        </Col>
      </Row>
    </div>
  );
};
export default BenefitItem;
