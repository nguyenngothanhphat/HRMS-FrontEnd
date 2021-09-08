import { Button, Modal } from 'antd';
import React from 'react';
import styles from './index.less';
import pendingIcon from '../assets/pendingIcon.png';

const ModalWaitAccept = (props) => {
  const { openModal, onCancel, fullName } = props;
  return (
    <Modal
      className={styles.modalCustom}
      visible={openModal}
      onCancel={onCancel}
      style={{ top: 50 }}
      destroyOnClose
      maskClosable={false}
      width={450}
      // title="Salary Reference"
      footer={false}
    >
      <div className={styles.pending}>
        <div className={styles.pendingIcon}>
          <img src={pendingIcon} alt="icon" />
        </div>
        <p>
          We are waiting for Mr / Mrs. {fullName} to mark the acceptance of the shared salary
          structure
        </p>
        <Button type="primary" onClick={onCancel}>
          OK
        </Button>
      </div>
    </Modal>
  );
};
export default ModalWaitAccept;
