import { Col, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import { EMP_ROW_HEIGHT } from '@/utils/timeSheet';
import { TIMEOFF_PERIOD } from '@/utils/timeOff';
import styles from './index.less';

const TimeOffCard = (props) => {
  const {
    card: { endTime = '', leaveId = '', startTime = '', timeOfDay = '' } = {},
    card = {},
    employeeSchedule: {
      startWorkDay: { start = '' } = {},
      endWorkDay: { end = '' } = {},
      totalHour = 0,
    } = {},
    startWorkingHour = '',
    endWorkingHour = '',
  } = props;

  const [top, setTop] = useState(0);
  const [startTimeTemp, setStartTimeTemp] = useState('0');
  const [endTimeTemp, setEndTimeTemp] = useState('0');
  const [height, setHeight] = useState(0);

  // USE EFFECT AREA
  const getTime = () => {
    let x = '';
    let y = '';
    if (startTime === '00:00' && endTime === '00:00') {
      if (timeOfDay === TIMEOFF_PERIOD.WHOLE_DAY) {
        x = start;
        y = end;
      }
      if (timeOfDay === TIMEOFF_PERIOD.MORNING) {
        x = start;
        y = moment(start).add(totalHour / 2, 'hours');
      }
      if (timeOfDay === TIMEOFF_PERIOD.AFTERNOON) {
        x = moment(start).add(totalHour / 2, 'hours');
        y = end;
      }
    } else {
      x = startTime;
      y = endTime;
    }
    setStartTimeTemp(x);
    setEndTimeTemp(y);
  };

  const calculateCardPosition = () => {
    const marginBlock = 10;
    const startTimeHourTemp = moment(startTimeTemp, 'HH:mm').hour();
    const startTimeMinuteTemp = moment(startTimeTemp, 'HH:mm').minute();

    let topTemp = EMP_ROW_HEIGHT / 2;
    let heightTemp = 0;

    if (startTimeTemp && endTimeTemp) {
      for (let i = startWorkingHour; i <= endWorkingHour; i += 1) {
        if (i < startTimeHourTemp) {
          topTemp += EMP_ROW_HEIGHT;
        } else if (i === startTimeHourTemp) {
          topTemp += (startTimeMinuteTemp / 60) * EMP_ROW_HEIGHT;
        }
      }

      const diff = moment.duration(
        moment(endTimeTemp, 'HH:mm').diff(moment(startTimeTemp, 'HH:mm')),
      );

      heightTemp = diff.asHours() * EMP_ROW_HEIGHT;

      setTop(topTemp + marginBlock / 2);
      setHeight(
        heightTemp >= EMP_ROW_HEIGHT ? heightTemp - marginBlock : EMP_ROW_HEIGHT - marginBlock,
      );
    }
  };

  useEffect(() => {
    getTime();
  }, [JSON.stringify(card), startWorkingHour]);

  useEffect(() => {
    if (startTimeTemp && endTimeTemp) {
      calculateCardPosition();
    }
  }, [startTimeTemp, endTimeTemp]);

  const renderContent = () => {
    let x = '';
    let y = '';
    let hours = 0;
    if (startTime === '00:00' && endTime === '00:00') {
      if (timeOfDay === TIMEOFF_PERIOD.WHOLE_DAY) {
        hours = totalHour;
        x = moment(start, 'HH:mm').format('h:mm a');
        y = moment(end, 'HH:mm').format('h:mm a');
      }
      if (timeOfDay === TIMEOFF_PERIOD.MORNING || timeOfDay === TIMEOFF_PERIOD.AFTERNOON) {
        hours = totalHour / 2;
        x = moment(startTimeTemp, 'HH:mm').format('h:mm a');
        y = moment(endTimeTemp, 'HH:mm').format('h:mm a');
      }
    } else {
      hours = moment
        .duration(moment(endTimeTemp, 'HH:mm').diff(moment(startTimeTemp, 'HH:mm')))
        .asHours();
      x = moment(startTimeTemp, 'HH:mm').format('h:mm a');
      y = moment(endTimeTemp, 'HH:mm').format('h:mm a');
    }
    return (
      <Link to={`/time-off/overview/personal-timeoff/view/${leaveId}`}>
        Leave on {hours}hrs ({x} - {y})
      </Link>
    );
  };

  // MAIN AREA
  return (
    <div
      className={styles.TimeOffCard}
      style={{
        top,
        height,
      }}
    >
      <Row align="middle" className={styles.container}>
        <Col span={24} className={styles.normalCell}>
          {renderContent()}
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({ employee }))(
  TimeOffCard,
);
