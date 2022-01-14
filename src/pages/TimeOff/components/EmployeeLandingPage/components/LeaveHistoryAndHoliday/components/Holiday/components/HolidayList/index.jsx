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
          const { name = '', date: { iso = '', dateTime: { day = '', month = '' } = {} } = {} } =
            row;
<<<<<<< HEAD
          const monthData = new Date(iso);
=======
          const monthData = new Date(iso).toISOString();
>>>>>>> 692c8d3d269711fbf04114329a73d43440d0465d
          return (
            <Row key={`${index + 1}`} className={styles.eachRow}>
              <Col xs={4} className={styles.dateAndMonth}>
                <span className={styles.day}>{day}</span>
                <span className={styles.month}>{moment(monthData).locale('en').format('MMM')}</span>
              </Col>
              <Col xs={16} className={styles.eventOfDay}>
                {name}
              </Col>
              <Col xs={4} className={styles.dateName}>
                <span>{moment(monthData).locale('en').format('dddd')}</span>
              </Col>
            </Row>
          );
        })}
        {holidaysList.length === 0 && (
          <Row className={styles.eachRow_noData}>
            <span>No holiday data</span>
          </Row>
        )}
      </div>
    );
  }
}
