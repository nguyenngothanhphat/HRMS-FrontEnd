import { RightOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { history } from 'umi';
import { isEmpty } from 'lodash';
import { TIMEOFF_COLOR } from '@/utils/timeOff';
import styles from './index.less';

export default class EventDetailBox extends PureComponent {
  goToLeaveRequest = (_id) => {
    history.push({
      pathname: `/time-off/overview/personal-timeoff/view/${_id}`,
    });
  };

  renderRow = (fromDate, toDate) => {
    return (
      <Col xs={8} className={styles.dateAndMonth} style={{ justifyContent: 'space-evenly' }}>
        <span className={styles.container}>
          <span className={styles.day}>{moment(fromDate).locale('en').format('DD')}</span>
          <span className={styles.month}>{moment(fromDate).locale('en').format('MMM')}</span>
        </span>
        <span className={styles.subtractSymbol}>-</span>
        <span className={styles.container}>
          <span className={styles.day}>{moment(toDate).locale('en').format('DD')}</span>
          <span className={styles.month}>{moment(toDate).locale('en').format('MMM')}</span>
        </span>
      </Col>
    );
  };

  render() {
    const { data = {}, color = 0 } = this.props;

    const getTitle = (leaveDates = []) => {
      return leaveDates.map((x) => (
        <div key={x._id}>
          <span>{moment(x.date).locale('en').format('DD')}</span>{' '}
          <span>{`${moment(x.date).locale('en').format('MMM')} (${x.timeOfDay})`}</span>
        </div>
      ));
    };

    const {
      fromDate = '',
      toDate = '',
      type = '',
      duration = '',
      typeName = '',
      _id = '',
      status = '',
      leaveDates = [],
    } = data;

    return (
      <Row onClick={() => this.goToLeaveRequest(_id)} className={styles.EventDetailBox}>
        {!isEmpty(leaveDates) ? (
          <Tooltip title={() => getTitle(leaveDates)}>{this.renderRow(fromDate, toDate)}</Tooltip>
        ) : (
          this.renderRow(fromDate, toDate)
        )}
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
