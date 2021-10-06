import React, { PureComponent } from 'react';
import { Tabs, notification } from 'antd';
import { history, connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import EmployeeLandingPage from './components/EmployeeLandingPage';
import ManagerLandingPage from './components/ManagerLandingPage';
import HRManagerLandingPage from './components/HRManagerLandingPage';
// import Balances from './components/Balances';
import SetupTimeoff from './components/SetupTimeoff';

import styles from './index.less';
import { getCurrentCompany, getCurrentTenant } from '../../utils/authority';

const { TabPane } = Tabs;
@connect(({ dispatch, timeOff }) => ({
  timeOff,
  dispatch,
}))
class TimeOff extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      role: '',
      // activeKey: '1',
    };
  }

  viewActivityLog = () => {
    // eslint-disable-next-line no-alert
    alert('View activity logs');
  };

  findRole = (roles) => {
    const { dispatch } = this.props;

    const hrManager = roles.find((item) => item === 'hr-manager');
    const manager = roles.find((item) => item === 'manager');
    const employee = roles.find((item) => item === 'employee');
    const admincla = roles.find((item) => item === 'region-head');

    let role = '';
    role = hrManager || manager || employee || 'employee';
    dispatch({
      type: 'timeOff/save',
      payload: {
        currentUserRole: role,
      },
    });

    if (admincla) {
      dispatch({
        type: 'timeOff/save',
        payload: {
          currentUserRole: 'REGION-HEAD',
        },
      });
    }

    // let activeKey = '1';
    // switch (role) {
    //   case 'employee':
    //     activeKey = '1';
    //     break;
    //   case 'manager':
    //     activeKey = '2';
    //     break;
    //   case 'hr-manager':
    //     activeKey = '3';
    //     break;
    //   default:
    //     break;
    // }
    // this.setState({
    //   activeKey,
    // });
    return role;
  };

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/save',
      payload: {
        currentLeaveTypeTab: '1',
        currentMineOrTeamTab: '1',
        currentFilterTab: '1',
      },
    });
  };

  componentDidMount = async () => {
    const {
      match: { params: { tabName = '' } = {} },
      location: { state: { status = '', tickedId = '', typeName = '', category = '' } = {} } = {},
    } = this.props;

    if (!tabName) {
      history.replace(`/time-off/overview`);
    } else {
      const listRole = localStorage.getItem('antd-pro-authority');
      const role = this.findRole(JSON.parse(listRole));
      this.setState({
        role,
      });
    }

    const { dispatch } = this.props;
    const response = await dispatch({
      type: 'timeOff/getTimeOffTypeByLocation',
    });
    const {
      statusCode,
      data: {
        headQuarterAddress: {
          country: { _id } = {} || {},
        } = {} || {},
      },
    } = response;
    if (statusCode === 200)
      dispatch({
        type: 'timeOff/fetchTimeOffTypesByCountry',
        payload: {
          country: _id,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        },
      });
    dispatch({
      type: 'timeOff/savePaging',
      payload: { page: 1 },
    });
    if (status === 'WITHDRAW') {
      if (category === 'TIMEOFF') {
        notification.success({
          message: 'Timeoff request',
          description: `Timeoff request [Ticket ID: ${tickedId}] [Type: ${typeName}] was withdrawn & deleted.`,
        });
      }
      if (category === 'DRAFTS') {
        notification.success({
          message: 'Timeoff request',
          description: `Draft request [Ticket ID: ${tickedId}] [Type: ${typeName}] was deleted.`,
        });
      }
      if (category === 'COMPOFF') {
        notification.success({
          message: 'Compoff request',
          description: `Compoff request [Ticket ID: ${tickedId}] was withdrawn & deleted.`,
        });
      }
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
    const {
      match: { params: { tabName = '', type = '' } = {} },
    } = this.props;
    return (
      // <Breadcrumb routes={routes}>
      <div className={styles.TimeOff}>
        <PageContainer>
          {/* tabBarExtraContent={this.options()} */}
          {/* <Tabs activeKey={activeKey} onTabClick={this.onTabClick}> */}
          <Tabs
            activeKey={tabName || 'overview'}
            onChange={(key) => {
              history.push(`/time-off/${key}`);
            }}
          >
            <TabPane tab={<span className={styles.employeeTabPane}>Timeoff</span>} key="overview">
              {role === 'employee' && <EmployeeLandingPage />}
              {role === 'manager' && <ManagerLandingPage />}
              {role === 'hr-manager' && <HRManagerLandingPage />}
            </TabPane>

            {role === 'hr-manager' && (
              <TabPane tab="Setup Timeoff policy" key="setup">
                <SetupTimeoff type={type} />
              </TabPane>
            )}
          </Tabs>
        </PageContainer>
      </div>
      // </Breadcrumb>
    );
  }
}
export default TimeOff;
