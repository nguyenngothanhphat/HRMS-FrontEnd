import { Button, Modal } from 'antd';
import React from 'react';
import styles from './index.less';

const CommonModal = (props) => {
  const {
    visible = false,
    hasFooter = true,
    title = '',
    onClose = () => {},
    onFinish = () => {},
    hasHeader = true,
    content,
    noFormCss = false,
  } = props;

  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  const handleCancel = () => {
    onClose();
  };

  const handleFinish = () => {
    onFinish();
  };

  const renderModalContent = () => {
    return content;
  };

  const getClassName = () => {
    if (!noFormCss) return `${styles.CommonModal} ${styles.withPadding} ${styles.CommonModalForm}`;
    return `${styles.CommonModal} ${styles.withPadding}`;
  };

  return (
    <>
      <Modal
        className={getClassName()}
        onCancel={handleCancel}
        destroyOnClose
        footer={
          hasFooter ? (
            <>
              <Button onClick={handleCancel} className={styles.btnCancel}>
                Cancel
              </Button>
              <Button
                className={styles.btnSubmit}
                type="primary"
                form="myForm"
                key="submit"
                htmlType="submit"
                onClick={handleFinish}
              >
                Okay
              </Button>
            </>
          ) : null
        }
        title={hasHeader ? renderModalHeader() : null}
        centered
        visible={visible}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default CommonModal;
