import { Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import LeftArrow from '@/assets/dashboard/leftArrow.svg';
import CommonModal from './components/CommonModal';
import styles from './index.less';
import CommonTab from './components/CommonTab';

const { TabPane } = Tabs;

const mockNotification = [
  // {
  //   date: '09/23/2021',
  //   id: 1,
  //   name: 'Aditya Venkatasan',
  //   type: 'Asset',
  //   userId: 'adityav',
  // },
  // {
  //   date: '09/23/2021',
  //   id: 2,
  //   name: 'Aditya Venkatasan',
  //   type: 'Asset',
  //   userId: 'adityav',
  // },
  // {
  //   date: '09/23/2021',
  //   id: 3,
  //   name: 'Aditya Venkatasan',
  //   type: 'Asset',
  //   userId: 'adityav',
  // },
  // {
  //   date: '09/23/2021',
  //   id: 4,
  //   name: 'Aditya Venkatasan',
  //   type: 'Asset',
  //   userId: 'adityav',
  // },
  // {
  //   date: '09/23/2021',
  //   id: 5,
  //   name: 'Aditya Venkatasan',
  //   type: 'Asset',
  //   userId: 'adityav',
  // },
];

const mockTicket = [
  {
    date: '09/23/2021',
    id: 1,
    ticketID: '123123',
  },
  {
    date: '09/23/2021',
    id: 2,
    ticketID: '123123',
  },
  {
    date: '09/23/2021',
    id: 3,
    ticketID: '123123',
  },
  {
    date: '09/23/2021',
    id: 4,
    ticketID: '123123',
  },
];

const ActivityLog = (props) => {
  const [activeKey, setActiveKey] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);
  const { dispatch, listTicket: listPendingApprovals = [], permissions = {} } = props;

  const viewPendingApprovalDashboard = permissions.viewPendingApprovalDashboard !== -1;

  // USE EFFECT
  useEffect(() => {
    dispatch({
      type: 'dashboard/fetchListTicket',
    });
  }, []);

  // if employee, no render the pending approval tab, set active key to the second tab
  useEffect(() => {
    if (!viewPendingApprovalDashboard) {
      setActiveKey('2');
    }
  }, [viewPendingApprovalDashboard]);

  const renderShowAll = () => {
    return 'Show all requests';
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
        return mockTicket;
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
            <TabPane tab={renderTabName('3', mockTicket.length)} key="3">
              <CommonTab type="3" data={mockTicket} />
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
  ({ dashboard: { listTicket = [] } = {}, loading, user: { permissions = {} } = {} }) => ({
    listTicket,
    permissions,
    loadingFetchListTicket: loading.effects['dashboard/fetchListTicket'],
  }),
)(ActivityLog);
