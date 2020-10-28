import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';

import moment from 'moment';
import styles from './index.less';

export default class EventDetailBox extends PureComponent {
  render() {
    const { data = [] } = this.props;
    const { from = '', to = '', type = '', duration = '', description = '' } = data;
    return (
      <Row className={styles.EventDetailBox}>
        <Col xs={5} className={styles.dateAndMonth}>
          <span>{moment(from).locale('en').format('MMMM')}</span>
          <span>{moment(from).locale('en').format('DD')}</span>
        </Col>
        <Col xs={5} className={styles.dateAndMonth}>
          <span>{moment(to).locale('en').format('MMMM')}</span>
          <span>{moment(to).locale('en').format('DD')}</span>
        </Col>
        <Col xs={11} className={styles.eventOfDay}>
          {description}
        </Col>
        <Col className={styles.dayInWeek} xs={3}>
          {`-`}
          {duration}
          <span>{type}</span>
        </Col>
      </Row>
    );
  }
}
