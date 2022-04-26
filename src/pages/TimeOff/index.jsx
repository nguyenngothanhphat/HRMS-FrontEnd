import { notification, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { connect, history } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import Overview from './components/Overview';
import SetupTimeoff from './components/SetupTimeoff';
import styles from './index.less';

const { TabPane } = Tabs;
const TimeOff = (props) => {
  const {
    dispatch,
    match: { params: { tabName = '', type = '' } = {} },
    location: { state: { status = '', tickedId = '', typeName = '', category = '' } = {} } = {},
    permissions = {},
    currentUser: {
      employee = {},
      employee: { title: { eligibleForCompOff = false } = {} } = {},
    } = {},
  } = props;

  const fetchTimeOffTypes = () => {
    if (employee?._id) {
      dispatch({
        type: 'timeOff/fetchTimeOffTypeByEmployeeEffect',
        payload: {
          employee: employee._id,
        },
      });
    }
    dispatch({
      type: 'timeOff/savePaging',
      payload: { page: 1 },
    });
  };

  useEffect(() => {
    if (!tabName) {
      history.replace(`/time-off/overview`);
      return '';
    }

    fetchTimeOffTypes();

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

    return () => {
      dispatch({
        type: 'timeOff/save',
        payload: {
          currentLeaveTypeTab: '1',
          currentScopeTab: '1',
          currentFilterTab: '1',
        },
      });
    };
  }, []);

  const getTabs = () => {
    const viewSettingTimeoff = permissions.viewSettingTimeoff !== -1;
    const viewHRTimeoff = permissions.viewHRTimeoff !== -1;
    const viewManagerTimeoff = permissions.viewManagerTimeoff !== -1;

    return (
      <>
        <TabPane tab={<span className={styles.employeeTabPane}>Timeoff</span>} key="overview">
          <Overview
            eligibleForCompOff={eligibleForCompOff}
            viewHRTimeoff={viewHRTimeoff}
            viewManagerTimeoff={viewManagerTimeoff}
          />
        </TabPane>

        {viewSettingTimeoff && (
          <TabPane tab="Setup Timeoff policy" key="setup">
            <SetupTimeoff type={type} />
          </TabPane>
        )}
      </>
    );
  };

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
          {getTabs()}
        </Tabs>
      </PageContainer>
    </div>
  );
};
export default connect(
  ({
    user: { currentUserRoles, currentUser, permissions } = {},
    timeOff,
    location: { companyLocationList = [] },
  }) => ({
    timeOff,
    permissions,
    currentUser,
    currentUserRoles,
    companyLocationList,
  }),
)(TimeOff);
