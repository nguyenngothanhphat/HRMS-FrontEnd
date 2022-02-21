import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import styles from './index.less';
import Header from './components/Header';
import ProjectTable from './components/ProjectTable';
import { getCurrentCompany } from '@/utils/authority';
import { dateFormatAPI } from '@/utils/timeSheet';

const EmployeeProjectDetailModal = (props) => {
  const {
    dispatch,
    visible = false,
    onClose = () => {},
    selectedEmployee: { employeeId = '', legalName = '' } = {},
    startDate = '',
    endDate = '',
  } = props;

  const { timeSheet: { myTimesheet = [] } = {}, loadingFetchMyTimesheet = false } = props;

  const [data, setData] = useState([]);

  // FUNCTION AREA
  const fetchMyTimesheetEffect = () => {
    dispatch({
      type: 'timeSheet/fetchMyTimesheetEffect',
      payload: {
        companyId: getCurrentCompany(),
        employeeId,
        fromDate: moment(startDate).format(dateFormatAPI),
        toDate: moment(endDate).format(dateFormatAPI),
      },
    });
  };

  const handleCancel = () => {
    onClose();
  };

  const formatData = (data1) => {
    let result = [];
    data1.forEach((item) => {
      result = [
        ...result,
        ...item.timesheet.map((x) => {
          return {
            ...x,
            date: item.date,
          };
        }),
      ];
    });
    return result;
  };

  useEffect(() => {
    if (visible && startDate && endDate && employeeId) {
      fetchMyTimesheetEffect();
    }
  }, [employeeId, startDate, endDate]);

  useEffect(() => {
    const tempData = formatData(myTimesheet);
    setData(tempData);
  }, [JSON.stringify(myTimesheet)]);

  // RENDER UI
  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <span className={styles.header__text}>{legalName || 'Employee'} Project Details</span>
      </div>
    );
  };

  const renderModalContent = () => {
    return (
      <div className={styles.content}>
        <Header startDate={startDate} endDate={endDate} />
        <ProjectTable list={data} loading={loadingFetchMyTimesheet} />
      </div>
    );
  };

  return (
    <>
      <Modal
        className={`${styles.EmployeeProjectDetailModal} ${styles.noPadding}`}
        onCancel={handleCancel}
        destroyOnClose
        width={850}
        title={renderModalHeader()}
        centered
        visible={visible}
        footer={null}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default connect(({ timeSheet, loading }) => ({
  timeSheet,
  loadingFetchMyTimesheet: loading.effects['timeSheet/fetchMyTimesheetEffect'],
}))(EmployeeProjectDetailModal);
