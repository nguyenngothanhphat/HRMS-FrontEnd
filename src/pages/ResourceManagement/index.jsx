// class components

import React, { PureComponent } from 'react';
import { initViewOffboarding } from '@/utils/authority';
// import EmployeeTicket from './EmployeeTickets'
import ManagerTicket from './Resources'

class ResourceManagement extends PureComponent {
  findRole = (roles) => {
    const manager = roles.find((item) => item === 'manager');
    // const employee = roles.find((item) => item === 'employee');
    const role = manager || []
    return role
  };

  render() {
    const {
      match: { params: { tabName = '', type = '' } = {} },
      location: { state: { isEmployeeMode = false } = {} } = {},
    } = this.props;
    const renderComponent = {
      manager: <ManagerTicket tabName={tabName} />,
      // employee: <EmployeeTicket tabName={tabName} />,
    };

    const listRole = localStorage.getItem('antd-pro-authority');
    const role = this.findRole(JSON.parse(listRole));

    return renderComponent[role];
  }
}

export default ResourceManagement;
