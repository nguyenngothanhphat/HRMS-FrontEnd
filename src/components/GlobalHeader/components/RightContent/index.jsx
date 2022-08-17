import { BellOutlined, BuildOutlined } from '@ant-design/icons';
import { Badge, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { CHAT_EVENT } from '@/constants/socket';
import ActivityLogModalContent from '@/pages/Dashboard/components/ActivityLog/components/ActivityLogModalContent';
import { isOwner } from '@/utils/authority';
import { disconnectSocket, socket } from '@/utils/socket';
import CommonModal from '../../../CommonModal';
import styles from '../../index.less';
import AvatarDropdown from './components/AvatarDropdown';
import GlobalSearchNew from './components/GlobalSearch';
import MenuDropdown from './components/MenuDropdown';
import SelectCompanyModal from './components/SelectCompanyModal';

const RightContent = (props) => {
  const { dispatch, theme, currentUser, companiesOfUser, unseenTotal, activeConversationUnseen } =
    props;

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
  }, []);

  const saveNewMessage = async (message) => {
    await dispatch({
      type: 'conversation/saveNewMessage',
      payload: message,
    });
  };

  const fetchNotificationList = async () => {
    await dispatch({
      type: 'conversation/getConversationUnSeenEffect',
      payload: {
        userId: currentUser?.employee?._id,
      },
    });
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [isSwitchCompanyVisible, setIsSwitchCompanyVisible] = useState(false);
  const [notification, setNotification] = useState(unseenTotal);

  const checkIsOwner =
    isOwner() && currentUser.signInRole.map((role) => role.toLowerCase()).includes('owner');

  const handleMessage = (message) => {
    console.log('🚀  ~ message', message);
    saveNewMessage(message);
    fetchNotificationList();
  };

  useEffect(() => {
    fetchNotificationList();
    socket.on(CHAT_EVENT.GET_MESSAGE_HR, handleMessage);
    return () => {
      socket.off(CHAT_EVENT.GET_MESSAGE_HR);
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    setNotification(unseenTotal);
  }, [unseenTotal, activeConversationUnseen]);

  return (
    <div className={theme === 'dark' ? `${styles.right} ${styles.dark}` : styles.right}>
      <GlobalSearchNew />
      <MenuDropdown />
      <Badge
        className={`${styles.action} ${styles.notify}`}
        onClick={() => setModalVisible(true)}
        color="green"
        count={Number(notification)}
      >
        <BellOutlined />
      </Badge>
      {!(!checkIsOwner && companiesOfUser.length === 1) && (
        <>
          <Tooltip title="Switch company">
            <div
              className={`${styles.action} ${styles.notify}`}
              onClick={() => setIsSwitchCompanyVisible(true)}
            >
              <BuildOutlined />
            </div>
          </Tooltip>
        </>
      )}

      <AvatarDropdown />
      <SelectCompanyModal visible={isSwitchCompanyVisible} onClose={setIsSwitchCompanyVisible} />
      <CommonModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Notifications"
        hasFooter={false}
        content={
          <ActivityLogModalContent
            tabKey="4"
            data={activeConversationUnseen}
            setModalVisible={() => setModalVisible(false)}
          />
        }
      />
    </div>
  );
};

export default connect(
  ({
    settings,
    user: { companiesOfUser = [], currentUser = {} },
    employeesManagement,
    loading,
    conversation: { activeConversationUnseen = [], unseenTotal = 0 },
  }) => ({
    theme: settings.navTheme,
    layout: settings.layout,
    employeesManagement,
    currentUser,
    companiesOfUser,
    activeConversationUnseen,
    unseenTotal,
    loadingList: loading.effects['employeesManagement/fetchSearchEmployeesList'],
  }),
)(RightContent);
