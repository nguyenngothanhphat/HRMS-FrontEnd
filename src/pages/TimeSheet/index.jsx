import React, { useEffect, useState } from 'react';
import { history, connect } from 'umi';
import SimpleView from './components/SimpleView';
import ComplexView from './components/ComplexView';

const TimeSheet = (props) => {
  const {
    match: { params: { tabName = '' } = {} },
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
    return <SimpleView tabName={tabName} showMyTimeSheet={timeSheetRequired} />;
  }
  return <ComplexView tabName={tabName} showMyTimeSheet={timeSheetRequired} />;
};
export default connect(({ user: { currentUser = {}, permissions = [] } = {} }) => ({
  currentUser,
  permissions,
}))(TimeSheet);
