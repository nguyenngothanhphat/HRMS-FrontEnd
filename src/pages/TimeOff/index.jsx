import React, { PureComponent } from 'react';
import { Tabs, notification } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import { history } from 'umi';
import EmployeeRole from './components/EmployeeRole';
import ManagerRole from './components/ManagerRole';
import Balances from './components/Balances';
import SetupTimeoff from './components/SetupTimeoff';

import styles from './index.less';

const { TabPane } = Tabs;
export default class TimeOff extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      role: '',
    };
  }

  viewActivityLog = () => {
    // eslint-disable-next-line no-alert
    alert('View activity logs');
  };

  findRole = (roles) => {
    const hrManager = roles.find((item) => item === 'hr-manager');
    const manager = roles.find((item) => item === 'manager');
    const employee = roles.find((item) => item === 'employee');
    const role = hrManager || manager || employee || 'employee';
    console.log('result role', role);
    return role;
  };

  componentDidMount = () => {
    const listRole = localStorage.getItem('antd-pro-authority');
    console.log('listRole', JSON.parse(listRole));
    const role = this.findRole(JSON.parse(listRole));
    this.setState({
      role,
    });

    const {
      location: { state: { status = '', tickedId = '', typeName = '' } = {} } = {},
    } = this.props;
    if (status === 'WITHDRAW') {
      notification.success({
        message: 'Time off request',
        description: `Time off request [Ticket id: ${tickedId}] [Type: ${typeName}] was withdrawn & deleted.`,
      });
      history.replace();
    }
  };

  options = () => {
    return (
      <div className={styles.viewActivityLog} onClick={this.viewActivityLog}>
        <span className={styles.title}>View Activity logs (15)</span>
      </div>
    );
  };

  render() {
    const { role } = this.state;
    return (
      <div className={styles.TimeOff}>
        <PageContainer>
          <Tabs defaultActiveKey="1" tabBarExtraContent={this.options()}>
            {(role === 'employee' || role === 'hr-manager') && (
              <TabPane tab="Timeoff" key="1">
                <EmployeeRole />
              </TabPane>
            )}
            {role === 'manager' && (
              <TabPane tab="Timeoff" key="2">
                <ManagerRole />
              </TabPane>
            )}
            {
              // <TabPane tab="Balances" key="3">
              //   <Balances />
              // </TabPane>
            }
            {role === 'hr-manager' && (
              <TabPane tab="Setup Timeoff policy" key="4">
                <SetupTimeoff />
              </TabPane>
            )}
          </Tabs>
        </PageContainer>
      </div>
    );
  }
}
