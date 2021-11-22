import React, { PureComponent } from 'react';
import EmployyeTicket from './EmployeeTickets';
import ManagerTicket from './ManagerTickets';

class TicketsManagement extends PureComponent {
  findRole = (roles) => {
    const manager = roles.find((item) => item === 'manager');
    const hrManager = roles.find((item) => item === 'hr-manager');
    const employee = roles.find((item) => item === 'employee');
    const role = hrManager || manager || employee;
    return role;
  };

  render() {
    const {
      match: { params: { tabName = '' } = {} },
    } = this.props;

    const renderComponent = {
      manager: <ManagerTicket tabName={tabName} />,
      'hr-manager': <ManagerTicket tabName={tabName} />,
      employee: <EmployyeTicket tabName={tabName} />,
    };

    const listRole = localStorage.getItem('antd-pro-authority');
    const role = this.findRole(JSON.parse(listRole));

    return renderComponent[role];
  }
}

export default TicketsManagement;
