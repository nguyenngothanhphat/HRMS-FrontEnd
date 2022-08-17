import { Modal } from 'antd';
import React from 'react';
import { connect } from 'umi';
import CustomPrimaryButton from '../CustomPrimaryButton';
import CustomSecondaryButton from '../CustomSecondaryButton';
import styles from './index.less';

const CommonModal = ({
  visible = false,
  title = 'Modal',
  secondTitle = '',
  cancelButtonType = 1,
  onClose = () => {},
  firstText = 'Submit',
  secondText = 'Button',
  cancelText = 'Cancel',
  content = '',
  width = 700,
  loading = false,
  loadingSecond = false,
  hasFooter = true,
  onFinish = () => {},
  hasHeader = true,
  withPadding = false,
  hasCancelButton = true,
  hasSecondButton = false,
  onSecondButtonClick = () => {},
  maskClosable = false,
  disabledButton = false,
  formName = 'myForm',
}) => {
  const renderModalHeader = () => {
    return (
      <div className={secondTitle ? styles.headerSecond : styles.header}>
        <p className={styles.header__text}>
          <span className={styles.text1}>{title}</span>
          {secondTitle && <span className={styles.text2}>{secondTitle}</span>}
        </p>
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
                <CustomSecondaryButton
                  type={cancelButtonType}
                  onClick={handleCancel}
                  paddingInline={0}
                >
                  {cancelText}
                </CustomSecondaryButton>
              )}
              {hasSecondButton && (
                <CustomSecondaryButton
                  onClick={onSecondButtonClick}
                  paddingInline={0}
                  loading={loadingSecond}
                  disabled={disabledButton}
                >
                  {secondText}
                </CustomSecondaryButton>
              )}
              <CustomPrimaryButton
                disabled={disabledButton}
                form={formName}
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
