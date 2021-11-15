import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { dateFormatAPI } from '@/utils/timeSheet';
import { getCurrentCompany } from '@/utils/authority';
import Header from './components/Header';
import MemberTable from './components/MemberTable';
import Pagination from './components/Pagination';
import styles from './index.less';

const TeamView = (props) => {
  // weekly
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { dispatch, employee: { _id: employeeId = '' } = {} } = props;

  // FUNCTION AREA
  const fetchMyTimesheetEffectByType = () => {
    dispatch({
      type: 'timeSheet/fetchMyTimesheetByTypeEffect',
      payload: {
        companyId: getCurrentCompany(),
        employeeId,
        fromDate: moment(startDate).format(dateFormatAPI),
        toDate: moment(endDate).format(dateFormatAPI),
        viewType: 'D',
      },
    });
  };

  // USE EFFECT AREA
  useEffect(() => {
    if (startDate) {
      fetchMyTimesheetEffectByType();
    }
  }, [startDate]);

  // generate dates for week
  useEffect(() => {
    const lastSunday = moment().weekday(1);
    const currentSunday = moment().weekday(7);
    setStartDate(lastSunday);
    setEndDate(currentSunday);
  }, []);

  // MAIN AREA
  return (
    <div className={styles.TeamView}>
      <Header
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      <MemberTable />
      <Pagination />
    </div>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
}))(TeamView);
