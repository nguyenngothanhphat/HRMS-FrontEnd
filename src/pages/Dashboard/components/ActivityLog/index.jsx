import { Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import LeftArrow from '@/assets/dashboard/leftArrow.svg';
import CommonModal from './components/CommonModal';
import styles from './index.less';
import CommonTab from './components/CommonTab';

const { TabPane } = Tabs;

const mockNotification = [];

const ActivityLog = (props) => {
  const [activeKey, setActiveKey] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);
  const {
    dispatch,
    listTicket: listPendingApprovals = [],
    permissions = {},
    employee: { _id = '' } = {},
    listMyTicket = [],
    status = '',
  } = props;

  const viewPendingApprovalDashboard = permissions.viewPendingApprovalDashboard !== -1;

  // USE EFFECT
  useEffect(() => {
    dispatch({
      type: 'dashboard/fetchListTicket',
    });
  }, []);
  useEffect(() => {
    dispatch({
      type: 'dashboard/fetchListMyTicket',
    });
  }, [status]);

  // if employee, no render the pending approval tab, set active key to the second tab
  useEffect(() => {
    if (!viewPendingApprovalDashboard) {
      setActiveKey('2');
    }
  }, [viewPendingApprovalDashboard]);

  const listMyTicketNew =
    listMyTicket.length > 0
      ? listMyTicket.filter((val) => {
          return val.employee_raise === _id;
        })
      : [];
  const renderShowAll = () => {
    switch (activeKey) {
      case '1':
        return 'Show all requests';
      case '2':
        return 'Show all Notifications';
      case '3':
        return 'Show all My Tickets';
      default:
        return 'Show all requests';
    }
  };

  const onViewAllClick = () => {
    switch (activeKey) {
      case '1':
        history.push('/dashboard/approvals');
        break;
      default:
        setModalVisible(true);
        break;
    }
  };
  const renderTabName = (key, number = 0) => {
    const addZeroToNumber = () => {
      if (number < 10 && number >= 0) return `0${number}`.slice(-2);
      return number;
    };

    let result = '';
    switch (key) {
      case '1':
        result = `Pending Approvals`;
        break;
      case '2':
        result = `Notifications`;
        break;
      case '3':
        result = `My Tickets`;
        break;
      default:
        break;
    }
    if (number > 0) {
      result += ` (${addZeroToNumber()})`;
    }
    return result;
  };

  const getDataOfModal = () => {
    switch (activeKey) {
      case '1':
        return listPendingApprovals;
      case '2':
        return mockNotification;
      case '3':
        return listMyTicketNew;
      default:
        return '';
    }
  };

  // MAIN
  return (
    <div className={styles.ActivityLog}>
      <div>
        <div className={styles.header}>
          <span className={styles.header__headerText}>Activity Log</span>
        </div>
        <div className={styles.content}>
          <Tabs activeKey={activeKey} onTabClick={(key) => setActiveKey(key)}>
            {/* only manager / hr manager see this tab */}
            {viewPendingApprovalDashboard && (
              <TabPane tab={renderTabName('1', listPendingApprovals.length)} key="1">
                <CommonTab type="1" data={listPendingApprovals} />
              </TabPane>
            )}
            <TabPane tab={renderTabName('2', mockNotification.length)} key="2">
              <CommonTab type="2" data={mockNotification} />
            </TabPane>
            <TabPane tab={renderTabName('3', listMyTicketNew.length)} key="3">
              <CommonTab type="3" data={listMyTicketNew} />
            </TabPane>
          </Tabs>
        </div>
      </div>
      <div className={styles.viewAllBtn} onClick={() => onViewAllClick(activeKey)}>
        {renderShowAll()}
        <img src={LeftArrow} alt="expand" />
      </div>
      <CommonModal
        visible={modalVisible}
        title={renderTabName(activeKey)}
        onClose={() => setModalVisible(false)}
        tabKey={activeKey}
        data={getDataOfModal()}
      />
    </div>
  );
};

export default connect(
  ({
    dashboard: { listTicket = [], listMyTicket = {}, status = '' } = {},
    loading,
    user: { permissions = {}, currentUser: { employee = {} } } = {},
  }) => ({
    status,
    listTicket,
    listMyTicket,
    permissions,
    employee,
    loadingFetchListTicket: loading.effects['dashboard/fetchListTicket'],
    loadingFetchListMyTicket: loading.effects['dashboard/fetchListMyTicket'],
  }),
)(ActivityLog);
