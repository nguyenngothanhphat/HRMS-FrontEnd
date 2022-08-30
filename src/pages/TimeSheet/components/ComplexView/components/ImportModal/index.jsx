import { Modal } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { isEmpty } from 'lodash';
import { dateFormatAPI } from '@/constants/timeSheet';
import { getCurrentCompany } from '@/utils/authority';
import styles from './index.less';
import SelectTasks from './components/SelectTasks';
import SelectPeriod from './components/SelectPeriod';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';

const ImportModal = (props) => {
  const {
    dispatch,
    visible = false,
    title = 'Import Tasks',
    label = 'Please select the tasks that you want to import',
    labelNext = 'Please select one or more dates to which the tasks must be imported.',
    onClose = () => {},
    employee: { _id: employeeId = '' } = {},
    importingIds = [],
    loadingImportTimesheet = false,
    date: importDate = '',
  } = props;

  const [step, setStep] = useState(1);
  const [dates, setDates] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [validImport, setValidImport] = useState(false);

  useEffect(() => {
    if (importDate) {
      setSelectedDate(moment(importDate));
    }
  }, [importDate]);

  // FUNCTIONS
  // get dates between two dates

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

  const refreshData = () => {
    dispatch({
      type: 'timeSheet/fetchMyTimesheetByTypeEffect',
      isRefreshing: true,
    });
  };

  // RENDER UI
  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <div>
          <div className={styles.header__title}>{title}</div>
          <div className={styles.header__label}>{step === 1 ? label : labelNext}</div>
        </div>
        {step === 1 && (
          <span className={styles.header__date}>
            {moment(selectedDate).locale('en').format('MMMM DD, YYYY')}
          </span>
        )}
      </div>
    );
  };

  const handleCancel = () => {
    dispatch({ type: 'timeSheet/clearImportModalData' });
    onClose();
    setStep(1);
  };

  const getDateLists = (startDate, endDate) => {
    let dateList = [];
    const endDateTemp = moment(endDate).clone();

    if (startDate && endDate) {
      const now = moment(startDate);
      while (now.isSameOrBefore(moment(endDateTemp), 'day')) {
        dateList = [...dateList, moment(now).locale('en').format(dateFormatAPI)];
        now.add(1, 'days');
      }
    }

    return dateList;
  };

  const handleFinish = async ({ dates: dateProps = [] }, selected) => {
    if (dateProps?.length > 1) {
      const formatTime = (time) => moment(time, 'hh:mm a').format('HH:mm');
      const payload = {
        params: {
          companyId: getCurrentCompany(),
          employeeId,
        },
        data: {
          selected: selected.map((task) => ({
            id: task.id,
            startTime: formatTime(task.startTime),
            endTime: formatTime(task.endTime),
          })),
          dates: getDateLists(dateProps[0], dateProps[1]),
        },
      };
      const res = await dispatch({
        type: 'timeSheet/importTimesheet',
        payload,
      });
      if (res.code === 200) {
        handleCancel();
        refreshData();
      }
    }
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const renderModalFooter = () => {
    switch (step) {
      case 1:
        return (
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
              <CustomSecondaryButton onClick={handleCancel}>Cancel</CustomSecondaryButton>
              <CustomPrimaryButton
                onClick={handleNextStep}
                loading={loadingImportTimesheet}
                disabled={isEmpty(importingIds)}
              >
                Next
              </CustomPrimaryButton>
            </div>
          </>
        );
      case 2:
        return (
          <div className={styles.containerButtons}>
            <CustomSecondaryButton onClick={() => setStep(1)}>Previous</CustomSecondaryButton>
            <CustomPrimaryButton
              loading={loadingImportTimesheet}
              htmlType="submit"
              form="myForm"
              disabled={!validImport}
            >
              Import
            </CustomPrimaryButton>
          </div>
        );
      default:
        return '';
    }
  };

  return (
    <>
      <Modal
        className={`${styles.ImportModal} ${styles.noPadding}`}
        onCancel={handleCancel}
        destroyOnClose
        width={700}
        footer={renderModalFooter()}
        title={renderModalHeader()}
        centered
        visible={visible}
      >
        {step === 1 ? (
          <SelectTasks
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
            visible={visible}
          />
        ) : (
          <SelectPeriod
            handleCancel={handleCancel}
            handleFinish={handleFinish}
            dates={dates}
            setDates={setDates}
            setValid={setValidImport}
          />
        )}
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
