import React, { useEffect, useState } from 'react';
import { history, connect } from 'umi';
import SimpleView from './components/SimpleView';
import ComplexView from './components/ComplexView';
import ROLES from '@/utils/roles';

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
    const isHRManager = roles.find((item) => item === ROLES.HR_MANAGER);
    const isManager = roles.find((item) => item === ROLES.MANAGER);
    const isEmployee = roles.find((item) => item === ROLES.EMPLOYEE);

    const { title: { name = '' } = {} || {} } = employee;

    let isProjectManager = '';
    let isPeopleManager = '';
    let isFinance = '';
    const nameTemp = name.toLowerCase();
    if (isManager) {
      if (nameTemp.includes('project') && nameTemp.includes('manager')) {
        isProjectManager = ROLES.PROJECT_MANAGER;
      }
      if (nameTemp.includes('people') && nameTemp.includes('manager')) {
        isPeopleManager = ROLES.PEOPLE_MANAGER;
      }
    }
    if (nameTemp.includes('finance')) {
      isFinance = ROLES.FINANCE;
    }

    dispatch({
      type: 'timeSheet/save',
      payload: {
        currentUserRole:
          isHRManager || isProjectManager || isPeopleManager || isFinance || isManager || isEmployee,
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
