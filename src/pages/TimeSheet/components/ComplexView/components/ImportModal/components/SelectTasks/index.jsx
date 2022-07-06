import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { commonDateFormat, dateFormatAPI } from '@/utils/timeSheet';
import { getCurrentCompany } from '@/utils/authority';
import DateSwitcher from './components/DateSwitcher';
import TaskTable from './components/TaskTable';
import styles from './index.less';

const SelectTasks = (props) => {
  const { visible = false, dispatch } = props;

  const {
    loadingFetchTasks = false,
    importingIds = [],
    employee: { _id: employeeId = '' } = {},
    timesheetDataImporting = {},
    setSelectedDate = () => {},
    selectedDate = '',
  } = props;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const onPrevWeekClick = () => {
    const lastSunday = moment(startDate).add(-1, 'weeks');
    const currentSaturday = moment(endDate).add(-1, 'weeks');
    setStartDate(lastSunday);
    setEndDate(currentSaturday);
  };

  const onNextWeekClick = () => {
    const currentSunday = moment(startDate).add(1, 'weeks');
    const nextSaturday = moment(startDate).add(1, 'weeks').weekday(6);
    setStartDate(currentSunday);
    setEndDate(nextSaturday);
  };

  const enumerateDaysBetweenDates = (startDate1, endDate1) => {
    if (startDate1 && endDate1) {
      const now = startDate1.clone();
      const dates = [];

      while (now.isSameOrBefore(endDate1)) {
        dates.push(now.format(commonDateFormat));
        now.add(1, 'days');
      }
      return dates;
    }
    return [];
  };

  const fetchImportData = () => {
    dispatch({
      type: 'timeSheet/fetchImportData',
      payload: {
        companyId: getCurrentCompany(),
        employeeId,
        fromDate: moment(selectedDate).format(dateFormatAPI),
        toDate: moment(selectedDate).format(dateFormatAPI),
      },
    });
  };

  // USE EFFECT

  useEffect(() => {
    const lastSunday = moment(selectedDate).add(-1, 'weeks').weekday(7);
    const currentSaturday = moment(selectedDate).weekday(6);
    setStartDate(lastSunday);
    setEndDate(currentSaturday);
    return () => {};
  }, []);

  useEffect(() => {
    if (visible) {
      fetchImportData();
    }
  }, [selectedDate, visible]);

  const dates = enumerateDaysBetweenDates(startDate, endDate) || [];
  const notAssignedTasks = timesheetDataImporting.notAssignedTask || [];
  const assignedTasks = timesheetDataImporting.dailiesTask || [];
  let tasks = [];
  if (assignedTasks.length > 0) {
    tasks = [...assignedTasks[0].dailyTasks];
  }
  tasks = [...tasks, ...notAssignedTasks];

  return (
    <div className={styles.SelectTasks}>
      <DateSwitcher
        dates={dates}
        onPrevWeekClick={onPrevWeekClick}
        onNextWeekClick={onNextWeekClick}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        importingIds={importingIds}
      />
      <TaskTable
        list={tasks}
        selectedDate={selectedDate}
        loading={loadingFetchTasks}
        importingIds={importingIds}
      />
    </div>
  );
};

export default connect(
  ({
    timeSheet: { timesheetDataImporting = [], importingIds = [] } = {},
    user: { currentUser: { employee = {} } = {} },
    loading,
  }) => ({
    timesheetDataImporting,
    employee,
    loadingFetchTasks: loading.effects['timeSheet/fetchImportData'],
    loadingImportTimesheet: loading.effects['timeSheet/importTimesheet'],
    importingIds,
  }),
)(SelectTasks);
