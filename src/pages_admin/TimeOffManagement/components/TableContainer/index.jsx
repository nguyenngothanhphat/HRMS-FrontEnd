// import moment from 'moment';
import React, { useEffect } from 'react';
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
    timeOffManagement: { listEmployee = [], listTimeOff = [], requestDetail },
    loadingList = false,
  } = props;

  const fetchEmployees = () => {
    dispatch({
      type: 'timeOffManagement/fetchEmployeeList',
      payload: {
        company: getCurrentCompany(),
        tenantId: getCurrentTenant(),
        status: ['INACTIVE', 'ACTIVE'],
      },
    });
  };

  const getDataTable = (values = {}) => {
    const { status = [] } = values;
    let newStatus = [...status];
    if (status.includes(TIMEOFF_STATUS.IN_PROGRESS)) {
      newStatus = [...newStatus, TIMEOFF_STATUS.IN_PROGRESS_NEXT];
    }
    const from = values.durationFrom ? moment(values.durationFrom).format('YYYY-MM-DD') : '';
    const to = values.durationFrom ? moment(values.durationFrom).format('YYYY-MM-DD') : '';
    dispatch({
      type: 'timeOffManagement/fetchListTimeOff',
      payload: {
        employee: values.user || '',
        from,
        to,
        status: newStatus,
        tenantId: getCurrentTenant(),
      },
    });
  };

  useEffect(() => {
    getDataTable();
    fetchEmployees();
  }, []);

  return (
    <div className={styles.TimeOffTableContainer}>
      <div className={styles.optionsHeader}>
        <OptionsHeader
          reloadData={getDataTable}
          listEmployee={listEmployee}
          listTimeOff={listTimeOff}
          disabled={loadingList}
        />
      </div>
      <div className={styles.contentContainer}>
        <TableTimeOff
          listTimeOff={listTimeOff}
          loading={loadingList}
          requestDetail={requestDetail}
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
    loadingActiveList: loading.effects['timeOffManagement/fetchEmployeeList'],
    loadingDetail: loading.effects['timeOffManagement/fetchRequestById'],
    timeOffManagement,
    companiesOfUser,
    companyLocationList,
  }),
)(TableContainer);
