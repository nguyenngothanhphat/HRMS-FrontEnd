import React from 'react';
import { TIMEOFF_COLOR, TIMEOFF_STATUS } from '@/utils/timeOff';
import styles from './index.less';

const LeaveHistoryCalendar = () => {
  const tags = [
    {
      id: TIMEOFF_STATUS.IN_PROGRESS,
      name: 'Applied',
    },
    {
      id: TIMEOFF_STATUS.ACCEPTED,
      name: 'Approved',
    },
    {
      id: TIMEOFF_STATUS.REJECTED,
      name: 'Rejected',
    },
    {
      id: 'Holiday',
      name: 'Holiday',
    },
  ];

  return (
    <div className={styles.TypeColorTag}>
      <div className={styles.TypeColorTag__top}>
        <div className={`${styles.dots} ${styles.dotAll}`} />
        <span className={styles.TypeColorTag__text}>All Leaves</span>
      </div>
      <div className={styles.TypeColorTag__bottom}>
        {tags.map((x) => (
          <div className={styles.TypeColorTag__status}>
            <div className={styles.dots} style={{ backgroundColor: TIMEOFF_COLOR[x.id] }} />
            <span className={styles.TypeColorTag__text}>{x.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default LeaveHistoryCalendar;
