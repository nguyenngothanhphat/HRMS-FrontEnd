import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';

import styles from './index.less';

const CustomModal = (props) => {
  const [visible, setVisible] = useState(false); // Modal visibility

  const { open, closeModal, children } = props;

  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [open]);

  const handleCancel = () => {
    setVisible(false);
    closeModal();
  };

  return (
    <>
      <Modal
        className={styles.onboardModal}
        title={null}
        visible={visible}
        centered
        onCancel={handleCancel}
        footer={null}
      >
        <div className={styles.body}>{children}</div>
      </Modal>
    </>
  );
};

export default CustomModal;
