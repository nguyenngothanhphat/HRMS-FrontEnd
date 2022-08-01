import { Col, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { checkHoliday, EMP_MT_MAIN_COL_SPAN, EMP_ROW_HEIGHT, hourList } from '@/utils/timeSheet';
import ActivityCard from './components/ActivityCard';
import TimeOffCard from './components/TimeOffCard';
import IconHoliday from '@/assets/timeSheet/ic_holiday.svg';
import styles from './index.less';
import AddTaskModal from '../../../../../AddTaskModal';

const { DATE_OF_HOURS, REMAINING } = EMP_MT_MAIN_COL_SPAN;

const ActivityList = (props) => {
  const {
    dispatch,
    data: { timesheet = [], timeoff = [], date = '' } = {},
    timeSheet: { myTimesheetByDay = [], currentTask = {} },
    employeeSchedule = {},
    startWorkingHour = '',
    endWorkingHour = '',
    loadingFetchMyTimesheetByType = false,
  } = props;

  const holidays = (myTimesheetByDay.length && myTimesheetByDay[0].holidays) || [];
  const containerRef = useRef();
  // IS OLD TIME SHEET ? MIGRATED FROM THE INTRANET
  const [isOldTimeSheet, setIsOldTimeSheet] = useState(false);
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState({});

  const handleAddTask = (item) => {
    const startTime = `${item}:00`;
    setSelectedTime({ startTime });
    setAddTaskModalVisible(true);
  };

  // RENDER UI
  const renderHour = (hour) => {
    const hourTemp = `${hour}:00`;
    if (hour === 0) return `12:00 AM`;
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

  useEffect(() => {
    // Handle scroll to task item
    if (timesheet.length && containerRef.current) {
      const diffMinutes = (time) => moment(time, 'HH:mm').diff(moment('00:00', 'HH:mm'), 'minutes');
      const findMinimumStartTime = Math.min(
        ...timesheet.map((item) => diffMinutes(item.startTime)),
      );
      let currentPx;
      if (currentTask) {
        const currentTime = currentTask.startTime;
        currentPx = diffMinutes(currentTime);
      }

      containerRef.current.scrollTo({
        top: ((currentPx || findMinimumStartTime) / 60) * EMP_ROW_HEIGHT,
        behavior: 'smooth',
      });
      // clear current task after scroll
      dispatch({
        type: 'timeSheet/savePayload',
        payload: {
          currentTask: {},
        },
      });
    }
  }, [containerRef, timesheet]);

  // MAIN AREA
  return (
    <Row ref={containerRef} className={styles.ActivityList}>
      <Col span={DATE_OF_HOURS} className={styles.ActivityList__firstColumn}>
        {!isOldTimeSheet &&
          hourList.map((hour) => {
            return (
              <div key={hour} className={styles.hourBlock}>
                <span>{renderHour(hour)}</span>
              </div>
            );
          })}
      </Col>
      {checkHoliday(date, holidays) && !timesheet.length && !timeoff.length ? (
        <Col span={REMAINING} className={styles.holidayContainer}>
          <div className={styles.contentContainer}>
            <img src={IconHoliday} alt="" width={80} height={80} />
            <p>{holidays[0].holiday}</p>
          </div>
        </Col>
      ) : (
        <Col span={REMAINING} className={styles.ActivityList__remainColumn}>
          {!isOldTimeSheet ? (
            <>
              <div className={styles.row_header} />
              {hourList.map((item, index) => {
                return (
                  <div
                    onClick={index === hourList.length - 1 ? undefined : () => handleAddTask(item)}
                    key={item}
                    className={styles.row}
                    style={{ height: index === hourList.length - 1 && EMP_ROW_HEIGHT / 2 }}
                  />
                );
              })}
            </>
          ) : null}
          {!loadingFetchMyTimesheetByType &&
            timesheet.map((item, index) => (
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
              key={item.id}
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
      <AddTaskModal
        visible={addTaskModalVisible}
        onClose={() => setAddTaskModalVisible(false)}
        date={date}
        mode="multiple"
        taskDetail={{ endTime: selectedTime?.startTime }}
      />
    </Row>
  );
};

export default connect(
  ({ loading, timeSheet, timeSheet: { myTimesheet = [], employeeSchedule = {} } = {} }) => ({
    timeSheet,
    myTimesheet,
    employeeSchedule,
    loadingFetchMyTimesheetByType: loading.effects['timeSheet/fetchMyTimesheetByTypeEffect'],
  }),
)(ActivityList);
