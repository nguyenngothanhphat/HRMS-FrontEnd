import { MinusOutlined, SearchOutlined } from '@ant-design/icons';
import { DatePicker, Select, Input } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import { rangePickerFormat, VIEW_TYPE, projectColor } from '@/utils/timeSheet';
import PrevIcon from '@/assets/timeSheet/prev.svg';
import NextIcon from '@/assets/timeSheet/next.svg';
import FilterIcon from '@/assets/timeSheet/filter.svg';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

const mockProjects = [
  {
    id: 1,
    name: 'HRMS',
  },
  {
    id: 2,
    name: 'Udaan',
  },
];
const Header = (props) => {
  const {
    startDate,
    endDate,
    setStartDate = () => {},
    setEndDate = () => {},
    currentProject = '',
    setCurrentProject = () => {},
    viewChangeComponent = '',
    type = '',
  } = props;

  // HEADER AREA FOR MONTH
  const onPrevClick = () => {
    if (type === VIEW_TYPE.M) {
      const startOfMonth = moment(startDate).add(-1, 'months').startOf('month');
      const endOfMonth = moment(startDate).add(-1, 'months').endOf('month');
      setStartDate(startOfMonth);
      setEndDate(endOfMonth);
    }
    if (type === VIEW_TYPE.W) {
      const lastSunday = moment(startDate).add(-1, 'weeks');
      const currentSunday = moment(startDate).add(-1, 'weeks').weekday(7);
      setStartDate(lastSunday);
      setEndDate(currentSunday);
    }
  };

  const onNextClick = () => {
    if (type === VIEW_TYPE.M) {
      const startOfMonth = moment(startDate).add(1, 'months').startOf('month');
      const endOfMonth = moment(startDate).add(1, 'months').endOf('month');
      setStartDate(startOfMonth);
      setEndDate(endOfMonth);
    }
    if (type === VIEW_TYPE.W) {
      const nextSunday = moment(startDate).add(1, 'weeks');
      const currentSunday = moment(startDate).add(1, 'weeks').weekday(7);
      setStartDate(nextSunday);
      setEndDate(currentSunday);
    }
  };

  const onDatePickerChange = (dates = []) => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
  };

  const getColorByIndex = (index) => {
    return projectColor[index % projectColor.length];
  };

  const iconStyle = (index) => {
    return {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '24px',
      height: '24px',
      marginRight: '6px',
      background: getColorByIndex(index),
      border: '1px solid rgba(255, 255, 255, 0)',
      borderRadius: '50%',
      outline: 'none',
      cursor: 'default',
    };
  };

  const projectNameStyle = {
    display: 'block',
    paddingLeft: '2px',
    color: '#212020',
    fontWeight: '500',
    fontSize: '13px',
    textAlign: 'left',
  };

  const searchPrefix = () => {
    return (
      <SearchOutlined
        style={{
          fontSize: 16,
          color: 'black',
          marginRight: '10px',
        }}
      />
    );
  };

  // MAIN AREA
  return (
    <div className={styles.Header}>
      <div className={styles.Header__left}>
        <div className={styles.projectSelector}>
          <Select value={currentProject} onChange={(val) => setCurrentProject(val)}>
            {mockProjects.map((v, index) => (
              <Option value={v.id}>
                <div
                  className={styles.projectName}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}
                >
                  <div className={styles.icon} style={iconStyle(index)}>
                    <span
                      style={{
                        color: '#fff',
                        fontWeight: '500',
                        fontSize: '13px',
                      }}
                    >
                      {v.name ? v.name.toString()?.charAt(0) : 'P'}
                    </span>
                  </div>
                  <span className={styles.name} style={projectNameStyle}>
                    {v.name}
                  </span>
                </div>
              </Option>
            ))}
          </Select>
        </div>
        <div className={styles.prevMonth} onClick={onPrevClick}>
          <img src={PrevIcon} alt="" />
        </div>
        <div className={styles.rangePicker}>
          <RangePicker
            format={rangePickerFormat}
            separator={<MinusOutlined className={styles.minusSeparator} />}
            value={[startDate, endDate]}
            onChange={onDatePickerChange}
            allowClear={false}
            disabled
            suffixIcon={
              <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
            }
          />
        </div>
        <div className={styles.nextMonth} onClick={onNextClick}>
          <img src={NextIcon} alt="" />
        </div>
      </div>
      <div className={styles.Header__middle}>{viewChangeComponent()}</div>
      <div className={styles.Header__right}>
        <div className={styles.filterIcon}>
          <img src={FilterIcon} alt="" />
          <span>Filter</span>
        </div>
        <div className={styles.searchBox}>
          <Input
            className={styles.searchInput}
            placeholder="Search by Name, Task..."
            prefix={searchPrefix()}
          />
        </div>
      </div>
    </div>
  );
};

export default connect(() => ({}))(Header);
