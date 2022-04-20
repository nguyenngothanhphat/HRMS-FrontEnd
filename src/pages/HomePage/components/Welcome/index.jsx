import React, { useState } from 'react';
import { connect } from 'umi';
import styles from './index.less';
import ActivityLogModalContent from '@/pages/Dashboard/components/ActivityLog/components/ActivityLogModalContent';
import CommonModal from '@/components/CommonModal';

const Welcome = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const { currentUser: { employee = {} || {} } = {} } = props;
  const { generalInfo: { legalName = '' } = {} || {} } = employee;

  return (
    <div className={styles.Welcome}>
      <p className={styles.Welcome__helloText}>Hello {legalName}!</p>
      <span className={styles.Welcome__notificationText}>
        You have{' '}
        <span className={styles.number} onClick={() => setModalVisible(true)}>
          0 notifications
        </span>{' '}
        today
      </span>
      <CommonModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Notifications"
        hasFooter={false}
        content={<ActivityLogModalContent tabKey="2" data={[]} />}
      />
    </div>
  );
};

export default connect(({ user: { currentUser = {}, permissions = {} } = {} }) => ({
  currentUser,
  permissions,
}))(Welcome);
