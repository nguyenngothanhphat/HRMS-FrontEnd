import React, { useState } from 'react';
import { connect } from 'umi';
import styles from './index.less';
import CommonModal from '@/pages/Dashboard/components/ActivityLog/components/CommonModal';

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
        title="Notifications"
        onClose={() => setModalVisible(false)}
        tabKey="2"
        data={[]}
      />
    </div>
  );
};

export default connect(({ user: { currentUser = {}, permissions = {} } = {} }) => ({
  currentUser,
  permissions,
}))(Welcome);
