import { Button, Modal } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { dateFormatAPI } from '@/utils/timeSheet';
import { getCurrentCompany } from '@/utils/authority';
import DateSwitcher from './components/DateSwitcher';
import TaskTable from './components/TaskTable';
import styles from './index.less';

const dateFormat = 'MM/DD/YYYY';

const ImportModal = (props) => {
  const {
    dispatch,
    visible = false,
    title = 'Import rows from yesterday',
    onClose = () => {},
    employee: { _id: employeeId = '' } = {},
    timesheetDataImporting = [],
    importingIds = [],
    loadingFetchTasks = false,
    loadingImportTimesheet = false,
    date: importDate = '',
  } = props;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(moment());

  // FUNCTIONS
  // get dates between two dates
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

  const addZeroToNumber = (number) => {
    if (number < 10 && number >= 0) return `0${number}`.slice(-2);
    return number;
  };

  const getSumImportingIds = () => {
    let temp = 0;
    importingIds.forEach((v) => {
      temp += v.selectedIds.length;
    });
    return temp;
  };

  // USE EFFECT
  useEffect(() => {
    const lastSunday = moment().add(-1, 'weeks').weekday(7);
    const currentSaturday = moment().weekday(6);
    setStartDate(lastSunday);
    setEndDate(currentSaturday);
    return () => {};
  }, []);

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

  useEffect(() => {
    if (visible) {
      fetchImportData();
    }
  }, [selectedDate, visible]);

  // RENDER UI
  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <span className={styles.header__text}>{title}</span>
        <span className={styles.header__date}>
          {moment(selectedDate).locale('en').format('MMMM DD, YYYY')}
        </span>
      </div>
    );
  };

  const handleCancel = () => {
    dispatch({ type: 'timeSheet/clearImportModalData' });
    onClose();
  };

  const onImport = () => {
    let ids = [];
    importingIds.forEach((item) => {
      ids = [...ids, ...item.selectedIds];
    });
    return dispatch({
      type: 'timeSheet/importTimesheet',
      payload: {
        companyId: getCurrentCompany(),
        employeeId,
        date: moment(importDate).locale('en').format(dateFormatAPI),
        ids,
      },
    });
  };
  const handleFinish = async () => {
    const res = await onImport();
    if (res.code === 200) {
      handleCancel();
    }
  };

  const renderModalContent = () => {
    const dates = enumerateDaysBetweenDates(startDate, endDate) || [];
    const tasks = timesheetDataImporting.notAssignedTask || [];
    return (
      <div className={styles.content}>
        <DateSwitcher
          dates={dates}
          onPrevWeekClick={onPrevWeekClick}
          onNextWeekClick={onNextWeekClick}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          importingIds={importingIds}
        />
        <TaskTable
          list={tasks.length > 0 ? tasks[0].dailyTasks : []}
          selectedDate={selectedDate}
          loading={loadingFetchTasks}
          importingIds={importingIds}
        />
      </div>
    );
  };

  return (
    <>
      <Modal
        className={`${styles.ImportModal} ${styles.noPadding}`}
        onCancel={handleCancel}
        destroyOnClose
        width={700}
        footer={
          <>
            <div className={styles.taskNumberCount}>
              {getSumImportingIds() > 0 && (
                <>
                  <span className={styles.descText}>Tasks Selected:</span>
                  <span className={styles.number}>{addZeroToNumber(getSumImportingIds())}</span>
                </>
              )}
            </div>
            <div className={styles.mainButtons}>
              <Button className={styles.btnCancel} onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                className={styles.btnSubmit}
                type="primary"
                onClick={handleFinish}
                loading={loadingImportTimesheet}
              >
                Import
              </Button>
            </div>
          </>
        }
        title={renderModalHeader()}
        centered
        visible={visible}
      >
        {renderModalContent()}
      </Modal>
    </>
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
)(ImportModal);
