import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col } from 'antd';
import styles from './index.less';
import EmptyComponent from '@/components/Empty';

export default class HolidayList extends PureComponent {
  render() {
    const { upcomingHolidayList = [] } = this.props;
    return (
      <div className={styles.HolidayList}>
        {upcomingHolidayList.map((row, index) => {
          const { name = '', date: { iso = '', dateTime: { day = '' } = {} } = {} } = row;
          const monthData = new Date(iso).toISOString();
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
        {upcomingHolidayList.length === 0 && <EmptyComponent />}
      </div>
    );
  }
}
