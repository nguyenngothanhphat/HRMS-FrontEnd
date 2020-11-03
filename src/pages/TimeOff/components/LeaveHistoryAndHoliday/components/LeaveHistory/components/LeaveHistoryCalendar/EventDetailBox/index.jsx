import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';

export default class EventDetailBox extends PureComponent {
  onEventClick = () => {
    // eslint-disable-next-line no-alert
    alert('View Leave Request');
  };

  render() {
    const { data = [], color = 0 } = this.props;
    const { fromDate: from = '', toDate: to = '', type = '', duration = '', name = '' } = data;
    return (
      <Row onClick={this.onEventClick} className={styles.EventDetailBox}>
        <Col xs={3} className={styles.dateAndMonth}>
          <span>{moment(from).locale('en').format('MMM')}</span>
          <span>{moment(from).locale('en').format('DD')}</span>
        </Col>
        <Col xs={3} className={styles.dateAndMonth}>
          <span>{moment(to).locale('en').format('MMM')}</span>
          <span>{moment(to).locale('en').format('DD')}</span>
        </Col>
        <Col xs={13} className={styles.eventOfDay}>
          {name}
        </Col>
        <Col
          className={
            color === 1
              ? `${styles.dayInWeek} ${styles.upcomingColor}`
              : `${styles.dayInWeek} ${styles.leaveTakenColor}`
          }
          xs={5}
        >
          {`-`}
          {duration}
          {type}
          <span>
            <RightOutlined className={styles.arrowIcon} />
          </span>
        </Col>
      </Row>
    );
  }
}
