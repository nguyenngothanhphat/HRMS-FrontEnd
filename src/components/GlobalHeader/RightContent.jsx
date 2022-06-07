import { BuildOutlined } from '@ant-design/icons';
import { Tooltip, Badge } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { io } from 'socket.io-client';
import { isOwner } from '@/utils/authority';
import ActivityLogModalContent from '@/pages/Dashboard/components/ActivityLog/components/ActivityLogModalContent';
import CommonModal from '../CommonModal';
import AvatarDropdown from './AvatarDropdown';
import { ChatEvent, SOCKET_URL } from '@/utils/chatSocket';
import GlobalSearchNew from './components/GlobalSearchNew/index';
import SelectCompanyModal from './components/SelectCompanyModal';
import styles from './index.less';
import BellIcon from '@/assets/homePage/Bell-icon.svg';
import QuestionDropdown from './QuestionDropdown';

const GlobalHeaderRight = (props) => {
  const {
    dispatch,
    theme,
    layout,
    currentUser,
    companiesOfUser,
    unseenTotal,
    activeConversationUnseen,
  } = props;

  const socket = React.createRef();
  socket.current = io(SOCKET_URL);

  socket.current.emit(ChatEvent.ADD_USER, currentUser?.employee?._id || '');

  const [isSwitchCompanyVisible, setIsSwitchCompanyVisible] = useState(false);
  const [notification, setNotification] = useState(unseenTotal);
  const checkIsOwner =
    isOwner() && currentUser.signInRole.map((role) => role.toLowerCase()).includes('owner');
  const [modalVisible, setModalVisible] = useState(false);

  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

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

  socket.current.on(ChatEvent.GET_MESSAGE, async (data) => {
    await saveNewMessage(data);
    await fetchNotificationList();
  });

  useEffect(() => {
    fetchNotificationList();
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
)(GlobalHeaderRight);
