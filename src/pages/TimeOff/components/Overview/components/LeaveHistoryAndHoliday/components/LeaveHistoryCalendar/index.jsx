/* eslint-disable no-console */
import moment from 'moment';
import React from 'react';
import CustomCalendar from '../CustomCalendar';
import EventDetailBox from './EventDetailBox';
import styles from './index.less';

const LeaveHistoryCalendar = (props) => {
  const {
    allHolidayList = [],
    leavingList = [],
    currentTime = '',
    setCurrentTime = () => {},
  } = props;

  const checkFutureDay = (date) => {
    return moment(date).isAfter(moment());
  };

  const renderData = (id) => {
    const upcomingData = [];
    const leaveTakenData = [];
    leavingList.forEach((x) => {
      let check = false;
      if (x.fromDate) {
        check = checkFutureDay(x.fromDate);
      } else {
        check = checkFutureDay(x.listLeave[0]);
      }
      if (check) upcomingData.push(x);
      else leaveTakenData.push(x);
    });
    if (id === 1) return upcomingData;
    return leaveTakenData;
  };

  return (
    <div className={styles.LeaveHistoryCalendar}>
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
            {renderData(1).map((value) => (
              <EventDetailBox data={value} color={1} />
            ))}
          </div>
        </div>
        <div className={styles.eventDetailPart}>
          <div className={styles.title}>Leave taken</div>
          <div className={styles.eventsContainer}>
            {renderData(2).map((value) => (
              <EventDetailBox data={value} color={2} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default LeaveHistoryCalendar;
