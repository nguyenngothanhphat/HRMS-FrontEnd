import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import moment from 'moment';
import { history } from 'umi';
import styles from './index.less';
import { TIMEOFF_COLOR } from '@/utils/timeOff';

export default class EventDetailBox extends PureComponent {
  goToLeaveRequest = (_id) => {
    history.push({
      pathname: `/time-off/overview/personal-timeoff/view/${_id}`,
    });
  };

  render() {
    const { data = {}, color = 0 } = this.props;
    const {
      fromDate: from = '',
      toDate: to = '',
      type = '',
      duration = '',
      typeName = '',
      _id = '',
      status = '',
    } = data;
    return (
      <Row onClick={() => this.goToLeaveRequest(_id)} className={styles.EventDetailBox}>
        <Col
          xs={8}
          className={styles.dateAndMonth}
          style={{
            justifyContent: 'space-evenly',
          }}
        >
          <span className={styles.container}>
            <span className={styles.day}>{moment(from).locale('en').format('DD')}</span>
            <span className={styles.month}>{moment(from).locale('en').format('MMM')}</span>
          </span>
          <span className={styles.subtractSymbol}>-</span>
          <span className={styles.container}>
            <span className={styles.day}>{moment(to).locale('en').format('DD')}</span>
            <span className={styles.month}>{moment(to).locale('en').format('MMM')}</span>
          </span>
        </Col>
        <Col xs={9} className={styles.eventOfDay}>
          {typeName}
        </Col>
        <Col
          className={
            color === 1
              ? `${styles.dayInWeek} ${styles.upcomingColor}`
              : `${styles.dayInWeek} ${styles.leaveTakenColor}`
          }
          style={{
            color: TIMEOFF_COLOR[status],
          }}
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
