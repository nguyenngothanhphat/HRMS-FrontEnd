import { Button, Modal } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { isEmpty } from 'lodash';
import { dateFormatAPI } from '@/utils/timeSheet';
import { getCurrentCompany } from '@/utils/authority';
import styles from './index.less';
import ModalContentSelectTasks from './components/ModalContentSelectTasks';
import ModalContentSelectDates from './components/ModalContentSelectDates';

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
    let datelist = [];
    const endDateTemp = moment(endDate).clone();

    if (startDate && endDate) {
      const now = moment(startDate);
      while (now.isSameOrBefore(moment(endDateTemp), 'day')) {
        datelist = [...datelist, moment(now).locale('en').format(dateFormatAPI)];
        now.add(1, 'days');
      }
    }

    return datelist;
  };

  const onImport = (datesProps) => {
    const ids = [];
    const datesTemp = getDateLists(datesProps[0], datesProps[1]);
    importingIds.forEach((item) => {
      item?.selectedIds.forEach((obj) => {
        ids.push(obj.id);
      });
    });

    return dispatch({
      type: 'timeSheet/importTimesheet',
      payload: {
        companyId: getCurrentCompany(),
        employeeId,
        dates: datesTemp,
        ids,
      },
    });
  };

  const handleFinish = async ({ dates: dateProp = [] }) => {
    if (!isEmpty(dateProp)) {
      const res = await onImport(dateProp);
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
              <Button className={styles.btnCancel} onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                className={styles.btnSubmit}
                type="primary"
                onClick={handleNextStep}
                loading={loadingImportTimesheet}
                disabled={isEmpty(importingIds)}
              >
                Next
              </Button>
            </div>
          </>
        );
      case 2:
        return (
          <div className={styles.containerButtons}>
            <Button className={styles.btnCancel} onClick={() => setStep(1)}>
              Previous
            </Button>
            <Button
              className={styles.btnSubmit}
              type="primary"
              onClick={handleFinish}
              loading={loadingImportTimesheet}
              htmlType="submit"
              form="myForm"
            >
              Import
            </Button>
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
          <ModalContentSelectTasks
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
            visible={visible}
          />
        ) : (
          <ModalContentSelectDates
            handleCancel={handleCancel}
            handleFinish={handleFinish}
            dates={dates}
            setDates={setDates}
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
