import React, { PureComponent } from 'react';
import { Tabs, notification } from 'antd';
import { history, connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import EmployeeLandingPage from './components/EmployeeLandingPage';
import ManagerLandingPage from './components/ManagerLandingPage';
import HRManagerLandingPage from './components/HRManagerLandingPage';
// import Balances from './components/Balances';
import SetupTimeoff from './components/SetupTimeoff';
import { getCurrentCompany, getCurrentTenant, getCurrentLocation } from '@/utils/authority';
import styles from './index.less';
import ROLES from '@/utils/roles';

const { HR_MANAGER, EMPLOYEE, REGION_HEAD, MANAGER } = ROLES;

const { TabPane } = Tabs;
@connect(
  ({
    user: { currentUserRoles, currentUser, permissions } = {},
    timeOff,
    locationSelection: { listLocationsByCompany = [] },
  }) => ({
    timeOff,
    permissions,
    currentUser,
    currentUserRoles,
    listLocationsByCompany,
  }),
)
class TimeOff extends PureComponent {
  viewActivityLog = () => {
    // eslint-disable-next-line no-alert
    alert('View activity logs');
  };

  findRole = (roles) => {
    const { dispatch } = this.props;

    const hrManager = roles.find((item) => item === HR_MANAGER);
    const manager = roles.find((item) => item === MANAGER);
    const employee = roles.find((item) => item === EMPLOYEE);
    const regionHead = roles.find((item) => item === REGION_HEAD);

    let role = '';
    role = hrManager || manager || employee || 'employee';

    dispatch({
      type: 'timeOff/save',
      payload: {
        currentUserRole: role,
      },
    });

    // OLD FLOW, WILL REMOVE "currentUserRole" OUT OF HERE SOON
    if (regionHead) {
      dispatch({
        type: 'timeOff/save',
        payload: {
          currentUserRole: REGION_HEAD,
        },
      });
    }
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
      currentUserRoles = [],
      listLocationsByCompany = [],
    } = this.props;

    if (!tabName) {
      history.replace(`/time-off/overview`);
    } else {
      this.findRole(currentUserRoles);

      if (listLocationsByCompany.length > 0) {
        this.fetchTimeOffTypes();
      }
    }
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

  componentDidUpdate = (prevProps) => {
    const {
      match: { params: { tabName = '' } = {} },
      listLocationsByCompany = [],
    } = this.props;

    if (
      tabName &&
      JSON.stringify(prevProps.listLocationsByCompany) !== JSON.stringify(listLocationsByCompany)
    ) {
      this.fetchTimeOffTypes();
    }
  };

  fetchTimeOffTypes = () => {
    const { listLocationsByCompany = [], dispatch } = this.props;

    const find = listLocationsByCompany.find((x) => x._id === getCurrentLocation());
    if (find) {
      const { headQuarterAddress: { country: { _id } = {} || {} } = {} || {} } = find;
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
    }
  };

  options = () => {
    return (
      <div className={styles.viewActivityLog} onClick={this.viewActivityLog}>
        <span className={styles.title}>View Activity logs (15)</span>
      </div>
    );
  };

  getOverviewByRole = () => {
    const {
      currentUser: { employee: { title: { eligibleForCompOff = false } = {} } = {} } = {},
      permissions = {},
    } = this.props;

    const viewManagerTimeoff = permissions.viewManagerTimeoff === 1;
    const viewHRTimeoff = permissions.viewHRTimeoff === 1;

    if (viewHRTimeoff) return <HRManagerLandingPage eligibleForCompOff={eligibleForCompOff} />;
    if (viewManagerTimeoff) return <ManagerLandingPage eligibleForCompOff={eligibleForCompOff} />;
    return <EmployeeLandingPage eligibleForCompOff={eligibleForCompOff} />;
  };

  getTabs = () => {
    const {
      match: { params: { type = '' } = {} },
      permissions = {},
    } = this.props;

    const viewSettingTimeoff = permissions.viewSettingTimeoff === 1;

    return (
      <>
        <TabPane tab={<span className={styles.employeeTabPane}>Timeoff</span>} key="overview">
          {this.getOverviewByRole()}
        </TabPane>

        {viewSettingTimeoff && (
          <TabPane tab="Setup Timeoff policy" key="setup">
            <SetupTimeoff type={type} />
          </TabPane>
        )}
      </>
    );
  };

  render() {
    const {
      match: { params: { tabName = '' } = {} },
    } = this.props;

    if (!tabName) return '';
    return (
      <div className={styles.TimeOff}>
        <PageContainer>
          <Tabs
            activeKey={tabName || 'overview'}
            onChange={(key) => {
              history.push(`/time-off/${key}`);
            }}
          >
            {this.getTabs()}
          </Tabs>
        </PageContainer>
      </div>
    );
  }
}
export default TimeOff;
