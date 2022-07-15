import { Col, Row, Tooltip } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { history } from 'umi';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import EmptyComponent from '@/components/Empty';
import styles from './index.less';

const { ACCEPTED, REJECTED } = TIMEOFF_STATUS;
export default class LeaveHistoryList extends PureComponent {
  goToLeaveRequest = (_id) => {
    history.push({
      pathname: `/time-off/overview/personal-timeoff/view/${_id}`,
    });
  };

  getStatus = (status) => {
    if (status === ACCEPTED)
      return <span className={`${styles.status} ${styles.approved}`}>Approved</span>;
    if (status === REJECTED)
      return <span className={`${styles.status} ${styles.rejected}`}>Rejected</span>;
    return <span className={`${styles.status} ${styles.applied}`}>Applied</span>;
  };

  renderRow = (fromDate, toDate) => {
    return (
      <Col xs={8} className={styles.dateAndMonth} style={{ justifyContent: 'space-evenly' }}>
        {' '}
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
    const { leavingList = [] } = this.props;
    const getTitle = (leaveDates = []) => {
      return leaveDates.map((x) => (
        <div key={x._id}>
          <span>{moment(x.date).locale('en').format('DD')}</span>{' '}
          <span>{`${moment(x.date).locale('en').format('MMM')} (${x.timeOfDay})`}</span>
        </div>
      ));
    };

    return (
      <div className={styles.LeaveHistoryList}>
        {leavingList.map((row, index) => {
          const { fromDate = '', toDate = '', typeName = '', _id, status, leaveDates = [] } = row;
          return (
            <Row
              key={`${index + 1}`}
              className={styles.eachRow}
              onClick={() => this.goToLeaveRequest(_id)}
            >
              {!isEmpty(leaveDates) ? (
                <Tooltip title={() => getTitle(leaveDates)}>
                  {this.renderRow(fromDate, toDate)}
                </Tooltip>
              ) : (
                this.renderRow(fromDate, toDate)
              )}
              <Col xs={10} className={styles.eventOfDay}>
                {typeName}
              </Col>

              <Col className={styles.text} xs={6}>
                {this.getStatus(status)}
              </Col>
            </Row>
          );
        })}
        {leavingList.length === 0 && <EmptyComponent />}
      </div>
    );
  }
}
