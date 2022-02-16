import { Button, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import Information from './components/Information';
import TaskTable from './components/TaskTable';
import styles from './index.less';

const ProjectDetailModal = (props) => {
  const {
    visible = false,
    title = 'Project Details',
    onClose = () => {},
    projectId = '',
    dataSource = [],
  } = props;

  const [data, setData] = useState({});

  useEffect(() => {
    const find = dataSource.find((x) => x.projectId === projectId);
    setData(find);
  }, [projectId]);

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
  // update type when there are api
  const handleFinish = async () => {
    const { dispatch } = props;

    const getListExport = await dispatch({
      type: 'timeSheet/',
    });
    const downloadLink = document.createElement('a');
    const universalBOM = '\uFEFF';
    downloadLink.href = `data:text/csv; charset=utf-8,${encodeURIComponent(
      universalBOM + getListExport,
    )}`;
    downloadLink.download = 'timesheet.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const renderModalContent = () => {
    return (
      <div className={styles.content}>
        <Information data={data} />
        <TaskTable list={data?.projectDetail} />
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
