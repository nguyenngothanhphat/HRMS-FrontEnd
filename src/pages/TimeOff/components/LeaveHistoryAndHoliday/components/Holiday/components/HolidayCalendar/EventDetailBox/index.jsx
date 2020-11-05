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
        <Col xs={3} className={styles.dateAndMonth}>
          <span>{moment(fromDate).locale('en').format('MMM')}</span>
          <span>{moment(fromDate).locale('en').format('DD')}</span>
        </Col>
        {fromDate !== toDate ? (
          <Col xs={4} className={styles.dateAndMonth}>
            <span>{moment(toDate).locale('en').format('MMM')}</span>
            <span>{moment(toDate).locale('en').format('DD')}</span>
          </Col>
        ) : (
          <Col xs={4} />
        )}

        <Col xs={13} className={styles.eventOfDay}>
          <span>{name}</span>
        </Col>
      </Row>
    );
  }
}
