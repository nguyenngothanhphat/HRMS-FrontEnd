import React, { PureComponent } from 'react';
import { connect } from 'umi';
import TicketEmployee from '../EmployeeOffBoarding/Request';
import TicketManager from '../ManagerOffBoarding/component/DetailTicket';
import TicketHr from '../HrOffboarding/component/HrRequestTable/Ticket';

@connect()
class OffBoarding extends PureComponent {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'offboarding/save',
      payload: {
        myRequest: {},
      },
    });
  }

  findRole = (roles) => {
    const hrManager = roles.find((item) => item === 'hr-manager');
    const manager = roles.find((item) => item === 'manager');
    const employee = roles.find((item) => item === 'employee');
    const role = hrManager || manager || employee;
    return role;
  };

  render() {
    const renderComponent = {
      'hr-manager': <TicketHr {...this.props} />,
      manager: <TicketManager {...this.props} />,
      employee: <TicketEmployee {...this.props} />,
    };
    const listRole = localStorage.getItem('antd-pro-authority');
    const role = this.findRole(JSON.parse(listRole));
    return renderComponent[role];
  }
}

export default OffBoarding;
