import moment from 'moment';
import React from 'react';
import { Button } from 'antd';
import { connect } from 'umi';
import exportToCSV from '@/utils/exportAsExcel';
import FilterIcon from '@/assets/timeSheet/filter.svg';
import DownloadIcon from '@/assets/timeSheet/download.svg';
import CustomRangePicker from '@/pages/TimeSheet/components/ComplexView/components/CustomRangePicker';
import SearchBar from '@/pages/TimeSheet/components/ComplexView/components/SearchBar';
import { VIEW_TYPE } from '@/utils/timeSheet';
import styles from './index.less';

const Header = (props) => {
  const {
    startDate,
    endDate,
    setStartDate = () => {},
    setEndDate = () => {},
    viewChangeComponent = '',
    type = '',
    onChangeSearch = () => {},
    data = [],
  } = props;

  // HEADER AREA FOR MONTH
  const onPrevClick = () => {
    if (type === VIEW_TYPE.M) {
      const startOfMonth = moment(startDate).add(-1, 'months').startOf('month');
      const endOfMonth = moment(startDate).add(-1, 'months').endOf('month');
      setStartDate(startOfMonth);
      setEndDate(endOfMonth);
    }
    if (type === VIEW_TYPE.W) {
      const lastSunday = moment(startDate).add(-1, 'weeks');
      const currentSunday = moment(startDate).add(-1, 'weeks').weekday(7);
      setStartDate(lastSunday);
      setEndDate(currentSunday);
    }
  };

  const onNextClick = () => {
    if (type === VIEW_TYPE.M) {
      const startOfMonth = moment(startDate).add(1, 'months').startOf('month');
      const endOfMonth = moment(startDate).add(1, 'months').endOf('month');
      setStartDate(startOfMonth);
      setEndDate(endOfMonth);
    }
    if (type === VIEW_TYPE.W) {
      const nextSunday = moment(startDate).add(1, 'weeks');
      const currentSunday = moment(startDate).add(1, 'weeks').weekday(7);
      setStartDate(nextSunday);
      setEndDate(currentSunday);
    }
  };

  const onDatePickerChange = (dates = []) => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
  };

  const processData = (array) => {
    return array.map((item) => {
      const {
        legalName = '',
        leaveTaken = '',
        project = [],
        userSpentInDay = 0,
        userSpentInHours = 0,
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
        'Working Days':
          type === VIEW_TYPE.W
            ? `${userSpentInDay}/5 ( 40 hours)`
            : `${userSpentInDay}/5 ( 160 hours)`,
        'Leave Taken ': `${leaveTaken}/3`,
        'Total Hours': `${userSpentInHours} hours`,
      };
    });
  };

  const downloadTemplate = () => {
    exportToCSV(processData(data), 'HumanResourceReportData.xlsx');
  };

  // MAIN AREA
  return (
    <div className={styles.Header}>
      <div className={styles.Header__left}>
        <CustomRangePicker
          startDate={startDate}
          endDate={endDate}
          onPrevClick={onPrevClick}
          onNextClick={onNextClick}
          onChange={onDatePickerChange}
        />
      </div>
      <div className={styles.Header__middle}>{viewChangeComponent()}</div>
      <div className={styles.Header__right}>
        <div className={styles.downloadIcon} onClick={downloadTemplate}>
          <img src={DownloadIcon} alt="Icon Download" />
          <Button>Download</Button>
        </div>
        <div className={styles.filterIcon}>
          <img src={FilterIcon} alt="" />
          <span>Filter</span>
        </div>
        <SearchBar onChangeSearch={onChangeSearch} />
      </div>
    </div>
  );
};

export default connect(() => ({}))(Header);
