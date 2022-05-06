import moment from 'moment';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { TIMESHEET_DATE_FORMAT } from '@/utils/dashboard';
import SimpleView from './components/SimpleView';
import ComplexView from './components/ComplexView';
import { goToTop } from '@/utils/utils';

const TimeSheet = (props) => {
  const {
    match: { params: { tabName = '' } = {} },
    location: { state: { currentDateProp = '' } = {} } = {},
    dispatch,
    currentUser: {
      employee: { title: { timeSheetRequired = true, timeSheetAdvancedMode = false } = {} } = {} ||
        {},
    } = {},
  } = props;

  // clear state when unmounting
  useEffect(() => {
    goToTop()
    return () => {
      dispatch({
        type: 'timeSheet/clearState',
      });
    };
  }, []);

  if (!timeSheetAdvancedMode) {
    return (
      <SimpleView
        tabName={tabName}
        showMyTimeSheet={timeSheetRequired}
        currentDateProp={moment(currentDateProp, TIMESHEET_DATE_FORMAT)}
      />
    );
  }
  return (
    <ComplexView
      tabName={tabName}
      showMyTimeSheet={timeSheetRequired}
      currentDateProp={moment(currentDateProp, TIMESHEET_DATE_FORMAT)}
    />
  );
};
export default connect(({ user: { currentUser = {}, permissions = [] } = {} }) => ({
  currentUser,
  permissions,
}))(TimeSheet);
