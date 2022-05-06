import React, { PureComponent } from 'react';
import EmployeeTicket from './EmployeeTickets';
import ManagerTicket from './ManagerTickets';
import { goToTop } from '@/utils/utils';

class TicketsManagement extends PureComponent {
  findRole = (roles) => {
    const manager = roles.find((item) => item === 'manager');
    const hrManager = roles.find((item) => item === 'hr-manager');
    // const employee = roles.find((item) => item === 'employee');
    const role = hrManager || manager || 'employee';
    return role;
  };

  componentDidMount = () => {
    goToTop();
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
