import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { checkHoliday, EMP_MT_MAIN_COL_SPAN } from '@/utils/timeSheet';
import ActivityCard from './components/ActivityCard';
import TimeOffCard from './components/TimeOffCard';
import IconHoliday from '@/assets/timeSheet/ic_holiday.svg';
import styles from './index.less';

const { DATE_OF_HOURS, REMAINING } = EMP_MT_MAIN_COL_SPAN;

const ActivityList = (props) => {
  const {
    data: { timesheet = [], timeoff = [], date = '' } = {},
    timeSheet: { holidays = [] },
    hourList = [],
    employeeSchedule = {},
    startWorkingHour = '',
    endWorkingHour = '',
  } = props;

  // IS OLD TIME SHEET ? MIGRATED FROM THE INTRANET
  const [isOldTimeSheet, setIsOldTimeSheet] = useState(false);

  // RENDER UI
  const renderHour = (hour) => {
    const hourTemp = `${hour}:00`;
    if (hour < 12) return `${hourTemp} AM`;
    if (hour === 12) return `${hourTemp} PM`;
    return `${hour * 1 - 12}:00 PM`;
  };

  useEffect(() => {
    // check if is old time sheet
    if (timesheet.length > 0) {
      const find = timesheet.every((x) => !x.startTime && !x.endTime);
      setIsOldTimeSheet(find);
    } else setIsOldTimeSheet(false);
  }, [JSON.stringify(timesheet)]);

  // MAIN AREA
  return (
    <Row className={styles.ActivityList}>
      <Col
        span={DATE_OF_HOURS}
        className={`${styles.ActivityList__firstColumn} ${styles.alignCenter}`}
      >
        {!isOldTimeSheet &&
          hourList.map((hour) => {
            return (
              <div className={styles.hourBlock}>
                <span>{renderHour(hour)}</span>
              </div>
            );
          })}
      </Col>
      {checkHoliday(date, holidays) && !timesheet.length && !timeoff.length ? (
        <Col span={REMAINING} className={styles.hodilayContainer}>
          <div className={styles.contentContainer}>
            <img src={IconHoliday} alt="" width={80} height={80} />
            <p>{holidays[0].holidayName}</p>
          </div>
        </Col>
      ) : (
        <Col span={REMAINING} className={styles.ActivityList__remainColumn}>
          {!isOldTimeSheet &&
            hourList.map(() => {
              return (
                <div className={styles.row}>
                  <div className={styles.divider} />
                </div>
              );
            })}
          {timesheet.map((item, index) => (
            <ActivityCard
              key={item.id}
              card={item}
              cardDay={date}
              cardIndex={index}
              isOldTimeSheet={isOldTimeSheet}
              startWorkingHour={startWorkingHour}
              endWorkingHour={endWorkingHour}
            />
          ))}
          {timeoff.map((item, index) => (
            <TimeOffCard
              card={item}
              cardDay={date}
              cardIndex={index}
              employeeSchedule={employeeSchedule}
              startWorkingHour={startWorkingHour}
              endWorkingHour={endWorkingHour}
            />
          ))}
        </Col>
      )}
    </Row>
  );
};

export default connect(
  ({ timeSheet, timeSheet: { myTimesheet = [], employeeSchedule = {} } = {} }) => ({
    timeSheet,
    myTimesheet,
    employeeSchedule,
  }),
)(ActivityList);
