import { Calendar, ConfigProvider, Tooltip } from 'antd';
import enGB from 'antd/lib/locale-provider/en_GB';
import moment from 'moment';
import 'moment/locale/en-gb';
import React from 'react';
import { connect } from 'umi';
import TypeColorTag from '../TypeColorTag';
import NextIcon from '@/assets/timeOff/next.svg';
import PrevIcon from '@/assets/timeOff/previous.svg';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import styles from './index.less';

const { IN_PROGRESS, ACCEPTED, REJECTED } = TIMEOFF_STATUS;

moment.locale('en-gb'); // important!

const CustomCalendar = (props) => {
  const { holidays = [], leaveRequests = [], currentTime = '', setCurrentTime = () => {} } = props;
  // FUNCTION
  const checkIfSameDay = (a, b, c = []) => {
    return (
      moment(a).format('MM/DD/YYYY') === moment(b).format('MM/DD/YYYY') ||
      c.some((d) => moment(d, 'YYYY-MM-DD').format('MM/DD/YYYY') === moment(b).format('MM/DD/YYYY'))
    );
  };
  const checkCurrentDay = (val) => {
    return checkIfSameDay(val, moment());
  };

  const checkLeaveRequest = (val, status) => {
    return leaveRequests.some((x) => {
      if (x.fromDate) {
        return checkIfSameDay(x.fromDate, val) && status === x.status;
      }
      if (x?.listLeave?.length) {
        return checkIfSameDay('', val, x.listLeave) && status === x.status;
      }
      return false;
    });
  };

  const checkHoliday = (val) => {
    return holidays.some((x) => checkIfSameDay(x.date.iso, val));
  };

  const getClassName = (val) => {
    let className = '';
    if (checkCurrentDay(val)) {
      className += `${styles.currentDay} `;
    }

    const obj = {
      [IN_PROGRESS]: styles.inProgressDay,
      [ACCEPTED]: styles.acceptedDay,
      [REJECTED]: styles.rejectedDay,
    };
    Object.keys(obj).forEach((x) => {
      if (checkLeaveRequest(val, x)) {
        className += `${obj[x]} `;
      }
    });

    if (checkHoliday(val)) {
      className += `${styles.holiday} `;
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

    const filter = [
      ...leaveRequests.filter((x) => {
        if (x.fromDate) {
          return checkIfSameDay(x.fromDate, value);
        }
        if (x?.listLeave?.length) {
          return checkIfSameDay('', value, x.listLeave);
        }
        return false;
      }),
      ...holidays.filter((x) => checkIfSameDay(x.date?.iso, value)),
    ];
    const getNames = () => {
      return [
        ...new Set(
          filter.map((x, i) => {
            const name = x.name || x.typeName;
            if (i + 1 < filter.length) return `${name}, `;
            return name;
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
      getNames(),
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
        <TypeColorTag />
      </div>
    </ConfigProvider>
  );
};

export default connect(() => ({}))(CustomCalendar);
