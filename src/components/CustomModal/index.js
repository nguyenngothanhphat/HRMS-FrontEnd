import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';

import img1 from './images/modal_img_1.png';

import styles from './index.less';

const CustomModal = (props) => {
  const [visible, setVisible] = useState(false); // Modal visibility

  const { open, closeModal } = props;

  const Content = props.children;

  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [open]);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = (e) => {
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
        <div class={styles.body}>{props.children}</div>
      </Modal>
    </>
  );
};

export default CustomModal;
