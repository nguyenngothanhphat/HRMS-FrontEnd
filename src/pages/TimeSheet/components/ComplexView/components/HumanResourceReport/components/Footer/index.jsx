import { Button } from 'antd';
import React from 'react';
import { connect } from 'umi';
import moment from 'moment';
import exportToCSV from '@/utils/exportAsExcel';
import DownloadIcon from '@/assets/timeSheet/solidDownload.svg';
import styles from './index.less';
import { dateFormatAPI } from '@/utils/timeSheet';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';

const Footer = (props) => {
  const {
    selectedEmployees = [],
    data = [],
    startDate = '',
    endDate = '',
    dispatch,
    setSelectedEmployees = () => {},
  } = props;

  const {
    user: {
      currentUser: {
        location: { headQuarterAddress: { country: { _id: countryID } = {} } = {} } = {},
      } = {},
    } = {},
    timeSheet: { isIncompleteTimesheet = false, selectedLocations = [] } = {},
    loadingSendMail = false,
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
        incompleteDates = [],
        department: { name = '' } = {},
      } = item;
      let projectName = '';
      project.forEach((el, index) => {
        projectName += el;
        if (index + 1 < project.length) projectName += ', ';
      });
      let incompleteTimeSheetDates = '';
      incompleteDates.forEach((el, index) => {
        const { date = '' } = el;
        incompleteTimeSheetDates += date;
        if (index + 1 < incompleteDates.length) incompleteTimeSheetDates += ', ';
      });
      const dataExport = {
        Employee: legalName,
        Department: name,
        Project: projectName || '-',
        'Working Days': `${userSpentInDay}/${totalWorkingDay} ( ${totalWorkingDayInHours} hours) `,
        'Leave Taken ': `${leaveTaken}/${totalLeave}`,
        'Total Hours': `${userSpentInHours} hours`,
        'Incomplete TimeSheet Dates': incompleteTimeSheetDates,
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

  const remindEmployee = () => {
    const arr = getSelectedData();
    const employeeIds = arr.map((el) => el.employeeId) || [];
    dispatch({
      type: 'timeSheet/sendMailInCompleteTimeSheet',
      payload: {
        selectedLocations,
        isIncompleteTimesheet: true,
        employeeIds,
        fromDate: moment(startDate).format(dateFormatAPI),
        toDate: moment(endDate).format(dateFormatAPI),
      },
    }).then((res) => {
      const { code = '' } = res;
      if (code === 200) {
        setSelectedEmployees([]);
      }
    });
  };

  return (
    <div className={styles.Footer}>
      <div className={styles.left}>{selectedEmployees.length} Employees selected</div>
      <div className={styles.right}>
        {isIncompleteTimesheet ? (
          <div className={styles.downloadIcon} onClick={remindEmployee}>
            <CustomPrimaryButton loading={loadingSendMail}>Remind Employee</CustomPrimaryButton>
          </div>
        ) : (
          <div className={styles.downloadIcon} onClick={downloadTemplate}>
            <Button icon={<img src={DownloadIcon} alt="Icon Download" />}>Download</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(({ user, timeSheet, loading }) => ({
  user,
  timeSheet,
  loadingSendMail: loading.effects['timeSheet/sendMailInCompleteTimeSheet'],
}))(Footer);
