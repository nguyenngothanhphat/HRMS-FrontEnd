import React, { PureComponent } from 'react';
import { initViewOffboarding } from '@/utils/authority';
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
    const { location: { state: { defaultActiveKey = '1', isEmployeeMode = '' } = {} } = {} } =
      this.props;
    const viewOffboarding = initViewOffboarding();
    const renderComponent = {
      'hr-manager': <HrOffboarding defaultActiveKey={defaultActiveKey} />,
      manager: <ManagerOffBoading />,
      employee: <EmployeeOffBoading />,
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
