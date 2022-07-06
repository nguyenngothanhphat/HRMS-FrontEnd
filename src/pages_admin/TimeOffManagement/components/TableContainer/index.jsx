// import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import OptionsHeader from '../OptionsHeader';
import TableTimeOff from '../TableTimeOff';
import styles from './index.less';

const TableContainer = (props) => {
  const {
    dispatch,
    timeOffManagement: {
      listEmployee = [],
      listTimeOff = [],
      requestDetail,
      selectedLocations = [],
    },
    loadingList = false,
    payload = {},
    setPayload = () => {},
  } = props;

  const [fromDate, setFromDate] = useState(moment().startOf('month'));
  const [toDate, setToDate] = useState(moment().endOf('month'));
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchEmployees = () => {
    dispatch({
      type: 'timeOffManagement/fetchEmployeeList',
      payload: {
        company: getCurrentCompany(),
        tenantId: getCurrentTenant(),
        status: ['INACTIVE', 'ACTIVE'],
        location: selectedLocations,
      },
    });
  };

  const getDataTable = (values = {}) => {
    const { status = [] } = values;
    let newStatus = [...status];
    if (status.includes(TIMEOFF_STATUS.IN_PROGRESS)) {
      newStatus = [...newStatus, TIMEOFF_STATUS.IN_PROGRESS_NEXT];
    }
    const from = fromDate ? moment(fromDate).format('YYYY-MM-DD') : '';
    const to = toDate ? moment(toDate).format('YYYY-MM-DD') : '';
    dispatch({
      type: 'timeOffManagement/fetchListTimeOff',
      payload: {
        employee: values.user || '',
        from,
        to,
        status: newStatus,
        tenantId: getCurrentTenant(),
        selectedLocations,
        types: values.types || [],
      },
    });
  };

  useEffect(() => {
    getDataTable(payload);
  }, [JSON.stringify(payload)]);

  useEffect(() => {
    fetchEmployees();
    // select a location will clear the types selected in form
    getDataTable({ ...payload, types: [] });
  }, [JSON.stringify(selectedLocations)]);

  return (
    <div className={styles.TimeOffTableContainer}>
      <div className={styles.optionsHeader}>
        <OptionsHeader
          listEmployee={listEmployee}
          listTimeOff={listTimeOff}
          disabled={loadingList}
          setPayload={setPayload}
          setFromDate={setFromDate}
          setToDate={setToDate}
          fromDate={fromDate}
          toDate={toDate}
          selectedRows={selectedRows}
        />
      </div>
      <div className={styles.contentContainer}>
        <TableTimeOff
          listTimeOff={listTimeOff}
          loading={loadingList}
          requestDetail={requestDetail}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      </div>
    </div>
  );
};

export default connect(
  ({
    loading,
    timeOffManagement,
    user: { companiesOfUser = [] } = {},
    location: { companyLocationList = [] } = {},
  }) => ({
    loadingList: loading.effects['timeOffManagement/fetchListTimeOff'],
    loadingDetail: loading.effects['timeOffManagement/fetchRequestById'],
    timeOffManagement,
    companiesOfUser,
    companyLocationList,
  }),
)(TableContainer);
