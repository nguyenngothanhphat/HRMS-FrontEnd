import { Button } from 'antd';
import React from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { isEmpty } from 'lodash';
import exportToCSV from '@/utils/exportAsExcel';
import DownloadIcon from '@/assets/timeSheet/solidDownload.svg';
import styles from './index.less';
import { convertMsToTime, VIEW_TYPE } from '@/utils/timeSheet';

const Footer = (props) => {
  const { selectedProjects = [], data = [], selectedView = '' } = props;
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

  const processDataMonthly = (array) => {
    return array.map((item) => {
      const { weeks = [], projectName = '' } = item;
      const week1 = weeks.find((val) => val.week === 1);
      const week2 = weeks.find((val) => val.week === 2);
      const week3 = weeks.find((val) => val.week === 3);
      const week4 = weeks.find((val) => val.week === 4);
      const week5 = weeks.find((val) => val.week === 5);
      const week6 = weeks.find((val) => val.week === 6);

      const dataExport = {
        'All Project': projectName || '-',
        [`Week 1 (${moment(week1?.startDate).locale('en').format('MMM DD')} - ${moment(
          week1?.endDate,
        )
          .locale('en')
          .format('MMM DD')})`]:
          week1?.weekProjectTime === 0 ? '-' : convertMsToTime(week1?.weekProjectTime) || '-',
        [`Week 2 (${moment(week2?.startDate).locale('en').format('MMM DD')} - ${moment(
          week2?.endDate,
        )
          .locale('en')
          .format('MMM DD')})`]:
          week2?.weekProjectTime === 0 ? '-' : convertMsToTime(week2?.weekProjectTime) || '-',
        [`Week 3 (${moment(week3?.startDate).locale('en').format('MMM DD')} - ${moment(
          week3?.endDate,
        )
          .locale('en')
          .format('MMM DD')})`]:
          week3?.weekProjectTime === 0 ? '-' : convertMsToTime(week3?.weekProjectTime) || '-',
        [`Week 4 (${moment(week4?.startDate).locale('en').format('MMM DD')} - ${moment(
          week4?.endDate,
        )
          .locale('en')
          .format('MMM DD')})`]:
          week4?.weekProjectTime === 0 ? '-' : convertMsToTime(week4?.weekProjectTime) || '-',
        [`Week 5 (${moment(week5?.startDate).locale('en').format('MMM DD')} - ${moment(
          week5?.endDate,
        )
          .locale('en')
          .format('MMM DD')})`]:
          week5?.weekProjectTime === 0 ? '-' : convertMsToTime(week5?.weekProjectTime) || '-',
      };
      if (!isEmpty(week6)) {
        dataExport[
          `Week 6 (${moment(week6?.startDate).locale('en').format('MMM DD')} - ${moment(
            week6?.endDate,
          )
            .locale('en')
            .format('MMM DD')})`
        ] = week6?.weekProjectTime === 0 ? '-' : convertMsToTime(week6?.weekProjectTime) || '-';
      }

      return dataExport;
    });
  };

  const downloadTemplate = () => {
    const result = getSelectedData();
    if (selectedView === VIEW_TYPE.W) {
      exportToCSV(processData(result), 'FinanceReportDataWeekly.xlsx');
    } else {
      exportToCSV(processDataMonthly(result), 'FinanceReportDataMonthly.xlsx');
    }
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
