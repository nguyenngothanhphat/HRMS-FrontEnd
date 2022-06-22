import { Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import LeftArrow from '@/assets/dashboard/leftArrow.svg';
import CommonModal from '@/components/CommonModal';
import styles from './index.less';
import CommonTab from './components/CommonTab';
import ActivityLogModalContent from './components/ActivityLogModalContent';

const { TabPane } = Tabs;

const mockNotification = [];
const statusTickets = ['New', 'Assigned', 'In Progress', 'Client Pending'];
const statusRequestTimeoff = ['IN-PROGRESS'];
const ActivityLog = (props) => {
  const [activeKey, setActiveKey] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);
  const {
    dispatch,
    listTicket: listPendingApprovals = [],
    listTimeSheetTicket = [],
    permissions = {},
    employee: { _id = '' } = {},
    listMyTicket = [],
    status = '',
    statusApproval = '',
    leaveRequests = [],
    activeConversationUnseen = [],
  } = props;

  const viewPendingApprovalDashboard = permissions.viewPendingApprovalDashboard !== -1;

  // USE EFFECT
  useEffect(() => {
    dispatch({
      type: 'dashboard/fetchListTicket',
    });
    dispatch({
      type: 'dashboard/fetchListTimeSheetTicket',
      payload: {
        employeeId: _id,
      },
    });
  }, [statusApproval]);

  useEffect(() => {
    dispatch({
      type: 'dashboard/fetchListMyTicket',
    });
  }, [status]);

  useEffect(() => {
    dispatch({
      type: 'dashboard/fetchLeaveRequestOfEmployee',
      payload: {
        status: ['IN-PROGRESS'],
      },
    });
  }, []);

  const fetchListTicket = () => {
    dispatch({
      type: 'dashboard/fetchListTicket',
    });
    dispatch({
      type: 'dashboard/fetchListTimeSheetTicket',
      payload: {
        roles: ['MANAGER'],
        employeeId: _id,
      },
    });
  };

  // if employee, no render the pending approval tab, set active key to the second tab
  useEffect(() => {
    if (!viewPendingApprovalDashboard) {
      setActiveKey('2');
    }
  }, [viewPendingApprovalDashboard]);

  const dataMyTicket = () => {
    const listMyTicketNew =
      listMyTicket.length > 0
        ? listMyTicket.filter((val) => {
            return val.employee_raise === _id;
          })
        : [];
    const dataMyTickets = listMyTicketNew.filter((element) =>
      statusTickets.includes(element.status),
    );
    const newListLeaveRequest = leaveRequests.filter((element) =>
      statusRequestTimeoff.includes(element.status),
    );
    const dataToTal = [...dataMyTickets];
    newListLeaveRequest.forEach((element) => {
      dataToTal.push(element);
    });
    return dataToTal;
  };

  // const renderShowAll = () => {
  //   switch (activeKey) {
  //     case '1':
  //       return 'Show all requests';
  //     case '2':
  //       return 'Show all Notifications';
  //     case '3':
  //       return 'Show all My Tickets';
  //     default:
  //       return 'Show all requests';
  //   }
  // };

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
        return dataMyTicket();
      default:
        return '';
    }
  };
  const data = listPendingApprovals.concat(listTimeSheetTicket);
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
              <TabPane
                tab={renderTabName('1', listPendingApprovals.length + listTimeSheetTicket.length)}
                key="1"
              >
                <CommonTab type="1" data={data} refreshData={fetchListTicket} />
              </TabPane>
            )}
            <TabPane
              tab={renderTabName('2', mockNotification.length + activeConversationUnseen.length)}
              key="2"
            >
              {mockNotification.length > 0 ? <CommonTab type="2" data={mockNotification} /> : <></>}
              {activeConversationUnseen.length > 0 ? (
                <CommonTab type="4" data={activeConversationUnseen} />
              ) : (
                <></>
              )}
            </TabPane>
            <TabPane tab={renderTabName('3', dataMyTicket().length)} key="3">
              <CommonTab type="3" data={dataMyTicket()} />
            </TabPane>
          </Tabs>
        </div>
      </div>

      {activeKey === '1' && listPendingApprovals.length > 0 && (
        <div className={styles.viewAllBtn} onClick={() => onViewAllClick(activeKey)}>
          Show all requests
          <img src={LeftArrow} alt="expand" />
        </div>
      )}
      {activeKey === '1' && listPendingApprovals.length === 0 && (
        <div className={styles.addLength} />
      )}
      {activeKey === '2' && mockNotification.length > 0 && (
        <div className={styles.viewAllBtn} onClick={() => onViewAllClick(activeKey)}>
          Show all Notifications
          <img src={LeftArrow} alt="expand" />
        </div>
      )}
      {activeKey === '2' && mockNotification.length === 0 && <div className={styles.addLength} />}
      {activeKey === '3' && dataMyTicket().length > 0 && (
        <div className={styles.viewAllBtn} onClick={() => onViewAllClick(activeKey)}>
          Show all My Tickets
          <img src={LeftArrow} alt="expand" />
        </div>
      )}
      {activeKey === '3' && dataMyTicket().length === 0 && <div className={styles.addLength} />}

      <CommonModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={renderTabName(activeKey)}
        hasFooter={false}
        content={<ActivityLogModalContent tabKey={activeKey} data={getDataOfModal()} />}
      />
    </div>
  );
};

export default connect(
  ({
    dashboard: {
      listTicket = [],
      listMyTicket = {},
      status = '',
      statusApproval = '',
      leaveRequests = [],
      listTimeSheetTicket = [],
    } = {},
    loading,
    conversation: { activeConversationUnseen = [] },
    user: { permissions = {}, currentUser: { employee = {} } } = {},
  }) => ({
    status,
    statusApproval,
    listTicket,
    listMyTicket,
    listTimeSheetTicket,
    leaveRequests,
    permissions,
    employee,
    activeConversationUnseen,
    loadingFetchListTicket: loading.effects['dashboard/fetchListTicket'],
    loadingFetchListMyTicket: loading.effects['dashboard/fetchListMyTicket'],
  }),
)(ActivityLog);
