import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Spin } from 'antd';
import { getCurrentCompany } from '@/utils/authority';
import { dateFormatAPI } from '@/utils/timeSheet';
import LeftArrow from '@/assets/dashboard/leftArrow.svg';
import SmallLeftArrow from '@/assets/dashboard/smallLeftArrow.svg';
import SmallRightArrow from '@/assets/dashboard/smallRightArrow.svg';
import styles from './index.less';
import CustomCalendar from './components/CustomCalendar';

const dateFormat = 'MMM YYYY';
const Timesheets = (props) => {
  const [selectedMonth, setSelectedMonth] = useState(moment());

  const {
    dispatch,
    myTimesheet = [],
    currentUser: { employee: { _id: employeeId = '' } = {} } = {},
    loadingFetch = false,
  } = props;

  // FUNCTION
  const onFillTimesheet = () => {
    history.push('/time-sheet');
  };

  const getStartDate = () => {
    return moment(selectedMonth).startOf('month').subtract(6, 'days');
  };

  const getEndDate = () => {
    return moment(selectedMonth).endOf('month').add(6, 'days');
  };

  // USE EFFECT
  useEffect(() => {
    const startDate = getStartDate();
    const endDate = getEndDate();
    if (startDate && endDate) {
      dispatch({
        type: 'dashboard/fetchMyTimesheetEffect',
        payload: {
          companyId: getCurrentCompany(),
          employeeId,
          fromDate: moment(startDate).format(dateFormatAPI),
          toDate: moment(endDate).format(dateFormatAPI),
        },
      });
    }
  }, [selectedMonth]);

  // RENDER UI
  const onPreviousMonth = () => {
    setSelectedMonth(moment(selectedMonth).add(-1, 'months'));
  };

  const onNextMonth = () => {
    setSelectedMonth(moment(selectedMonth).add(1, 'months'));
  };

  const renderTimesheetAction = () => {
    return (
      <div className={styles.header__actions}>
        <img src={SmallLeftArrow} alt="" onClick={onPreviousMonth} />
        <span>{moment(selectedMonth, dateFormat).locale('en').format(dateFormat)}</span>
        <img src={SmallRightArrow} alt="" onClick={onNextMonth} />
      </div>
    );
  };

  return (
    <div className={styles.Timesheets}>
      <div>
        <div className={styles.header}>
          <span className={styles.header__headerText}>Timesheets</span>
          {renderTimesheetAction()}
        </div>
        <div className={styles.content}>
          <Spin spinning={loadingFetch}>
            <CustomCalendar selectedMonth={selectedMonth} myTimesheet={myTimesheet} />
          </Spin>
        </div>
      </div>
      <div className={styles.fillTimesheetBtn} onClick={onFillTimesheet}>
        <span>Fill timesheet</span>
        <img src={LeftArrow} alt="expand" />
      </div>
    </div>
  );
};

export default connect(
  ({ user: { currentUser = {} } = {}, dashboard: { myTimesheet = [] } = {}, loading }) => ({
    myTimesheet,
    currentUser,
    loadingFetch: loading.effects['dashboard/fetchMyTimesheetEffect'],
  }),
)(Timesheets);
