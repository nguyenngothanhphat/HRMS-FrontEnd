import { Button, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import Information from './components/Information';
import TaskTable from './components/TaskTable';
import WhiteDownloadIcon from '@/assets/timeSheet/whiteDownload.svg';
import styles from './index.less';

const EmployeeDetailModal = (props) => {
  const {
    visible = false,
    title = 'Employee Details',
    onClose = () => {},
    employeeId = '',
    dataSource = [],
  } = props;

  const [data, setData] = useState();

  useEffect(() => {
    const find = dataSource.find((x) => x.id === employeeId);
    setData(find);
  }, [employeeId]);

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
        <Information data={data} />
        <TaskTable list={[]} />
      </div>
    );
  };

  return (
    <>
      <Modal
        className={`${styles.EmployeeDetailModal} ${styles.noPadding}`}
        onCancel={handleCancel}
        destroyOnClose
        width={800}
        footer={
          <>
            <Button type="secondary">Approve timing</Button>
            <Button
              className={styles.btnSubmit}
              type="primary"
              onClick={handleFinish}
              icon={<img src={WhiteDownloadIcon} alt="" />}
            >
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

export default connect(() => ({}))(EmployeeDetailModal);
