import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import styles from './index.less';

export default class EventDetailBox extends PureComponent {
  render() {
    const { data = [] } = this.props;
    const { name = '', date: { iso = '', dateTime: { month = '' } } = {} } = data;
    const newDate = new Date(iso);
    return (
      <Row className={styles.EventDetailBox}>
        <Col xs={4} className={styles.dateAndMonth}>
          <div className={styles.container}>
            <span className={styles.month}>{moment.utc(newDate).locale('en').format('MMM')}</span>
            <span className={styles.day}>{moment.utc(newDate).locale('en').format('DD')}</span>
          </div>
        </Col>

        <Col xs={16} className={styles.eventOfDay}>
          <span>{name}</span>
        </Col>
        <Col xs={4} className={styles.dateName}>
          <span>{moment.utc(newDate).locale('en').format('dddd')}</span>
        </Col>
      </Row>
    );
  }
}
