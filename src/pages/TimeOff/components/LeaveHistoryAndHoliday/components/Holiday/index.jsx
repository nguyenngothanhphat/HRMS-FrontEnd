import { Row, Col } from 'antd';
import React, { PureComponent } from 'react';
import moment from 'moment';
import HolidayCalendar from './HolidayCalendar';
import styles from './index.less';

class Holiday extends PureComponent {
  render() {
    const { holidaysList = [], activeShowType = 1 } = this.props;
    return (
      <div className={styles.Holiday}>
        {activeShowType === 1 &&
          holidaysList.map((row) => {
            const { fromDate = '', name = '' } = row;
            return (
              <Row className={styles.eachRow}>
                <Col xs={4} className={styles.dateAndMonth}>
                  <span>{moment(fromDate).locale('en').format('MMM')}</span>
                  <span>{moment(fromDate).locale('en').format('DD')}</span>
                </Col>
                <Col xs={15} className={styles.eventOfDay}>
                  {name}
                </Col>
                <Col className={styles.dayInWeek} xs={5}>
                  {moment(fromDate).locale('en').format('ddd')}
                </Col>
              </Row>
            );
          })}
        {activeShowType === 2 && <HolidayCalendar holidaysList={holidaysList} />}
      </div>
    );
  }
}
export default Holiday;
