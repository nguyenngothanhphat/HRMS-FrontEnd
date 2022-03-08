import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { debounce } from 'lodash';
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
  const [filterData, setFilterData] = useState([]);
  const [nameSearch, setNameSearch] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);

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
    setFilterData(tempData);
  }, [JSON.stringify(myTimesheet)]);

  useEffect(() => {
    if (nameSearch) {
      const newData = data.filter((val) => {
        return (
          val.projectName
            .toLowerCase()
            .replace(/ /g, '')
            .includes(nameSearch.toLowerCase().replace(/ /g, '')) ||
          val.taskName
            .toLowerCase()
            .replace(/ /g, '')
            .includes(nameSearch.toLowerCase().replace(/ /g, ''))
        );
      });
      setFilterData(newData);
      setLoadingSearch(true);
      setTimeout(() => {
        setLoadingSearch(false);
      }, 500);
    } else {
      setFilterData(data);
      setLoadingSearch(false);
    }
  }, [nameSearch]);
  // RENDER UI
  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <span className={styles.header__text}>{legalName || 'Employee'} Project Details</span>
      </div>
    );
  };

  const onSearchDebounce = debounce((value) => {
    setNameSearch(value);
  }, 1000);

  const onChangeSearch = (value) => {
    const formatValue = value.toLowerCase();
    onSearchDebounce(formatValue);
  };

  const renderModalContent = () => {
    return (
      <div className={styles.content}>
        <Header onChangeSearch={onChangeSearch} startDate={startDate} endDate={endDate} />
        <ProjectTable list={filterData} loading={loadingFetchMyTimesheet || loadingSearch} />
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
