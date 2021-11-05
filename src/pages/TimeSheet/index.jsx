import React, { useEffect, useState } from 'react';
import { history, connect } from 'umi';
import SimpleView from './components/SimpleView';
import ComplexView from './components/ComplexView';

const TimeSheet = (props) => {
  const {
    match: { params: { tabName = '' } = {} },
    dispatch,
    currentUser: { employee = {} || {} } = {},
    // location: { state: { status = '', tickedId = '', typeName = '', category = '' } = {} } = {},
  } = props;
  const [mode, setMode] = useState(2); // 1: simple view, 2: complex view

  useEffect(() => {
    if (!tabName) {
      history.replace(`/time-sheet/my`);
    }
  }, [tabName]);

  const findRole = (roles) => {
    const isHRManager = roles.find((item) => item === 'hr-manager');
    const isManager = roles.find((item) => item === 'manager');
    const isEmployee = roles.find((item) => item === 'employee');

    const { title: { name = '' } = {} || {} } = employee;

    let isProjectManager = '';
    let isPeopleManager = '';
    const nameTemp = name.toLowerCase();
    if (isManager) {
      if (nameTemp.includes('project') && nameTemp.includes('manager')) {
        isProjectManager = 'project-manager';
      }
      if (nameTemp.includes('people') && nameTemp.includes('manager')) {
        isPeopleManager = 'people-manager';
      }
    }
    if (nameTemp.includes('finance')) {
      isPeopleManager = 'finance';
    }

    dispatch({
      type: 'timeSheet/save',
      payload: {
        currentUserRole:
          isHRManager || isProjectManager || isPeopleManager || isManager || isEmployee,
      },
    });
  };

  useEffect(() => {
    const listRole = localStorage.getItem('antd-pro-authority');
    findRole(JSON.parse(listRole));
  }, []);

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
export default connect(({ user: { currentUser = {}, permissions = [] } = {} }) => ({
  currentUser,
  permissions,
}))(TimeSheet);
