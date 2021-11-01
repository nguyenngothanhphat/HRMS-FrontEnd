import React, { useEffect, useState } from 'react';
import { history, connect } from 'umi';
import SimpleView from './components/SimpleView';
import ComplexView from './components/ComplexView';

const TimeSheet = (props) => {
  const {
    match: { params: { tabName = '' } = {} },
    dispatch,
    // location: { state: { status = '', tickedId = '', typeName = '', category = '' } = {} } = {},
  } = props;
  const [mode, setMode] = useState(2); // 1: simple view, 2: complex view

  useEffect(() => {
    if (!tabName) {
      history.replace(`/time-sheet/my`);
    }
  }, [tabName]);

  // clear state when unmounting
  useEffect(() => {
    return () => {
      dispatch({
        type: 'timeSheet/clearState',
      });
    };
  }, []);

  if (mode === 1) {
    return <SimpleView tabName={tabName} />;
  }
  return <ComplexView tabName={tabName} />;
};
export default connect(({ user: { permissions = [] } = {} }) => ({ permissions }))(TimeSheet);
