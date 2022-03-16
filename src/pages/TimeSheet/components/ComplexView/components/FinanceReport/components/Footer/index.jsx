import { Button } from 'antd';
import React from 'react';
import { connect } from 'umi';
import exportToCSV from '@/utils/exportAsExcel';
import DownloadIcon from '@/assets/timeSheet/solidDownload.svg';
import styles from './index.less';

const Footer = (props) => {
  const { selectedProjects = [], data = [] } = props;
  const {
    user: {
      currentUser: {
        location: { headQuarterAddress: { country: { _id: countryID } = {} } = {} } = {},
      } = {},
    } = {},
  } = props;

  const locationUser = countryID === 'US';
  // update type when there are api
  const getSelectedData = () => {
    const newData = data.filter((el) => selectedProjects.includes(el.projectId));
    return newData;
  };

  const processData = (array) => {
    return array.map((item) => {
      const {
        projectName = '',
        engagementType = '',
        resource = [],
        projectSpentInDay = 0,
        projectSpentInHours = 0,
        breakTime = 0,
        overTime = 0,
      } = item;

      let resourceNames = '';
      resource.forEach((val, index) => {
        resourceNames += val.employee.legalName;
        if (index + 1 < resource.length) resourceNames += ', ';
      });
      const dataExport = {
        'Project Name': projectName || '-',
        Type: engagementType || '-',
        Resources: resourceNames || '-',
        'Total Days': `${projectSpentInDay} Days` || '-',
        'Total Hours ': `${projectSpentInHours} Hours` || '-',
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
    exportToCSV(processData(result), 'FinanceReportData.xlsx');
  };
  return (
    <div className={styles.Footer}>
      <div className={styles.left}>{selectedProjects.length} Projects selected</div>
      <div className={styles.right}>
        <Button icon={<img src={DownloadIcon} alt="" />} onClick={downloadTemplate}>
          Download
        </Button>
      </div>
    </div>
  );
};

export default connect(({ user }) => ({ user }))(Footer);
