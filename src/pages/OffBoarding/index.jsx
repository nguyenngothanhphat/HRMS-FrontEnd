import React, { PureComponent } from 'react';
import EmployeeOffBoading from './EmployeeOffBoarding';
import ManagerOffBoading from './ManagerOffBoarding';
import HrOffboarding from './HrOffboarding';

class OffBoarding extends PureComponent {
  render() {
    const renderComponent = {
      'hr-manager': <HrOffboarding />,
      manager: <ManagerOffBoading />,
      employee: <EmployeeOffBoading />,
    };
    const listRole = localStorage.getItem('antd-pro-authority');
    const role =
      JSON.parse(listRole).find(
        (item) => item === 'hr-manager' || item === 'manager' || item === 'employee',
      ) || 'employee';
    return renderComponent[role];
  }
}

export default OffBoarding;
