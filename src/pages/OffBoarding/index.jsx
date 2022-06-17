import React, { useEffect } from 'react';
import { initViewOffboarding } from '@/utils/authority';
import EmployeeView from './components/EmployeeView';
import HRView from './components/HRView';
import ManagerView from './components/ManagerView';
import { goToTop } from '@/utils/utils';
import WorkInProgress from '@/components/WorkInProgress';

const OffBoarding = (props) => {
  const {
    match: { params: { tabName = '', type = '' } = {} },
    location: { state: { isEmployeeMode = false } = {} } = {},
  } = props;

  const findRole = (roles) => {
    const hrManager = roles.find((item) => item === 'hr-manager');
    const hr = roles.find((item) => item === 'hr');
    const manager = roles.find((item) => item === 'manager');
    const employee = roles.find((item) => item === 'employee');
    const role = hrManager || hr || manager || employee || 'employee';
    return role;
  };

  const renderComponent = {
    'hr-manager': <WorkInProgress />,
    // hr: <HRView tabName={tabName} type={type} />,
    hr: <WorkInProgress />,
    manager: <ManagerView tabName={tabName} />,
    employee: <EmployeeView tabName={tabName} />,
  };

  const listRole = localStorage.getItem('antd-pro-authority');
  const role = findRole(JSON.parse(listRole));

  useEffect(() => {
    goToTop();
  }, []);

  return !isEmployeeMode && !initViewOffboarding()
    ? renderComponent[role]
    : renderComponent.employee;
};

export default OffBoarding;
