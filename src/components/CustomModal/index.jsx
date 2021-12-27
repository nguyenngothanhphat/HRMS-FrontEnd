import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import styles from './index.less';

const CustomModal = (props) => {
  const [visible, setVisible] = useState(false); // Modal visibility

  const { open, closeModal, width = 520, content, docmail = 0, type = 1 } = props;

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

  const getModalClassName = () => {
    if (type === 2) {
      return `${styles.CustomModal2} ${styles.CustomModal}`;
    }
    if (docmail === 0) return styles.CustomModal;
    return `${styles.CustomModal} ${styles.SendMailForm}`;
  };

  return (
    <>
      <Modal
        className={getModalClassName()}
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
