import { MinusOutlined } from '@ant-design/icons';
import { Button, DatePicker } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect } from 'umi';
import AddIcon from '@/assets/timeSheet/add.svg';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import NextIcon from '@/assets/timeSheet/next.svg';
import PrevIcon from '@/assets/timeSheet/prev.svg';
import { rangePickerFormat } from '@/utils/timeSheet';
import AddTaskModal from '@/pages/TimeSheet/components/ComplexView/components/AddTaskModal';
import styles from './index.less';

const { RangePicker } = DatePicker;

const WeeklyHeader = (props) => {
  const {
    startDate,
    endDate,
    setStartDate = () => {},
    setEndDate = () => {},
    viewChangeComponent = '',
  } = props;
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);

  // HEADER AREA
  const onPrevWeekClick = () => {
    const lastSunday = moment(startDate).add(-1, 'weeks');
    const currentSunday = moment(startDate).add(-1, 'weeks').weekday(7);
    setStartDate(lastSunday);
    setEndDate(currentSunday);
  };

  const onNextWeekClick = () => {
    const nextSunday = moment(startDate).add(1, 'weeks');
    const currentSunday = moment(startDate).add(1, 'weeks').weekday(7);
    setStartDate(nextSunday);
    setEndDate(currentSunday);
  };

  const onDatePickerChange = (dates = []) => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
  };

  // MAIN AREA
  return (
    <div className={styles.WeeklyHeader}>
      <div className={styles.WeeklyHeader__left}>
        <div className={styles.prevWeek} onClick={onPrevWeekClick}>
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
        <div className={styles.nextWeek} onClick={onNextWeekClick}>
          <img src={NextIcon} alt="" />
        </div>
      </div>
      <div className={styles.WeeklyHeader__middle}>{viewChangeComponent()}</div>
      <div className={styles.WeeklyHeader__right} onClick={() => setAddTaskModalVisible(true)}>
        <Button icon={<img src={AddIcon} alt="" />}>Add Task</Button>
        <Button>Import</Button>
      </div>
      <AddTaskModal
        visible={addTaskModalVisible}
        onClose={() => setAddTaskModalVisible(false)}
        mode="multiple"
      />
    </div>
  );
};

export default connect(() => ({}))(WeeklyHeader);
