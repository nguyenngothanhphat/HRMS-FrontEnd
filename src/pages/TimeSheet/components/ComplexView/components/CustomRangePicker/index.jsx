import { MinusOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import React from 'react';
import { connect } from 'umi';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import NextIcon from '@/assets/timeSheet/next.svg';
import PrevIcon from '@/assets/timeSheet/prev.svg';
import { rangePickerFormat } from '@/utils/timeSheet';
import styles from './index.less';

const { RangePicker } = DatePicker;

const CustomRangePicker = (props) => {
  const {
    startDate,
    endDate,
    onPrevClick = () => {},
    onNextClick = () => {},
    onChange = () => {},
    disabled = false,
    disableBtn = false,
  } = props;

  // MAIN AREA
  return (
    <div className={styles.CustomRangePicker}>
      <div
        className={styles.prevBtn}
        onClick={onPrevClick}
        style={{
          cursor: disableBtn ? 'default' : 'pointer',
          pointerEvents: disableBtn ? 'none' : 'auto',
        }}
      >
        <img src={PrevIcon} alt="" />
      </div>
      <div className={styles.rangePicker}>
        <RangePicker
          format={rangePickerFormat}
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
      <div
        className={styles.nextBtn}
        onClick={onNextClick}
        style={{
          cursor: disableBtn ? 'default' : 'pointer',
          pointerEvents: disableBtn ? 'none' : 'auto',
        }}
      >
        <img src={NextIcon} alt="" />
      </div>
    </div>
  );
};

export default connect(() => ({}))(CustomRangePicker);
