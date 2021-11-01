import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { dateFormatAPI } from '@/utils/timeSheet';
import { getCurrentCompany } from '@/utils/authority';
import Header from './components/Header';
import styles from './index.less';

const TeamView = (props) => {
  // daily
  const [selectedDate, setSelectedDate] = useState(moment());

  const { dispatch, employee: { _id: employeeId = '' } = {} } = props;

  // FUNCTION AREA
  const fetchMyTimesheetEffectByType = (startDate, endDate) => {
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
    if (selectedDate) {
      fetchMyTimesheetEffectByType(selectedDate, selectedDate);
    }
  }, [selectedDate]);

  // RENDER UI

  const renderHeader = () => {
    return <Header selectedDate={selectedDate} setSelectedDate={setSelectedDate} />;
  };

  const renderTable = () => {
    return <span>Hello</span>;
  };

  const renderFooter = () => {
    return <span>Hello</span>;
  };

  // MAIN AREA
  return (
    <div className={styles.TeamView}>
      {renderHeader()}
      {renderTable()}
      {renderFooter()}
    </div>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
}))(TeamView);
