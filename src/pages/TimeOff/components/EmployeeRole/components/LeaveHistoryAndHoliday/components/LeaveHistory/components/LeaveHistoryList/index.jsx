import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import styles from './index.less';

export default class LeaveHistoryList extends PureComponent {
  render() {
    const { leavingList = [] } = this.props;
    return (
      <div className={styles.LeaveHistoryList}>
        {leavingList.map((row) => {
          const { fromDate = '', toDate = '', duration = '', type = '', name = '' } = row;
          return (
            <Row className={styles.eachRow}>
              {fromDate === toDate && (
                <>
                  <Col xs={4} className={styles.dateAndMonth}>
                    <span className={styles.container}>
                      <span className={styles.day}>
                        {moment(fromDate).locale('en').format('DD')}
                      </span>
                      <span className={styles.month}>
                        {moment(fromDate).locale('en').format('MMM')}
                      </span>
                    </span>
                  </Col>
                  <Col xs={15} className={styles.eventOfDay}>
                    {name}
                  </Col>
                </>
              )}
              {fromDate !== toDate && (
                <>
                  <Col xs={8} className={styles.dateAndMonth}>
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
                  <Col xs={11} className={styles.eventOfDay}>
                    {name}
                  </Col>
                </>
              )}

              <Col className={styles.dayInWeek} xs={5}>
                {`-`}
                {duration}
                {type}
              </Col>
            </Row>
          );
        })}
      </div>
    );
  }
}
