import React, { PureComponent } from 'react';
import EmployeeTicket from './EmployeeTickets';
import ManagerTicket from './ManagerTickets';

class TicketsManagement extends PureComponent {
  findRole = (roles) => {
    const hrEmployee = roles.find((item) => item === 'hr-employee');
    const hrManager = roles.find((item) => item === 'hr-manager');
    const itEmployee = roles.find((item) => item === 'it-employee');
    const itManager = roles.find((item) => item === 'it-manager');
    const operationEmployee = roles.find((item) => item === 'it-employee');
    const operationtManager = roles.find((item) => item === 'it-manager');

    const role =
      hrManager || hrEmployee || itEmployee || itManager || operationEmployee || operationtManager;
    return role;
  };

  render() {
    const {
      match: { params: { tabName = '' } = {} },
    } = this.props;

    const renderComponent = {
      manager: <ManagerTicket tabName={tabName} />,
      'hr-manager': <ManagerTicket tabName={tabName} />,
      employee: <EmployeeTicket tabName={tabName} />,
    };

    const listRole = localStorage.getItem('antd-pro-authority');
    const role = this.findRole(JSON.parse(listRole));

    return renderComponent[role];
  }
}

export default TicketsManagement;
