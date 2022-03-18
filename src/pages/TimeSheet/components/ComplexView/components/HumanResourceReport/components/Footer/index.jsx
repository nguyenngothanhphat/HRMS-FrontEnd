import { Button } from 'antd';
import React from 'react';
import { connect } from 'umi';
import exportToCSV from '@/utils/exportAsExcel';
import DownloadIcon from '@/assets/timeSheet/solidDownload.svg';
import styles from './index.less';

const Footer = (props) => {
  const { selectedEmployees = [], data = [] } = props;

  const {
    user: {
      currentUser: {
        location: { headQuarterAddress: { country: { _id: countryID } = {} } = {} } = {},
      } = {},
    } = {},
  } = props;

  const locationUser = countryID === 'US';

  const getSelectedData = () => {
    const newData = data.filter((el) => selectedEmployees.includes(el.id));
    return newData;
  };

  const processData = (array) => {
    return array.map((item) => {
      const {
        legalName = '',
        leaveTaken = '',
        project = [],
        userSpentInDay = 0,
        userSpentInHours = 0,
        totalLeave = '',
        totalWorkingDay = '',
        totalWorkingDayInHours = '',
        breakTime = 0,
        overTime = 0,
        department: { name = '' } = {},
      } = item;
      let projectName = '';
      project.forEach((el, index) => {
        projectName += el;
        if (index + 1 < project.length) projectName += ', ';
      });
      const dataExport = {
        Employee: legalName,
        Department: name,
        Project: projectName || '-',
        'Working Days': `${userSpentInDay}/${totalWorkingDay} ( ${totalWorkingDayInHours} hours) `,
        'Leave Taken ': `${leaveTaken}/${totalLeave}`,
        'Total Hours': `${userSpentInHours} hours`,
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
    exportToCSV(processData(result), 'HumanResourceReportData.xlsx');
  };

  return (
    <div className={styles.Footer}>
      <div className={styles.left}>{selectedEmployees.length} Employees selected</div>
      <div className={styles.right}>
        <Button icon={<img src={DownloadIcon} alt="" />} onClick={downloadTemplate}>
          Download
        </Button>
      </div>
    </div>
  );
};

export default connect(({ user }) => ({ user }))(Footer);
