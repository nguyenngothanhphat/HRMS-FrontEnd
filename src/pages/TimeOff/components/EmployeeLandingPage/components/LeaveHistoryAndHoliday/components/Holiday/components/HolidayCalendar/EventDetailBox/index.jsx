import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import styles from './index.less';

export default class EventDetailBox extends PureComponent {
  render() {
    const { data = [] } = this.props;
    const { fromDate = '', toDate = '', name = '' } = data;
    return (
      <Row className={styles.EventDetailBox}>
        <Col xs={4} className={styles.dateAndMonth}>
          <div className={styles.container}>
            <span className={styles.month}>{moment(fromDate).locale('en').format('MMM')}</span>
            <span className={styles.day}>{moment(fromDate).locale('en').format('DD')}</span>
          </div>
        </Col>

        <Col xs={16} className={styles.eventOfDay}>
          <span>{name}</span>
        </Col>
        <Col xs={4} className={styles.dateName}>
          <span>{moment(fromDate).locale('en').format('ddd')}</span>
        </Col>
      </Row>
    );
  }
}
