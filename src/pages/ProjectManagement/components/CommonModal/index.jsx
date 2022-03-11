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
    secondText = 'Cancel',
    content = '',
    width = 700,
    loading = false,
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

  return (
    <>
      <Modal
        className={`${styles.CommonModal} ${styles.noPadding}`}
        onCancel={handleCancel}
        destroyOnClose
        width={width}
        footer={
          <>
            <Button className={styles.btnCancel} onClick={handleCancel}>
              {secondText}
            </Button>
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
              loading={loading}
            >
              {firstText}
            </Button>
          </>
        }
        title={renderModalHeader()}
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
