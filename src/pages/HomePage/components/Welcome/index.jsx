import React, { useState } from 'react';
import { connect } from 'umi';
import styles from './index.less';
// import ActivityLogModalContent from '@/pages/Dashboard/components/ActivityLog/components/ActivityLogModalContent';
import CommonTab from '@/pages/Dashboard/components/ActivityLog/components/CommonTab';
import CommonModal from '@/components/CommonModal';
import { singularify } from '@/utils/utils';

const Welcome = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const {
    currentUser: { employee = {} || {} } = {},
    unseenTotal,
    activeConversationUnseen,
  } = props;
  const { generalInfo: { legalName = '' } = {} || {} } = employee;
  return (
    <div className={styles.Welcome}>
      <p className={styles.Welcome__helloText}>Hello {legalName}!</p>
      <span className={styles.Welcome__notificationText}>
        You have{' '}
        <span className={styles.number} onClick={() => setModalVisible(true)}>
          {unseenTotal} {singularify('notification', unseenTotal)}
        </span>{' '}
        today
      </span>
      <CommonModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Notifications"
        hasFooter={false}
        data={activeConversationUnseen}
        // content={<ActivityLogModalContent tabKey="2" data={[]} />}
        content={<CommonTab type="4" data={activeConversationUnseen} isInModal />}
        maskClosable
      />
    </div>
  );
};

export default connect(
  ({
    loading,
    conversation: { unseenTotal, activeConversationUnseen },
    user: { currentUser = {}, permissions = {} } = {},
  }) => ({
    currentUser,
    permissions,
    unseenTotal,
    activeConversationUnseen,
    loading: loading.effects['conversation/getConversationUnSeenEffect'],
  }),
)(Welcome);
