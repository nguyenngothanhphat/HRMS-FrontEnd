import React, { useEffect } from 'react';
import { history, connect } from 'umi';
// import SimpleView from './components/SimpleView';
import ComplexView from './components/ComplexView';

const TimeSheet = (props) => {
  const {
    match: { params: { tabName = '' } = {} },

    dispatch,
    // location: { state: { status = '', tickedId = '', typeName = '', category = '' } = {} } = {},
  } = props;

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

  // return <SimpleView tabName={tabName} />;
  return <ComplexView tabName={tabName} />;
};
export default connect(({ user: { permissions = [] } = {} }) => ({ permissions }))(TimeSheet);
