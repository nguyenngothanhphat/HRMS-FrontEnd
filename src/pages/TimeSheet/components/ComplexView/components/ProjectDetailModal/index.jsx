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
  const {
    user: {
      currentUser: {
        location: { headQuarterAddress: { country: { _id: countryID } = {} } = {} } = {},
      } = {},
    } = {},
  } = props;

  const locationUser = countryID === 'US';

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
    const result = [];
    array.forEach((item) => {
      const { task = '', description = '', department = '', projectMembers = [] } = item;
      projectMembers.forEach((pro) => {
        const dataExport = {
          Department: department || '-',
          Task: task || '-',
          Description: description || '-',
          'Resources ': pro.legalName || '-',
          'Time taken': pro.userSpentTimeInHours || '-',
          'Total time (task)': pro.totaltime || '-',
        };
        if (locationUser) {
          dataExport['Break Time'] = pro.breakTime;
          dataExport['Over Time'] = pro.overTime;
        }
        result.push(dataExport);
      });
    });
    return result;
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

export default connect(({ user }) => ({ user }))(ProjectDetailModal);
