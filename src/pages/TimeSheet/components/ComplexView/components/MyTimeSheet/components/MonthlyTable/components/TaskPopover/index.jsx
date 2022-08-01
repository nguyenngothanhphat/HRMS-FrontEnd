import { Button, Col, Popover, Row } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect } from 'umi';
import AddSolidIcon from '@/assets/timeSheet/addSolid.png';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import IconHoliday from '@/assets/timeSheet/ic_holiday.svg';
import {
  checkDateBetweenRange,
  convertMsToTime,
  getHolidayNameByDate,
  sortedDate,
} from '@/utils/timeSheet';
import styles from './index.less';

const TaskPopover = (props) => {
  const {
    children,
    tasks = [],
    holidays = [],
    startDate = '',
    endDate = '',
    placement = 'top',
    onAddTaskModal = () => {},
  } = props;
  const [showPopover, setShowPopover] = useState(false);

  const handleAddTask = () => {
    setShowPopover(false);
    onAddTaskModal();
  };

  const getTaskWithHolidays = () => {
    const holidaysWithoutTask = holidays.filter((holiday) => {
      let isWithoutTask = false;
      for (let i = 0; i < tasks.length; i += 1) {
        if (moment(tasks[i].date).isSame(moment(holiday.date))) {
          isWithoutTask = false;
          break;
        }
        if (checkDateBetweenRange(startDate, endDate, holiday.date)) {
          isWithoutTask = true;
        }
      }
      if (isWithoutTask) return holiday;
      return null;
    });

    const taskWithHoliday = tasks.concat(holidaysWithoutTask);
    return sortedDate(taskWithHoliday);
  };

  const renderTaskTable = () => {
    return (
      <div className={styles.taskTable}>
        <div className={styles.taskTable__body}>
          {getTaskWithHolidays().length === 0 && (
            <Row className={styles.eachRow} justify="space-between" align="middle">
              <Col span={24} className={styles.taskName}>
                <span>No tasks</span>
              </Col>
            </Row>
          )}
          {getTaskWithHolidays().map((task) => {
            const { date = '', projectDailyTime = 0 } = task;
            const momentDate = moment(date).locale('en');
            const holidayName = getHolidayNameByDate(date, holidays);

            if (!projectDailyTime && holidayName.trim() === '') return null;
            return (
              <Row key={date} className={styles.eachRow} justify="space-between" align="middle">
                <Col span={18} className={styles.dateName}>
                  <div className={styles.icon}>
                    <span>
                      {momentDate ? moment(momentDate).format('dddd').toString()?.charAt(0) : 'P'}
                    </span>
                  </div>
                  <div>
                    <span className={styles.name}>{moment(momentDate).format('dddd')}</span>
                    <span className={styles.timeBlock}>
                      <span className={styles.date}>{moment(momentDate).format('MMM DD')}</span>{' '}
                      {projectDailyTime ? (
                        <>
                          <img className={styles.calendarIcon} src={CalendarIcon} alt="" />
                          <span className={styles.time}>
                            {convertMsToTime(projectDailyTime || 0)}
                          </span>
                        </>
                      ) : null}
                    </span>
                  </div>
                </Col>
                {holidayName.trim() !== '' && !projectDailyTime ? (
                  <Col span={6} className={styles.right}>
                    <div className={styles.holidayContainer}>
                      <img src={IconHoliday} alt="" width={32} height={32} />
                      <div>{holidayName}</div>
                    </div>
                  </Col>
                ) : null}
              </Row>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPopup = () => {
    return (
      <div className={styles.popupContainer}>
        <div className={styles.header}>
          <span className={styles.left}>
            <span className={styles.boldText}>Task Details</span> -{' '}
            {moment(startDate).locale('en').format('MMM DD')} -{' '}
            {moment(endDate).locale('en').format('MMM DD')}
          </span>
          <div className={styles.addTaskBtn}>
            <Button onClick={handleAddTask} icon={<img src={AddSolidIcon} alt="" />}>
              Add Task
            </Button>
          </div>
        </div>
        <div className={styles.divider} />
        {renderTaskTable()}
      </div>
    );
  };

  return (
    <>
      <Popover
        placement={placement}
        content={() => renderPopup()}
        title={null}
        trigger="click"
        visible={showPopover}
        overlayClassName={styles.TaskPopover}
        onVisibleChange={() => {
          setShowPopover(!showPopover);
        }}
      >
        {children}
      </Popover>
    </>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} }, timeSheet }) => ({
  employee,
  timeSheet,
}))(TaskPopover);
