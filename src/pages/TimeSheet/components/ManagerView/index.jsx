import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { dateFormatAPI } from '@/utils/timeSheet';
import { getCurrentCompany } from '@/utils/authority';
import Header from './components/Header';
import TimelineTable from './components/TimelineTable';
import styles from './index.less';

const ManagerView = (props) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { dispatch, employee: { _id: employeeId = '' } = {} } = props;

  // FUNCTION AREA
  const fetchManagerTimesheetEffect = () => {
    dispatch({
      type: 'timeSheet/fetchManagerTimesheetEffect',
      payload: {
        companyId: getCurrentCompany(),
        managerId: employeeId,
        fromDate: moment(startDate).format(dateFormatAPI),
        toDate: moment(endDate).format(dateFormatAPI),
      },
    });
  };

  // USE EFFECT AREA
  useEffect(() => {
    if (startDate && endDate) {
      fetchManagerTimesheetEffect();
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const lastSunday = moment().weekday(1);
    const currentSunday = moment().weekday(7);
    setStartDate(lastSunday);
    setEndDate(currentSunday);
    return () => {};
  }, []);

  // MAIN AREA
  return (
    <div className={styles.ManagerView}>
      <Header
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      <TimelineTable startDate={startDate} endDate={endDate} />
    </div>
  );
};

export default connect(
  ({
    timeSheet: { managerTimesheet = [] } = {},
    user: { currentUser: { employee = {} } = {} },
  }) => ({
    employee,
    managerTimesheet,
  }),
)(ManagerView);
