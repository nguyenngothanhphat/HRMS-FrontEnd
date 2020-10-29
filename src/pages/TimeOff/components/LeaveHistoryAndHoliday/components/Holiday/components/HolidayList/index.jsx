import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col } from 'antd';
import styles from './index.less';

export default class HolidayList extends PureComponent {
  render() {
    const { holidaysList = [] } = this.props;
    return (
      <div className={styles.HolidayList}>
        {holidaysList.map((row) => {
          const { fromDate = '', toDate = '', name = '' } = row;
          return (
            <Row className={styles.eachRow}>
              <Col xs={4} className={styles.dateAndMonth}>
                <span>{moment(fromDate).locale('en').format('MMM')}</span>
                <span>{moment(fromDate).locale('en').format('DD')}</span>
              </Col>
              {fromDate !== toDate ? (
                <Col xs={4} className={styles.dateAndMonth}>
                  <span>{moment(toDate).locale('en').format('MMM')}</span>
                  <span>{moment(toDate).locale('en').format('DD')}</span>
                </Col>
              ) : (
                <Col xs={4} />
              )}
              <Col xs={16} className={styles.eventOfDay}>
                {name}
              </Col>
              {/* <Col className={styles.dayInWeek} xs={5}>
                {moment(fromDate).locale('en').format('ddd')}
              </Col> */}
            </Row>
          );
        })}
      </div>
    );
  }
}
