/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import TicketManager from '../ManagerView/components/TicketDetails';
import TicketHR from '../HRView/components/TicketDetails';

@connect()
class OffBoarding extends PureComponent {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'offboarding/save',
      payload: {
        myRequest: {},
        listProjectByEmployee: [],
      },
    });
  }

  findRole = (roles) => {
    const hrManager = roles.find((item) => item === 'hr-manager');
    const manager = roles.find((item) => item === 'manager');
    const employee = roles.find((item) => item === 'employee');
    const owner = roles.find((item) => item === 'owner');
    const role = hrManager || manager || owner || employee || 'employee';
    return role;
  };

  render() {
    const renderComponent = {
      'hr-manager': <TicketHR {...this.props} />,
      owner: <TicketHR {...this.props} />,
      manager: <TicketManager {...this.props} />,
      // employee: <TicketEmployee {...this.props} />,
    };
    const listRole = localStorage.getItem('antd-pro-authority');
    const role = this.findRole(JSON.parse(listRole));
    return renderComponent[role];
  }
}

export default OffBoarding;
