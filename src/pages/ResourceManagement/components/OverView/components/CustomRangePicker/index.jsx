import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import { MinusOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { RangePicker } = DatePicker;

const CustomRangePicker = (props) => {
  const { startDate, endDate, onChange = () => {}, disabled = false } = props;

  // MAIN AREA
  return (
    <div className={styles.CustomRangePicker}>
      <div className={styles.rangePicker}>
        <RangePicker
          format="DD MMMM YYYY"
          separator={<MinusOutlined className={styles.minusSeparator} />}
          value={[startDate, endDate]}
          onChange={onChange}
          allowClear={false}
          disabled={disabled}
          suffixIcon={
            <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
          }
        />
      </div>
    </div>
  );
};

export default connect(() => ({}))(CustomRangePicker);
