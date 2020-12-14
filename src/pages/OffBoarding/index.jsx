import React, { PureComponent } from 'react';
import EmployeeOffBoading from './EmployeeOffBoarding';
import ManagerOffBoading from './ManagerOffBoarding';
import HrOffboarding from './HrOffboarding';

class OffBoarding extends PureComponent {
  findRole = (roles) => {
    const hrManager = roles.find((item) => item === 'hr-manager');
    const manager = roles.find((item) => item === 'manager');
    const employee = roles.find((item) => item === 'employee');
    const role = hrManager || manager || employee || 'employee';
    return role;
  };

  render() {
    const renderComponent = {
      'hr-manager': <HrOffboarding />,
      manager: <ManagerOffBoading />,
      employee: <EmployeeOffBoading />,
    };
    const listRole = localStorage.getItem('antd-pro-authority');
    const role = this.findRole(JSON.parse(listRole));
    return renderComponent[role];
  }
}

export default OffBoarding;
