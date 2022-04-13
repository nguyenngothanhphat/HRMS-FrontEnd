import { Calendar, ConfigProvider, Tooltip } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect } from 'umi';
import enGB from 'antd/lib/locale-provider/en_GB';
import styles from './index.less';
import 'moment/locale/en-gb';
import PrevIcon from '@/assets/timeOff/previous.svg';
import NextIcon from '@/assets/timeOff/next.svg';
import { TIMEOFF_STATUS } from '@/utils/timeOff';

const { IN_PROGRESS, ACCEPTED, REJECTED } = TIMEOFF_STATUS;

moment.locale('en-gb'); // important!

const CustomCalendar = (props) => {
  const { data = [], mode = 1 } = props; // 1: leave request, 2: holiday
  const [currentTime, setCurrentTime] = useState(moment());

  // FUNCTION
  const checkIfSameDay = (a, b) => {
    return moment(a).format('MM/DD/YYYY') === moment(b).format('MM/DD/YYYY');
  };

  const checkCurrentDay = (val) => {
    return checkIfSameDay(val, moment());
  };

  const checkLeaveRequest = (val, status) => {
    return data.some((x) => checkIfSameDay(x.fromDate, val) && status === x.status);
  };

  const checkHoliday = (val) => {
    return data.some((x) => checkIfSameDay(x.date.iso, val));
  };

  const getClassName = (val) => {
    let className = '';
    if (checkCurrentDay(val)) {
      className += styles.currentDay;
    }
    if (mode === 1) {
      const obj = {
        [IN_PROGRESS]: styles.inProgressDay,
        [ACCEPTED]: styles.acceptedDay,
        [REJECTED]: styles.rejectedDay,
      };
      Object.keys(obj).forEach((x) => {
        if (checkLeaveRequest(val, x)) {
          className += obj[x];
        }
      });
    }
    if (mode === 2) {
      if (checkHoliday(val)) {
        className += styles.holiday;
      }
    }
    return className;
  };

  const renderDate = (showTooltip, content, title) => {
    if (showTooltip) return <Tooltip title={title}>{content}</Tooltip>;
    return content;
  };
  // RENDER
  const dateCellRender = (value) => {
    const date = moment(value).date();
    const className = getClassName(value);

    // leave request
    if (mode === 1) {
      const filter = data.filter((x) => checkIfSameDay(x.fromDate, value));
      const getTypeNames = () => {
        return [
          ...new Set(
            filter.map((x, i) => {
              if (i + 1 < filter.length) return `${x.typeName}, `;
              return x.typeName;
            }),
          ),
        ];
      };
      return renderDate(
        filter.length > 0,
        <div className={`${styles.dateRender} ${className}`}>
          <span>{date}</span>
          <div className={styles.smallDot} />
        </div>,
        getTypeNames,
      );
    }

    // holiday
    const find = data.find((x) => checkIfSameDay(x.date?.iso, value));
    return renderDate(
      !!find,
      <div className={`${styles.dateRender} ${className}`}>
        <span>{date}</span>
        <div className={styles.smallDot} />
      </div>,
      find?.name,
    );
  };

  const headerRender = ({ value, type, onChange = () => {} }) => {
    return (
      <div className={styles.customHeader}>
        <div className={styles.time}>{moment(value).format('MMMM YYYY')}</div>
        <div className={styles.actions}>
          <img
            src={PrevIcon}
            className={styles.prev}
            onClick={() => onChange(moment(value).subtract(1, type))}
            alt=""
          />
          <img
            src={NextIcon}
            className={styles.next}
            onClick={() => onChange(moment(value).add(1, type))}
            alt=""
          />
        </div>
      </div>
    );
  };

  // MAIN
  return (
    <ConfigProvider locale={enGB}>
      <div className={styles.CustomCalendar}>
        <Calendar
          dateCellRender={dateCellRender}
          value={currentTime}
          headerRender={headerRender}
          onChange={(val) => setCurrentTime(val)}
        />
      </div>
    </ConfigProvider>
  );
};

export default connect(() => ({}))(CustomCalendar);
