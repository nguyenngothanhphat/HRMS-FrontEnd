import { Button, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import exportToCSV from '@/utils/exportAsExcel';
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

  const {
    user: {
      currentUser: {
        location: { headQuarterAddress: { country: { _id: countryID } = {} } = {} } = {},
      } = {},
    } = {},
  } = props;

  const locationUser = countryID === 'US';

  const [data, setData] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    const find = dataSource.find((x) => x.id === employeeId);
    setData(find);
  }, [employeeId, JSON.stringify(dataSource)]);

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

  const getSelectedData = () => {
    const newData = data?.userDetail.filter((el) => selectedRowKeys.includes(el.date));
    return newData;
  };

  const processData = (array) => {
    return array.map((item) => {
      const {
        date = '',
        inTime = '',
        leaveTaken = '',
        notes = '',
        outTime = '',
        breakTime = '',
        overTime = '',
      } = item;

      const dataExport = {
        Date: date || '-',
        'In Time': inTime || '-',
        'Out Time': outTime || '-',
        Leaves: leaveTaken || '-',
        Notes: notes || '-',
      };
      if (locationUser) {
        dataExport['Break Time'] = breakTime;
        dataExport['Over Time'] = overTime;
      }
      return dataExport;
    });
  };

  const downloadTemplate = () => {
    const result = getSelectedData();
    exportToCSV(processData(result), 'EmployeeDetailslData.xlsx');
  };

  const renderModalContent = () => {
    return (
      <div className={styles.content}>
        <Information data={data} />
        <TaskTable
          list={data?.userDetail || []}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      </div>
    );
  };

  const disabledBtn = () => {
    if (selectedRowKeys.length < 1 || selectedRowKeys === undefined) {
      return true;
    }
    return false;
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
            <Button
              className={styles.btnSubmit}
              type="primary"
              onClick={downloadTemplate}
              icon={<img src={WhiteDownloadIcon} alt="" />}
              disabled={disabledBtn()}
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

export default connect(({ user }) => ({ user }))(EmployeeDetailModal);
