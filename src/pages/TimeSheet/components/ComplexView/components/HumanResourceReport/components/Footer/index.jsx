import { Button } from 'antd';
import React from 'react';
import { connect } from 'umi';
import exportToCSV from '@/utils/exportAsExcel';
import DownloadIcon from '@/assets/timeSheet/solidDownload.svg';
import styles from './index.less';

const Footer = (props) => {
  const { selectedEmployees = [], data = [] } = props;

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
      return {
        Employee: legalName,
        Department: name,
        Project: projectName,
        'Working Days': `${userSpentInDay}/${totalWorkingDay} ( ${totalWorkingDayInHours} hours) `,
        'Leave Taken ': `${leaveTaken}/${totalLeave}`,
        'Break Time': breakTime,
        'Over Time': overTime,
        'Total Hours': `${userSpentInHours} hours`,
      };
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

export default connect(() => ({}))(Footer);
