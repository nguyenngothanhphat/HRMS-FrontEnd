import { Button } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect } from 'umi';
import AddIcon from '@/assets/timeSheet/add.svg';
import AddTaskModal from '@/pages/TimeSheet/components/ComplexView/components/AddTaskModal';
import CustomRangePicker from '@/pages/TimeSheet/components/ComplexView/components/CustomRangePicker';
import ImportModal from '@/pages/TimeSheet/components/ComplexView/components/ImportModal';
import styles from './index.less';

const WeeklyHeader = (props) => {
  const {
    startDate,
    endDate,
    setStartDate = () => {},
    setEndDate = () => {},
    viewChangeComponent = '',
    myTimesheetByWeek,
  } = props;
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);

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
        <CustomRangePicker
          startDate={startDate}
          endDate={endDate}
          onPrevClick={onPrevWeekClick}
          onNextClick={onNextWeekClick}
          onChange={onDatePickerChange}
          disabled
        />
      </div>
      <div className={styles.WeeklyHeader__middle}>{viewChangeComponent()}</div>
      <div className={styles.WeeklyHeader__right}>
        <Button icon={<img src={AddIcon} alt="" />} onClick={() => setAddTaskModalVisible(true)}>
          Add Task
        </Button>
        {/* TEMPORARILY DISABLE FOR WEEKLY VIEW & MONTHLY VIEW FOR 15 JAN 2022 RELEASE  */}
        <Button disabled onClick={() => setImportModalVisible(true)}>
          Import
        </Button>
      </div>
      <AddTaskModal
        visible={addTaskModalVisible}
        onClose={() => setAddTaskModalVisible(false)}
        mode="multiple"
        aaaa={false}
        myTimesheetByWeek={myTimesheetByWeek}
        date={startDate}
      />
      <ImportModal visible={importModalVisible} onClose={() => setImportModalVisible(false)} />
    </div>
  );
};

export default connect(() => ({}))(WeeklyHeader);
