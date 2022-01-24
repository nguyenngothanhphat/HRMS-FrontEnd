import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import { history } from 'umi';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
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

  render() {
    const { leavingList = [] } = this.props;

    return (
      <div className={styles.LeaveHistoryList}>
        {leavingList.map((row, index) => {
          const { fromDate = '', toDate = '', typeName = '', _id, status } = row;
          return (
            <Row
              key={`${index + 1}`}
              className={styles.eachRow}
              onClick={() => this.goToLeaveRequest(_id)}
            >
              {/* {fromDate === toDate && (
                <>
                  <Col xs={4} className={styles.dateAndMonth} style={{ justifyContent: 'center' }}>
                    <span className={styles.container}>
                      <span className={styles.day}>
                        {moment.utc(fromDate).locale('en').format('DD')}
                      </span>
                      <span className={styles.month}>
                        {moment.utc(fromDate).locale('en').format('MMM')}
                      </span>
                    </span>
                  </Col>
                  <Col xs={14} className={styles.eventOfDay}>
                    {typeName}
                  </Col>
                </>
              )} */}
              {/* {fromDate !== toDate && (
                <> */}
              <Col
                xs={8}
                className={styles.dateAndMonth}
                style={{ justifyContent: 'space-evenly' }}
              >
                <span className={styles.container}>
                  <span className={styles.day}>
                    {moment.utc(fromDate).locale('en').format('DD')}
                  </span>
                  <span className={styles.month}>
                    {moment.utc(fromDate).locale('en').format('MMM')}
                  </span>
                </span>
                <span className={styles.subtractSymbol}>-</span>
                <span className={styles.container}>
                  <span className={styles.day}>{moment.utc(toDate).locale('en').format('DD')}</span>
                  <span className={styles.month}>
                    {moment.utc(toDate).locale('en').format('MMM')}
                  </span>
                </span>
              </Col>
              <Col xs={10} className={styles.eventOfDay}>
                {typeName}
              </Col>
              {/* </>
              )} */}

              <Col className={styles.text} xs={6}>
                {this.getStatus(status)}
              </Col>
            </Row>
          );
        })}
        {leavingList.length === 0 && (
          <Row className={styles.eachRow_noData}>
            <span>No leave history</span>
          </Row>
        )}
      </div>
    );
  }
}
