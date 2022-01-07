import moment from 'moment';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import ComplexView from './components/ComplexView';
import SimpleView from './components/SimpleView';

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
        currentDateProp={moment(currentDateProp, 'MM/DD/YYYY')}
      />
    );
  }
  return (
    <ComplexView
      tabName={tabName}
      showMyTimeSheet={timeSheetRequired}
      currentDateProp={moment(currentDateProp, 'MM/DD/YYYY')}
    />
  );
};
export default connect(({ user: { currentUser = {}, permissions = [] } = {} }) => ({
  currentUser,
  permissions,
}))(TimeSheet);
