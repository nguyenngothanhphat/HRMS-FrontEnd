import { notification, Tabs } from 'antd';
import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import { PageContainer } from '@/layouts/layout/src';
import EmployeeLandingPage from './components/EmployeeLandingPage';
import ManagerLandingPage from './components/ManagerLandingPage';
import SetupTimeoff from './components/SetupTimeoff';
import styles from './index.less';

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

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/save',
      payload: {
        currentLeaveTypeTab: '1',
        currentScopeTab: '1',
        currentFilterTab: '1',
      },
    });
  };

  componentDidMount = async () => {
    const {
      match: { params: { tabName = '' } = {} },
      location: { state: { status = '', tickedId = '', typeName = '', category = '' } = {} } = {},
      listLocationsByCompany = [],
    } = this.props;

    if (!tabName) {
      history.replace(`/time-off/overview`);
    } else if (listLocationsByCompany.length > 0) {
      this.fetchTimeOffTypes();
    }
    if (status === 'WITHDRAW') {
      if (category === 'TIMEOFF') {
        notification.success({
          message: 'Timeoff request',
          description: `Timeoff request [Ticket ID: ${tickedId}] [Type: ${typeName}] was withdrawn.`,
          duration: 6,
        });
      }
      if (category === 'DRAFTS') {
        notification.success({
          message: 'Timeoff request',
          description: `Draft request [Ticket ID: ${tickedId}] [Type: ${typeName}] was deleted.`,
          duration: 6,
        });
      }
      if (category === 'APPROVED') {
        notification.success({
          message: 'Timeoff request',
          description: `Withdrawal request [Ticket ID: ${tickedId}] [Type: ${typeName}] was sent.`,
          duration: 6,
        });
      }
      if (category === 'COMPOFF') {
        notification.success({
          message: 'Compoff request',
          description: `Compoff request [Ticket ID: ${tickedId}] was withdrawn & deleted.`,
          duration: 6,
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

  getTabs = () => {
    const {
      match: { params: { type = '' } = {} },
      permissions = {},
      currentUser: { employee: { title: { eligibleForCompOff = false } = {} } = {} } = {},
    } = this.props;

    const viewSettingTimeoff = permissions.viewSettingTimeoff !== -1;
    const viewHRTimeoff = permissions.viewHRTimeoff !== -1;
    const viewManagerTimeoff = permissions.viewManagerTimeoff !== -1;

    return (
      <>
        <TabPane tab={<span className={styles.employeeTabPane}>Timeoff</span>} key="overview">
          {viewManagerTimeoff || viewHRTimeoff ? (
            <ManagerLandingPage eligibleForCompOff={eligibleForCompOff} />
          ) : (
            <EmployeeLandingPage eligibleForCompOff={eligibleForCompOff} />
          )}
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
            destroyInactiveTabPane
          >
            {this.getTabs()}
          </Tabs>
        </PageContainer>
      </div>
    );
  }
}
export default TimeOff;
