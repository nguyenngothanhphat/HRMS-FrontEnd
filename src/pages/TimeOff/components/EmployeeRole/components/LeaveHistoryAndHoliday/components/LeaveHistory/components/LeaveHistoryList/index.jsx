import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import { history } from 'umi';
import styles from './index.less';

export default class LeaveHistoryList extends PureComponent {
  goToLeaveRequest = (_id) => {
    history.push({
      pathname: `/time-off/view-request/${_id}`,
    });
  };

  render() {
    const { leavingList = [] } = this.props;
    return (
      <div className={styles.LeaveHistoryList}>
        {leavingList.map((row) => {
          const { fromDate = '', toDate = '', duration = '', type = '', name = '', _id } = row;
          return (
            <Row className={styles.eachRow} onClick={() => this.goToLeaveRequest(_id)}>
              {fromDate === toDate && (
                <>
                  <Col xs={4} className={styles.dateAndMonth} style={{ justifyContent: 'center' }}>
                    <span className={styles.container}>
                      <span className={styles.day}>
                        {moment(fromDate).locale('en').format('DD')}
                      </span>
                      <span className={styles.month}>
                        {moment(fromDate).locale('en').format('MMM')}
                      </span>
                    </span>
                  </Col>
                  <Col xs={14} className={styles.eventOfDay}>
                    {name}
                  </Col>
                </>
              )}
              {fromDate !== toDate && (
                <>
                  <Col
                    xs={8}
                    className={styles.dateAndMonth}
                    style={{ justifyContent: 'space-evenly' }}
                  >
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
                  <Col xs={10} className={styles.eventOfDay}>
                    {name}
                  </Col>
                </>
              )}

              <Col className={styles.dayInWeek} xs={6}>
                {`-`}
                {duration} {` `}
                {type}
              </Col>
            </Row>
          );
        })}
        {leavingList.length === 0 && (
          <Row style={{ marginTop: 0 }} className={styles.eachRow}>
            <span>No data</span>
          </Row>
        )}
      </div>
    );
  }
}
