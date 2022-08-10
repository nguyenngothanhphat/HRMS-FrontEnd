import React, { useEffect } from 'react';
import { getAuthority } from '@/utils/authority';
import { goToTop } from '@/utils/utils';
import EmployeeTicket from './components/EmployeeTickets';
import ManagerTicket from './components/ManagerTickets';

const TicketsManagement = (props) => {
  const {
    match: { params: { tabName = '' } = {} },
  } = props;

  const findRole = (roles) => {
    const manager = roles.find((item) => item === 'manager');
    const hrManager = roles.find((item) => item === 'hr-manager');
    const role = hrManager || manager || 'employee';
    return role;
  };

  const permissions = getAuthority().filter((x) => x.toLowerCase().includes('ticket'));
  const listRole = localStorage.getItem('antd-pro-authority');
  const role = findRole(JSON.parse(listRole));

  useEffect(() => {
    goToTop();
    return () => {};
  }, []);

  const renderComponent = {
    manager: (
      <ManagerTicket role={role.toUpperCase()} permissions={permissions} tabName={tabName} />
    ),
    'hr-manager': (
      <ManagerTicket role={role.toUpperCase()} permissions={permissions} tabName={tabName} />
    ),
    employee: (
      <EmployeeTicket role={role.toUpperCase()} permissions={permissions} tabName={tabName} />
    ),
  };

  return renderComponent[role];
};

export default TicketsManagement;
