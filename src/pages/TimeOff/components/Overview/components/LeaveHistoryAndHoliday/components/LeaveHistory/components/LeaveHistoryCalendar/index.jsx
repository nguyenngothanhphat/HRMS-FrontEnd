/* eslint-disable no-console */
import moment from 'moment';
import React from 'react';
import Calendar from '../../../Calendar';
import EventDetailBox from './EventDetailBox';
import styles from './index.less';

const LeaveHistoryCalendar = (props) => {
  const { leavingList = [] } = props;

  const checkFutureDay = (date) => {
    return moment(date).isAfter(moment());
  };

  const renderData = (id) => {
    const upcomingData = [];
    const leaveTakenData = [];
    leavingList.forEach((x) => {
      const check = checkFutureDay(x.fromDate);
      if (check) upcomingData.push(x);
      else leaveTakenData.push(x);
    });
    if (id === 1) return upcomingData;
    return leaveTakenData;
  };

  return (
    <div className={styles.LeaveHistoryCalendar}>
      <Calendar data={leavingList} />
      <div className={styles.listStatus}>
        <div className={styles.listStatus__top}>
          <div className={`${styles.dots} ${styles.dotAll}`} />
          <span className={styles.listStatus__text}>All Leaves</span>
        </div>
        <div className={styles.listStatus__bottom}>
          <div className={styles.listStatus__status}>
            <div className={`${styles.dots} ${styles.dotApplied}`} />
            <span className={styles.listStatus__text}>Applied</span>
          </div>
          <div className={styles.listStatus__status}>
            <div className={`${styles.dots} ${styles.dotApproved}`} />
            <span className={styles.listStatus__text}>Approved</span>
          </div>
          <div className={styles.listStatus__status}>
            <div className={`${styles.dots} ${styles.dotRejected}`} />
            <span className={styles.listStatus__text}>Rejected</span>
          </div>
        </div>
      </div>
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
