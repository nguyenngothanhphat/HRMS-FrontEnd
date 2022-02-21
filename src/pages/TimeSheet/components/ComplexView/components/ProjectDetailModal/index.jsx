import { Button, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import exportToCSV from '@/utils/exportAsExcel';
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

  const processData = (array) => {
    return array.map((item) => {
      const { task = '', description = '', department = '', projectMembers = [] } = item;
      let resources = '';
      let timeTaken = 0;
      let totaltime = 0;

      projectMembers.forEach((el, index) => {
        const { totalTime = 0 } = el;
        resources += el.legalName;
        timeTaken += el.userSpentTimeInHours;
        totaltime += totalTime;
        if (index + 1 < projectMembers.length) {
          resources += ', ';
          timeTaken += ', ';
          totaltime += ', ';
        }
      });

      return {
        Department: department,
        Task: task,
        Description: description,
        'Resources ': resources,
        'Time taken': timeTaken,
        'Total time (task)': totaltime,
      };
    });
  };

  const downloadTemplate = () => {
    exportToCSV(processData(data?.projectDetail), 'ProjectDetailData.xlsx');
  };

  const renderModalContent = () => {
    return (
      <div className={styles.content}>
        <Information data={data} />
        <TaskTable list={data?.projectDetail} />
      </div>
    );
  };

  const disabledBtn = () => {
    if (!data?.projectDetail) return true;
    if (Array.isArray(data?.projectDetail)) {
      if (data?.projectDetail.length === 0) {
        return true;
      }
    }

    return false;
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
            <Button
              disabled={disabledBtn()}
              className={styles.btnSubmit}
              type="primary"
              onClick={downloadTemplate}
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

export default connect(() => ({}))(ProjectDetailModal);
