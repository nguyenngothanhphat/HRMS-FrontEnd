import React, { PureComponent } from 'react';
import TicketEmployee from '../EmployeeOffBoarding/Request';
import TicketManager from '../ManagerOffBoarding/component/DetailTicket';
import TicketHr from '../HrOffboarding/component/HrRequestTable/Ticket';

class OffBoarding extends PureComponent {
  render() {
    const renderComponent = {
      'hr-manager': <TicketHr {...this.props} />,
      manager: <TicketManager {...this.props} />,
      employee: <TicketEmployee {...this.props} />,
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
