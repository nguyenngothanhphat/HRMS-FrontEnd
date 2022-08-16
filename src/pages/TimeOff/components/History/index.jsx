import { formatHistoryData } from '@/utils/timeOff';
import { sortAlphabet } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import HistoryTable from './components/HistoryTable';
import LeaveBalance from './components/LeaveBalance';
import styles from './index.less';

const History = ({
  dispatch,
  employee,
  commonLeaves,
  specialLeaves,
  historyTimeoff,
  historyTypeList,
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

    const { total = 0 } = response;
    setTotal(total);
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
    <div className={styles.History}>
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
