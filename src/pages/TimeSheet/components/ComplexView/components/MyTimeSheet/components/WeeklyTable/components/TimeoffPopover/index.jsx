import { Col, Popover, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import CloseX from '@/assets/dashboard/closeX.svg';

import { convertMsToTime } from '@/utils/timeSheet';
import styles from './index.less';
import { TIMEOFF_PERIOD } from '@/utils/timeOff';

const TimeoffPopover = (props) => {
  const {
    children,
    tasks = [],
    timeoff = [],
    date = '',
    placement = 'top',
    timeSheet: { employeeSchedule: { totalHour = 0 } = {} } = {},
  } = props;
  const [showPopover, setShowPopover] = useState(false);
  const [showingTimeOff, setShowingTimeOff] = useState([]);

  const generateShowingTask = (value) => {
    const result = [timeoff];
    if (!value) setShowingTimeOff(result);
    else setShowingTimeOff(result.slice(0, value - 1));
  };

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

  useEffect(() => {
    generateShowingTask(4);
  }, [JSON.stringify(tasks), JSON.stringify(timeoff)]);

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
          {timeoff.length === 0 && (
            <Row className={styles.eachRow} justify="space-between" align="middle">
              <Col span={24} className={styles.taskName}>
                <span>No Timeoff</span>
              </Col>
            </Row>
          )}

          {timeoff.length !== 0 &&
            showingTimeOff.map((timeoffProp) => {
              return (
                <Row className={styles.eachRow} justify="space-between" align="middle">
                  <Col span={18} className={styles.taskName}>
                    <span>
                      Timeoff (
                      <Link to={`/time-off/overview/personal-timeoff/view/${timeoffProp.leaveId}`}>
                        {timeoffProp.id}
                      </Link>
                      )
                    </span>
                  </Col>
                  <Col span={6} className={styles.right}>
                    {convertMsToTime(getTimeOffTotalHours(timeoffProp) * 3600000)}
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
          <span>Timeoff Details - {moment(date).locale('en').format('DD ddd MMMM')}</span>
        </div>
        <div className={styles.divider} />
        {renderTaskTable()}
        <div className={styles.divider} />
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
