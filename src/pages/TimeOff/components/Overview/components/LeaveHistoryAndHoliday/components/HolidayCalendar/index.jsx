/* eslint-disable no-console */
import moment from 'moment';
import React, { PureComponent } from 'react';
import { isFutureDay } from '@/utils/timeOff';
import CustomCalendar from '../CustomCalendar';
import EventDetailBox from './EventDetailBox';
import styles from './index.less';

moment.locale('en');

export default class HolidayCalendar extends PureComponent {
  checkWeekDay = (day, month, year) => {
    const weekDayName = moment(`${month * 1}/${day * 1}/${year * 1}`).format('ddd');
    return weekDayName;
  };

  renderData = (id, list) => {
    const upcomingData = [];
    const leaveTakenData = [];

    list.forEach((value) => {
      const check = isFutureDay(value.date?.iso);
      if (check) upcomingData.push(value);
      else leaveTakenData.push(value);
    });
    if (id === 1) return upcomingData;
    return leaveTakenData;
  };

  render() {
    const {
      allHolidayList = [],
      leavingList = [],
      currentTime = '',
      setCurrentTime = () => {},
    } = this.props;
    return (
      <div className={styles.HolidayCalendar}>
        <CustomCalendar
          holidays={allHolidayList}
          leaveRequests={leavingList}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
        />
        <div className={styles.eventDetailContainer}>
          <div className={styles.eventDetailPart}>
            <span className={styles.title}>Upcoming</span>
            <div className={styles.eventsContainer}>
              {this.renderData(1, allHolidayList).map((value) => (
                <EventDetailBox data={value} color={1} />
              ))}
            </div>
          </div>
          <div className={styles.eventDetailPart}>
            <div className={styles.title}>Leave taken</div>
            <div className={styles.eventsContainer}>
              {this.renderData(2, allHolidayList).map((value) => (
                <EventDetailBox data={value} color={2} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
