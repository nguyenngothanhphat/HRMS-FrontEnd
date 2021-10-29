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
import ImportModal from '@/pages/TimeSheet/components/ComplexView/components/ImportModal';
import styles from './index.less';

const { RangePicker } = DatePicker;

const MonthlyHeader = (props) => {
  const {
    startDate,
    endDate,
    setStartDate = () => {},
    setEndDate = () => {},
    viewChangeComponent = '',
  } = props;
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);

  // HEADER AREA
  const onPrevMonthClick = () => {
    const startOfMonth = moment(startDate).add(-1, 'months').startOf('month');
    const endOfMonth = moment(startDate).add(-1, 'months').endOf('month');
    setStartDate(startOfMonth);
    setEndDate(endOfMonth);
  };

  const onNextMonthClick = () => {
    const startOfMonth = moment(startDate).add(1, 'months').startOf('month');
    const endOfMonth = moment(startDate).add(1, 'months').endOf('month');
    setStartDate(startOfMonth);
    setEndDate(endOfMonth);
  };

  const onDatePickerChange = (dates = []) => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
  };

  // MAIN AREA
  return (
    <div className={styles.MonthlyHeader}>
      <div className={styles.MonthlyHeader__left}>
        <div className={styles.prevMonth} onClick={onPrevMonthClick}>
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
        <div className={styles.nextMonth} onClick={onNextMonthClick}>
          <img src={NextIcon} alt="" />
        </div>
      </div>
      <div className={styles.MonthlyHeader__middle}>{viewChangeComponent()}</div>
      <div className={styles.MonthlyHeader__right}>
        <Button icon={<img src={AddIcon} alt="" />} onClick={() => setAddTaskModalVisible(true)}>
          Add Task
        </Button>
        <Button onClick={() => setImportModalVisible(true)}>Import</Button>
      </div>
      <AddTaskModal
        visible={addTaskModalVisible}
        onClose={() => setAddTaskModalVisible(false)}
        mode="multiple"
      />
      <ImportModal visible={importModalVisible} onClose={() => setImportModalVisible(false)} />
    </div>
  );
};

export default connect(() => ({}))(MonthlyHeader);
