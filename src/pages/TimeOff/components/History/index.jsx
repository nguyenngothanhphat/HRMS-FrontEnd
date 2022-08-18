import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { formatHistoryData } from '@/utils/timeOff';
import { sortAlphabet } from '@/utils/utils';
import HistoryTable from './components/HistoryTable';
import LeaveBalance from './components/LeaveBalance';
import styles from './index.less';

const History = ({
  dispatch,
  employee,
  commonLeaves = [],
  specialLeaves = [],
  historyTimeoff = [],
  historyTypeList = [],
  padding = 24,
}) => {
  const leavesData = sortAlphabet(commonLeaves.concat(specialLeaves), 'typeName');
  const historyData = formatHistoryData(historyTimeoff);

  const [total, setTotal] = useState(0);

  const fetchHistory = async (values) => {
    const payload = { ...values, employee };
    const response = await dispatch({
      type: 'timeOff/fetchHistoryTimeoffByEmployee',
      payload,
    });
    setTotal(response?.total || 0);
  };

  const handleFilter = (values) => {
    fetchHistory(values);
  };

  useEffect(() => {
    dispatch({
      type: 'timeOff/fetchLeaveTypeByEmployee',
      payload: {
        employee,
      },
    });
    fetchHistory();
  }, []);

  return (
    <div className={styles.History} style={{ padding }}>
      <LeaveBalance data={leavesData} />
      <HistoryTable
        data={historyData}
        typeList={historyTypeList}
        onFilter={handleFilter}
        total={total}
      />
    </div>
  );
};

export default connect(
  ({
    timeOff: {
      historyTimeoff = [],
      yourTimeOffTypes: { commonLeaves = [], specialLeaves = [] } = {},
      historyTypeList = [],
    } = {},
    employeeProfile: { employee = '' },
  }) => ({
    historyTimeoff,
    commonLeaves,
    specialLeaves,
    historyTypeList,
    employee,
  }),
)(History);
