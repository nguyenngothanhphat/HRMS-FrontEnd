import { BuildOutlined } from '@ant-design/icons';
import { Badge, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import BellIcon from '@/assets/homePage/Bell-icon.svg';
import { CHAT_EVENT } from '@/constants/socket';
import ActivityLogModalContent from '@/pages/Dashboard/components/ActivityLog/components/ActivityLogModalContent';
import { isOwner } from '@/utils/authority';
import { disconnectSocket, socket } from '@/utils/socket';
import CommonModal from '../../../CommonModal';
import styles from '../../index.less';
import AvatarDropdown from './components/AvatarDropdown';
import GlobalSearchNew from './components/GlobalSearchNew';
import QuestionDropdown from './components/QuestionDropdown';
import SelectCompanyModal from './components/SelectCompanyModal';

const RightContent = (props) => {
  const {
    dispatch,
    theme,
    layout,
    currentUser,
    companiesOfUser,
    unseenTotal,
    activeConversationUnseen,
  } = props;

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

  const initialSocket = () => {
    socket.emit(CHAT_EVENT.ADD_USER, currentUser?.employee?._id || '');
    socket.on(CHAT_EVENT.GET_MESSAGE, async (data) => {
      saveNewMessage(data);
      fetchNotificationList();
    });
  };

  const [isSwitchCompanyVisible, setIsSwitchCompanyVisible] = useState(false);
  const [notification, setNotification] = useState(unseenTotal);
  const checkIsOwner =
    isOwner() && currentUser.signInRole.map((role) => role.toLowerCase()).includes('owner');
  const [modalVisible, setModalVisible] = useState(false);

  let className = styles.right;

  if (theme === 'dark') {
    className = `${styles.right} ${styles.dark}`;
  }

  useEffect(() => {
    fetchNotificationList();
    initialSocket();
    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    setNotification(unseenTotal);
  }, [unseenTotal, activeConversationUnseen]);

  return (
    <div className={className}>
      <GlobalSearchNew />
      <QuestionDropdown />
      <Badge
        className={`${styles.action} ${styles.notify}`}
        onClick={() => setModalVisible(true)}
        color="green"
        count={Number(notification)}
      >
        <img src={BellIcon} alt="notification-icon" />
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
