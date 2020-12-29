import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col } from 'antd';
import styles from './index.less';

export default class HolidayList extends PureComponent {
  render() {
    const { holidaysList = [] } = this.props;
    return (
      <div className={styles.HolidayList}>
        {holidaysList.map((row, index) => {
          const { fromDate = '', toDate = '', name = '' } = row;
          return (
            <Row key={`${index + 1}`} className={styles.eachRow}>
              <Col xs={4} className={styles.dateAndMonth}>
                <span className={styles.day}>{moment(fromDate).locale('en').format('DD')}</span>
                <span className={styles.month}>{moment(fromDate).locale('en').format('MMM')}</span>
              </Col>
              <Col xs={16} className={styles.eventOfDay}>
                {name}
              </Col>
              <Col xs={4} className={styles.dateName}>
                <span>{moment(fromDate).locale('en').format('ddd')}</span>
              </Col>
            </Row>
          );
        })}
        {holidaysList.length === 0 && (
          <Row style={{ marginTop: 0 }} className={styles.eachRow}>
            <span>No data</span>
          </Row>
        )}
      </div>
    );
  }
}
