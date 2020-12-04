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
        {from === to ? (
          <>
            <Col xs={4} className={styles.dateAndMonth} style={{ justifyContent: 'center' }}>
              <span className={styles.container}>
                <span className={styles.month}>{moment(from).locale('en').format('MMM')}</span>
                <span className={styles.day}>{moment(from).locale('en').format('DD')}</span>
              </span>
            </Col>
            <Col xs={15} className={styles.eventOfDay}>
              {name}
            </Col>
          </>
        ) : (
          <>
            <Col
              xs={8}
              className={styles.dateAndMonth}
              style={{
                justifyContent: 'space-evenly',
              }}
            >
              <span className={styles.container}>
                <span className={styles.month}>{moment(from).locale('en').format('MMM')}</span>
                <span className={styles.day}>{moment(from).locale('en').format('DD')}</span>
              </span>
              <span className={styles.subtractSymbol}>-</span>
              <span className={styles.container}>
                <span className={styles.month}>{moment(to).locale('en').format('MMM')}</span>
                <span className={styles.day}>{moment(to).locale('en').format('DD')}</span>
              </span>
            </Col>
            <Col xs={11} className={styles.eventOfDay}>
              {name}
            </Col>
          </>
        )}

        <Col
          className={
            color === 1
              ? `${styles.dayInWeek} ${styles.upcomingColor}`
              : `${styles.dayInWeek} ${styles.leaveTakenColor}`
          }
          xs={5}
        >
          {`-`}
          {duration} {type}
          <span>
            <RightOutlined className={styles.arrowIcon} />
          </span>
        </Col>
      </Row>
    );
  }
}
