import React, { PureComponent } from 'react';
import { Row, Col, Tooltip } from 'antd';
import moment from 'moment';
import { history } from 'umi';
import { TIMEOFF_STATUS, TIMEOFF_DATE_FORMAT } from '@/utils/timeOff';
import styles from './index.less';
import EmptyComponent from '@/components/Empty';

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
    const getTitle = (leaveDates = []) => {
      console.log(leaveDates);
      return leaveDates.map((x) => (
        <div key={x._id}>
          <span>{moment(x.date).locale('en').format('DD')}</span>{' '}
          <span>{moment(x.date).locale('en').format('MMM')}</span>
        </div>
      ));
    };

    return (
      <div className={styles.LeaveHistoryList}>
        {leavingList.map((row, index) => {
          const {
            fromDate = '',
            toDate = '',
            typeName = '',
            _id,
            status,
            leaveDates = [],
            normalType = false,
          } = row;
          return (
            <Row
              key={`${index + 1}`}
              className={styles.eachRow}
              onClick={() => this.goToLeaveRequest(_id)}
            >
              {normalType ? (
                <Tooltip title={() => getTitle(leaveDates)}>
                  <Col
                    xs={8}
                    className={styles.dateAndMonth}
                    style={{ justifyContent: 'space-evenly' }}
                  >
                    {' '}
                    <span className={styles.container}>
                      <span className={styles.day}>
                        {moment(fromDate).locale('en').format('DD')}
                      </span>
                      <span className={styles.month}>
                        {moment(fromDate).locale('en').format('MMM')}
                      </span>
                    </span>
                    <span className={styles.subtractSymbol}>-</span>
                    <span className={styles.container}>
                      <span className={styles.day}>{moment(toDate).locale('en').format('DD')}</span>
                      <span className={styles.month}>
                        {moment(toDate).locale('en').format('MMM')}
                      </span>
                    </span>
                  </Col>
                </Tooltip>
              ) : (
                <Col
                  xs={8}
                  className={styles.dateAndMonth}
                  style={{ justifyContent: 'space-evenly' }}
                >
                  {' '}
                  <span className={styles.container}>
                    <span className={styles.day}>{moment(fromDate).locale('en').format('DD')}</span>
                    <span className={styles.month}>
                      {moment(fromDate).locale('en').format('MMM')}
                    </span>
                  </span>
                  <span className={styles.subtractSymbol}>-</span>
                  <span className={styles.container}>
                    <span className={styles.day}>{moment(toDate).locale('en').format('DD')}</span>
                    <span className={styles.month}>
                      {moment(toDate).locale('en').format('MMM')}
                    </span>
                  </span>
                </Col>
              )}
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
        {leavingList.length === 0 && <EmptyComponent />}
      </div>
    );
  }
}
