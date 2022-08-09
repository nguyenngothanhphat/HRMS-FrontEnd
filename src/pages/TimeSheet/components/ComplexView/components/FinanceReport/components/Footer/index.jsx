import { isEmpty } from 'lodash';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import DownloadIcon from '@/assets/timeSheet/solidDownload.svg';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import { VIEW_TYPE } from '@/constants/timeSheet';
import { exportArrayDataToCsv } from '@/utils/exportToCsv';
import { convertMsToTime } from '@/utils/timeSheet';
import styles from './index.less';

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

  const processData = (array = []) => {
    let capsPopulations = [];
    capsPopulations = array.map((item) => {
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
      const payload = {
        'Project Name': projectName || '-',
        Type: engagementType || '-',
        Resources: resourceNames || '-',
        'Total Days': `${projectSpentInDay} Days` || '-',
        'Total Hours ': `${projectSpentInHours} Hours` || '-',
      };
      if (locationUser) {
        payload['Break Time'] = breakTime;
        payload['Over Time'] = overTime;
      }
      return payload;
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

  const processDataMonthly = (array = []) => {
    // Uppercase first letter
    let capsPopulations = [];
    capsPopulations = array.map((item) => {
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
    const result = getSelectedData();
    if (selectedView === VIEW_TYPE.W) {
      exportArrayDataToCsv('FinanceReportDataWeekly', processData(result));
    } else {
      exportArrayDataToCsv('FinanceReportDataMonthly', processDataMonthly(result));
    }
  };

  return (
    <div className={styles.Footer}>
      <div className={styles.left}>{selectedProjects.length} Projects selected</div>
      <div className={styles.right}>
        <CustomPrimaryButton icon={<img src={DownloadIcon} alt="" />} onClick={downloadTemplate}>
          Download
        </CustomPrimaryButton>
      </div>
    </div>
  );
};

export default connect(({ user }) => ({ user }))(Footer);
