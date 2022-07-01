import moment from 'moment';

import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { dateFormatAPI } from '@/utils/timeSheet';

import DateSwitcher from '../DateSwitcher';
import TaskTable from '../TaskTable';
import styles from './index.less';
import { getCurrentCompany } from '@/utils/authority';

const dateFormat = 'MM/DD/YYYY';

const ModalContentSelectTasks = (props) => {
  const { visible = false, dispatch } = props;

  const {
    loadingFetchTasks = false,
    importingIds = [],
    employee: { _id: employeeId = '' } = {},
    timesheetDataImporting = {},
  } = props;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(moment());

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
        dates.push(now.format(dateFormat));
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
    const lastSunday = moment().add(-1, 'weeks').weekday(7);
    const currentSaturday = moment().weekday(6);
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
    <div className={styles.ModalContentSelectTasks}>
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
)(ModalContentSelectTasks);
