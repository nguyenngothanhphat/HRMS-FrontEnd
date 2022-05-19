import { Button, Modal } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const CommonModal = (props) => {
  const {
    visible = false,
    title = 'Modal',
    onClose = () => {},
    firstText = 'Submit',
    secondText = 'Button',
    cancelText = 'Cancel',
    content = '',
    width = 700,
    loading = false,
    hasFooter = true,
    onFinish = () => {},
    hasHeader = true,
    withPadding = false,
    hasCancelButton = true,
    hasSecondButton = false,
    onSecondButtonClick = () => {},
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

  const renderModalContent = () => {
    return content;
  };

  const getClassName = () => {
    if (withPadding) {
      return `${styles.CommonModal} ${styles.withPadding}`;
    }
    return `${styles.CommonModal} ${styles.noPadding}`;
  };

  const handleFinish = () => {
    onFinish();
  };

  return (
    <>
      <Modal
        className={getClassName()}
        onCancel={handleCancel}
        destroyOnClose
        width={width}
        footer={
          hasFooter ? (
            <>
              {hasCancelButton && (
                <Button className={styles.btnCancel} onClick={handleCancel}>
                  {cancelText}
                </Button>
              )}
              {hasSecondButton && (
                <Button className={styles.btnCancel} onClick={onSecondButtonClick}>
                  {secondText}
                </Button>
              )}
              <Button
                className={styles.btnSubmit}
                type="primary"
                form="myForm"
                key="submit"
                htmlType="submit"
                loading={loading}
                onClick={handleFinish}
              >
                {firstText}
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

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
}))(CommonModal);
