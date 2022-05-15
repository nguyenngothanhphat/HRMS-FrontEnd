import React, { PureComponent } from 'react';
import EmployeeTicket from './EmployeeTickets';
import ManagerTicket from './ManagerTickets';
import { goToTop } from '@/utils/utils';
import { getAuthority } from '@/utils/authority';

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
    const permissions = getAuthority().filter((x) => x.toLowerCase().includes('ticket'));

    const renderComponent = {
      manager: <ManagerTicket permissions={permissions} tabName={tabName} />,
      'hr-manager': <ManagerTicket permissions={permissions} tabName={tabName} />,
      employee: <EmployeeTicket permissions={permissions} tabName={tabName} />,
    };

    const listRole = localStorage.getItem('antd-pro-authority');
    const role = this.findRole(JSON.parse(listRole));

    return renderComponent[role];
  }
}

export default TicketsManagement;
