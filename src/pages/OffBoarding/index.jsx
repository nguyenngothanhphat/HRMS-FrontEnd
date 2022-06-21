import React, { useEffect } from 'react';
import WorkInProgress from '@/components/WorkInProgress';
import { initViewOffboarding } from '@/utils/authority';
import { goToTop } from '@/utils/utils';
import EmployeeView from './components/EmployeeView';
import ManagerView from './components/ManagerView';
import styles from './index.less';

const Offboarding = (props) => {
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

  return (
    <div className={styles.Offboarding}>
      {!isEmployeeMode && !initViewOffboarding() ? renderComponent[role] : renderComponent.employee}
    </div>
  );
};

export default Offboarding;
