import { Modal } from 'antd';
import React from 'react';
import WelcomeImage from '@/assets/candidatePortal/welcome.svg';
import CustomPrimaryButton from '../CustomPrimaryButton';
import styles from './index.less';

const NotificationModal = ({
  onClose = () => {},
  visible = false,
  title = '',
  description = '',
  buttonText = 'Okay',
  image = '',
  secondDescription = '',
}) => {
  const renderModalContent = () => {
    return (
      <div className={styles.welcomeContent}>
        <img src={image || WelcomeImage} alt="" />
        <span className={styles.welcomeText}>{title}</span>
        {secondDescription && (
          <div className={styles.secondDescriptionText}>{secondDescription}</div>
        )}
        <span className={styles.describeText}>{description}</span>
        <CustomPrimaryButton onClick={onClose}>{buttonText}</CustomPrimaryButton>
      </div>
    );
  };

  return (
    <Modal
      className={styles.NotificationModal}
      onCancel={onClose}
      destroyOnClose
      footer={null}
      centered
      visible={visible}
      maskClosable={false}
    >
      {renderModalContent()}
    </Modal>
  );
};

export default NotificationModal;
