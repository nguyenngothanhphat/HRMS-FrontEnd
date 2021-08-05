import React, { PureComponent } from 'react';
import { initViewOffboarding } from '@/utils/authority';
import EmployeeOffBoading from './EmployeeOffBoarding';
import ManagerOffBoading from './ManagerOffBoarding';
import HrOffboarding from './HrOffboarding';

class OffBoarding extends PureComponent {
  findRole = (roles) => {
    const hrManager = roles.find((item) => item === 'hr-manager');
    const hr = roles.find((item) => item === 'hr');
    const manager = roles.find((item) => item === 'manager');
    const employee = roles.find((item) => item === 'employee');
    const role = hrManager || hr || manager || employee || 'employee';
    return role;
  };

  render() {
    const {
      match: { params: { tabName = '', type = '' } = {} },
      location: { state: { isEmployeeMode = false } = {} } = {},
    } = this.props;

    const viewOffboarding = initViewOffboarding();
    const renderComponent = {
      'hr-manager': <HrOffboarding tabName={tabName} type={type} />,
      hr: <HrOffboarding tabName={tabName} type={type} />,
      manager: <ManagerOffBoading tabName={tabName} />,
      employee: <EmployeeOffBoading tabName={tabName} />,
    };

    const listRole = localStorage.getItem('antd-pro-authority');
    const role = this.findRole(JSON.parse(listRole));

    if (!isEmployeeMode && !viewOffboarding) {
      return renderComponent[role];
    }
    return renderComponent.employee;
  }
}

export default OffBoarding;
