import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import styles from './index.less';

const CustomModal = (props) => {
  const [visible, setVisible] = useState(false); // Modal visibility

  const { open, closeModal, width = 520, content } = props;

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
        // className={`${styles.onboardModal} ${styles.testFixed}`}
        className={styles.root}
        title={null}
        visible={visible}
        width={width}
        centered
        onCancel={handleCancel}
        footer={null}
      >
        <div className={styles.body}>{visible && content}</div>
      </Modal>
    </>
  );
};

export default CustomModal;
