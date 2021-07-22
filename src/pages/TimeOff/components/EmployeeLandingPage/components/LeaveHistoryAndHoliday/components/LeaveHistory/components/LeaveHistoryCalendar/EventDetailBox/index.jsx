import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import moment from 'moment';
import { history } from 'umi';
import styles from './index.less';

export default class EventDetailBox extends PureComponent {
  goToLeaveRequest = (_id) => {
    history.push({
      pathname: `/time-off/overview/personal-timeoff/view/${_id}`,
    });
  };

  render() {
    const { data = [], color = 0 } = this.props;
    const {
      fromDate: from = '',
      toDate: to = '',
      type = '',
      duration = '',
      name = '',
      _id = '',
    } = data;
    return (
      <Row onClick={() => this.goToLeaveRequest(_id)} className={styles.EventDetailBox}>
        {from === to ? (
          <>
            <Col xs={4} className={styles.dateAndMonth} style={{ justifyContent: 'center' }}>
              <span className={styles.container}>
                <span className={styles.month}>{moment(from).locale('en').format('MMM')}</span>
                <span className={styles.day}>{moment(from).locale('en').format('DD')}</span>
              </span>
            </Col>
            <Col xs={13} className={styles.eventOfDay}>
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
            <Col xs={9} className={styles.eventOfDay}>
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
          xs={7}
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
