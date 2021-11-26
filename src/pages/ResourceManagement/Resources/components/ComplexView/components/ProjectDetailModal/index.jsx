import { Button, Modal } from 'antd';
import React from 'react';
import { connect } from 'umi';
import Information from './components/Information';
import TaskTable from './components/TaskTable';
import styles from './index.less';

const ProjectDetailModal = (props) => {
  const { visible = false, title = 'Project details', onClose = () => {} } = props;

  const handleCancel = () => {
    onClose();
  };
  // RENDER UI
  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <span className={styles.header__text}>{title}</span>
      </div>
    );
  };

  const handleFinish = async () => {
    //
  };

  const renderModalContent = () => {
    return (
      <div className={styles.content}>
        <Information />
        <TaskTable list={[]} />
      </div>
    );
  };

  return (
    <>
      <Modal
        className={`${styles.ProjectDetailModal} ${styles.noPadding}`}
        onCancel={handleCancel}
        destroyOnClose
        width={750}
        footer={
          <>
            <Button className={styles.btnSubmit} type="primary" onClick={handleFinish}>
              Download
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

export default connect(() => ({}))(ProjectDetailModal);
