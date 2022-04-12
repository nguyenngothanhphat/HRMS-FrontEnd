/* eslint-disable no-console */
import moment from 'moment';
import React, { PureComponent } from 'react';
import Calendar from '../../../Calendar';
import EventDetailBox from './EventDetailBox';
import styles from './index.less';

moment.locale('en');

export default class HolidayCalendar extends PureComponent {
  checkFutureDay = (date) => {
    return moment.utc(date).isAfter(moment.utc());
  };

  checkWeekDay = (day, month, year) => {
    const weekDayName = moment.utc(`${month * 1}/${day * 1}/${year * 1}`).format('ddd');
    return weekDayName;
  };

  renderData = (id, holidaysList) => {
    const upcomingData = [];
    const leaveTakenData = [];

    holidaysList.forEach((value) => {
      const check = this.checkFutureDay(value.date?.iso);
      if (check) upcomingData.push(value);
      else leaveTakenData.push(value);
    });
    if (id === 1) return upcomingData;
    return leaveTakenData;
  };

  render() {
    const { holidaysList = [] } = this.props;
    return (
      <div className={styles.HolidayCalendar}>
        <Calendar data={holidaysList} mode={2} />
        <div className={styles.eventDetailContainer}>
          <div className={styles.eventDetailPart}>
            <span className={styles.title}>Upcoming</span>
            <div className={styles.eventsContainer}>
              {this.renderData(1, holidaysList).map((value) => (
                <EventDetailBox data={value} color={1} />
              ))}
            </div>
          </div>
          <div className={styles.eventDetailPart}>
            <div className={styles.title}>Leave taken</div>
            <div className={styles.eventsContainer}>
              {this.renderData(2, holidaysList).map((value) => (
                <EventDetailBox data={value} color={2} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
