import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { exportArrayDataToCsv } from '@/utils/exportToCsv';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
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

  const processData = (array = []) => {
    const capsPopulations = [];
    array.forEach((item) => {
      const { department = '', projectMembers = [] } = item;
      projectMembers.forEach((pro) => {
        const dataExport = {
          Department: department || '-',
          'Resources ': pro.legalName || '-',
          'Time taken': pro.userSpentTimeInHours || '-',
        };
        if (locationUser) {
          dataExport['Break Time'] = pro.breakTime;
          dataExport['Over Time'] = pro.overTime;
        }
        capsPopulations.push(dataExport);
      });
    });

    // Get keys, header csv
    const keys = Object.keys(capsPopulations[0]);
    const dataExport = [];
    dataExport.push(keys);

    // Add the rows
    capsPopulations.forEach((obj) => {
      const value = `${keys.map((k) => obj[k]).join('__')}`.split('__');
      dataExport.push(value);
    });

    return dataExport;
  };

  const downloadTemplate = () => {
    exportArrayDataToCsv('ProjectDetailData', processData(data?.projectDetail || []));
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
            <CustomPrimaryButton disabled={disabledBtn()} onClick={downloadTemplate}>
              Download
            </CustomPrimaryButton>
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
