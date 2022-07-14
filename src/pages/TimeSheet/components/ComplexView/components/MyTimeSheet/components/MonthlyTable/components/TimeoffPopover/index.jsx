import { Col, Popover, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import CloseX from '@/assets/dashboard/closeX.svg';

import {
  checkHolidayInWeek,
  convertMsToTime,
  holidayFormatDate,
  sortedDate,
} from '@/utils/timeSheet';
import styles from './index.less';
import { TIMEOFF_PERIOD } from '@/utils/timeOff';

const TimeoffPopover = (props) => {
  const {
    children,
    timeoff = [],
    startDate = '',
    endDate = '',
    placement = 'top',
    timeSheet: { employeeSchedule: { totalHour = 0 } = {}, holidays = [] } = {},
  } = props;
  const [showPopover, setShowPopover] = useState(false);
  const [showingTimeOff, setShowingTimeOff] = useState([]);

  const getTimeOffTotalHours = (item) => {
    const { startTime = '', endTime = '', timeOfDay = '' } = item;

    if (timeOfDay === TIMEOFF_PERIOD.WHOLE_DAY) {
      return totalHour;
    }
    if (timeOfDay === TIMEOFF_PERIOD.MORNING || timeOfDay === TIMEOFF_PERIOD.AFTERNOON) {
      return totalHour / 2;
    }

    return moment.duration(moment(endTime, 'HH:mm').diff(moment(startTime, 'HH:mm'))).asHours();
  };

  const isHoliday = checkHolidayInWeek(startDate, endDate, holidays);

  useEffect(() => {
    if (isHoliday) {
      const newTimeoff = [...timeoff];
      holidays.map((holiday) => {
        if (checkHolidayInWeek(startDate, endDate, [holiday]))
          newTimeoff.push({
            date: holiday?.date,
            isHoliday: true,
            holiday: holiday?.holiday,
          });
        return null;
      });

      setShowingTimeOff(newTimeoff);
    } else {
      setShowingTimeOff(timeoff);
    }
  }, [isHoliday, JSON.stringify(timeoff)]);

  const renderTaskTable = () => {
    return (
      <div className={styles.taskTable}>
        <Row className={styles.taskTable__header} justify="space-between">
          <Col span={18}>Timeoff</Col>
          <Col span={6} className={styles.right}>
            Time Duration
          </Col>
        </Row>
        <div className={styles.taskTable__body}>
          {showingTimeOff.length === 0 && (
            <Row className={styles.eachRow} justify="space-between" align="middle">
              <Col span={24} className={styles.taskName}>
                <span>No Timeoff</span>
              </Col>
            </Row>
          )}

          {showingTimeOff.length !== 0 &&
            sortedDate(showingTimeOff).map((timeoffProp) => {
              return (
                <Row key={timeoffProp?.date} className={styles.eachRow} justify="space-between" align="middle">
                  <Col span={16} className={styles.taskName}>
                    {timeoffProp?.isHoliday ? (
                      <span> Timeoff - {holidayFormatDate(timeoffProp?.date)} </span>
                    ) : (
                      <span>
                        Timeoff - {holidayFormatDate(timeoffProp?.date)} (
                        <Link
                          to={`/time-off/overview/personal-timeoff/view/${timeoffProp.leaveId}`}
                        >
                          {timeoffProp.id}
                        </Link>
                        )
                      </span>
                    )}
                  </Col>
                  <Col span={8} className={styles.right}>
                    {timeoffProp?.isHoliday ? (
                      <div className={styles.holidayTxt}>{timeoffProp?.holiday}</div>
                    ) : (
                      convertMsToTime(getTimeOffTotalHours(timeoffProp) * 3600000)
                    )}
                  </Col>
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
        <img
          className={styles.closeButton}
          src={CloseX}
          alt=""
          onClick={() => setShowPopover(!showPopover)}
        />
        <div className={styles.header}>
          <span>
            <span className={styles.boldText}>Timeoff Details</span> -{' '}
            {moment(startDate).locale('en').format('MMM DD')} -{' '}
            {moment(endDate).locale('en').format('MMM DD')}
          </span>
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
        overlayClassName={styles.TimeoffPopover}
        onVisibleChange={() => {
          setShowPopover(!showPopover);
        }}
      >
        {children}
      </Popover>
    </>
  );
};

export default connect(({ timeSheet, user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
  timeSheet,
}))(TimeoffPopover);
