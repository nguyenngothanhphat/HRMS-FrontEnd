import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col } from 'antd';
import styles from './index.less';
import EmptyComponent from '@/components/Empty';

export default class HolidayList extends PureComponent {
  render() {
    const { holidaysList = [] } = this.props;
    return (
      <div className={styles.HolidayList}>
        {holidaysList.map((row, index) => {
          const { name = '', date: { iso = '', dateTime: { day = '', month = '' } = {} } = {} } =
            row;
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
        {holidaysList.length === 0 && <EmptyComponent />}
      </div>
    );
  }
}
