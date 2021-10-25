import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { getCurrentCompany } from '@/utils/authority';
import Header from './components/Header';
import TimelineTable from './components/TimelineTable';
import styles from './index.less';
import { dateFormatAPI } from '@/utils/timeSheet';

const MyTimeSheet = (props) => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedView, setSelectedView] = useState('daily');
  const { dispatch, employee: { _id: employeeId = '' } = {} } = props;
  // FUNCTION AREA
  const fetchMyTimesheetEffect = () => {
    dispatch({
      type: 'timeSheet/fetchMyTimesheetEffect',
      payload: {
        companyId: getCurrentCompany(),
        employeeId,
        fromDate: moment(selectedDate).format(dateFormatAPI),
        toDate: moment(selectedDate).format(dateFormatAPI),
      },
    });
  };

  // USE EFFECT AREA
  useEffect(() => {
    if (selectedDate) {
      fetchMyTimesheetEffect();
    }
  }, [selectedDate]);

  // MAIN AREA
  return (
    <div className={styles.MyTimeSheet}>
      <Header
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedView={selectedView}
        setSelectedView={setSelectedView}
      />
      <TimelineTable selectedDate={selectedDate} />
    </div>
  );
};

export default connect(
  ({ timeSheet: { myTimesheet = [] } = {}, user: { currentUser: { employee = {} } = {} } }) => ({
    employee,
    myTimesheet,
  }),
)(MyTimeSheet);
