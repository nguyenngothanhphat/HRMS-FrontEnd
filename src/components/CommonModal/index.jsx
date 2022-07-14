import { Modal } from 'antd';
import React from 'react';
import { connect } from 'umi';
import CustomPrimaryButton from '../CustomPrimaryButton';
import CustomSecondaryButton from '../CustomSecondaryButton';
import styles from './index.less';

const CommonModal = ({
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
  maskClosable = false,
}) => {
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

  return (
    <>
      <Modal
        className={getClassName()}
        onCancel={handleCancel}
        destroyOnClose
        width={width}
        footer={
          hasFooter ? (
            <div className={styles.footer}>
              {hasCancelButton && (
                <CustomSecondaryButton onClick={handleCancel}>{cancelText}</CustomSecondaryButton>
              )}
              {hasSecondButton && (
                <CustomSecondaryButton onClick={onSecondButtonClick}>
                  {secondText}
                </CustomSecondaryButton>
              )}
              <CustomPrimaryButton
                form="myForm"
                key="submit"
                htmlType="submit"
                loading={loading}
                onClick={onFinish}
              >
                {firstText}
              </CustomPrimaryButton>
            </div>
          ) : null
        }
        title={hasHeader ? renderModalHeader() : null}
        centered
        visible={visible}
        maskClosable={maskClosable}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
}))(CommonModal);
