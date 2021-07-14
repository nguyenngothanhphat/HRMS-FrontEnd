import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import styles from './index.less';

const CustomModal = (props) => {
  const [visible, setVisible] = useState(false); // Modal visibility

  const { open, closeModal, width = 520, content, docmail = 0 } = props;

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
        className={docmail === 1 ? styles.root : styles.root1}
        title={null}
        visible={visible}
        width={width}
        centered
        onCancel={handleCancel}
        destroyOnClose
        footer={null}
      >
        <div className={styles.body}>{visible && content}</div>
      </Modal>
    </>
  );
};

export default CustomModal;
