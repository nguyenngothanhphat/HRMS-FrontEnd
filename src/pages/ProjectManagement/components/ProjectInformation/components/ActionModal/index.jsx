import { Button, Modal } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const ActionModal = (props) => {
  const {
    visible = false,
    children,
    buttonText = 'Submit',
    onClose = () => {},
    width = 500,
  } = props;

  // RENDER UI
  const handleCancel = () => {
    onClose();
  };

  const renderModalContent = () => {
    return <div className={styles.content}>{children}</div>;
  };

  return (
    <>
      <Modal
        className={`${styles.ActionModal} ${styles.noPadding}`}
        onCancel={handleCancel}
        destroyOnClose
        width={width}
        footer={
          <Button className={styles.btnSubmit} type="primary" onClick={onClose}>
            {buttonText}
          </Button>
        }
        title={null}
        centered
        visible={visible}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default connect(() => ({}))(ActionModal);
