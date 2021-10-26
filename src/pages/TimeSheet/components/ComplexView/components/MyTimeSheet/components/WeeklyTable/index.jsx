import { Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { projectColor } from '@/utils/timeSheet';
import styles from './index.less';

const WeeklyTable = (props) => {
  const { startDate = '', endDate = '', loadingFetchMyTimesheet = false, data = [] } = props;
  const [dateList, setDateList] = useState([]);
  const [formattedData, setFormattedData] = useState([]);

  // FUNCTIONS
  // get dates between two dates
  const enumerateDaysBetweenDates = (startDate1, endDate1) => {
    const now = startDate1.clone();
    const dates = [];

    while (now.isSameOrBefore(endDate1)) {
      dates.push(now.format('MM/DD/YYYY'));
      now.add(1, 'days');
    }
    return dates;
  };

  // format data
  const formatData = () => {
    let projectList = [];
    // get project lists
    data.forEach((item) => {
      item.timesheet.forEach((x) => projectList.push(x.projectName));
    });
    projectList = [...new Set(projectList)];

    // get timesheet by date
    const result = projectList.map((project) => {
      const resultTemp = dateList.map((date) => {
        const find = data.find(
          (item) =>
            moment(item.date).format('MM/DD/YYYY') === date &&
            item.timesheet.some((e) => e.projectName === project),
        );
        return {
          ...find,
          date,
          timesheet: find?.timesheet || [],
        };
      });
      return {
        project,
        listByDate: resultTemp,
      };
    });

    const dates = {};
    for (let i = 0; i < dateList.length; i += 1) dates[dateList[i]] = dateList[i];
    const header = {
      project: 'All Projects',
      totalHours: 'Total Hours',
      ...dates,
    };
    setFormattedData([header].concat(result));
  };

  const getColorByIndex = (index) => {
    return projectColor[index % projectColor.length];
  };

  // USE EFFECT
  useEffect(() => {
    const dateListTemp = enumerateDaysBetweenDates(moment(startDate), moment(endDate));
    setDateList(dateListTemp);
  }, [startDate, endDate]);

  useEffect(() => {
    formatData();
  }, [JSON.stringify(data)]);

  useEffect(() => {
    formatData();
  }, [dateList]);

  // RENDER UI
  const columns = () => {
    const dateColumns = dateList.map((date) => {
      return {
        title: date,
        dataIndex: date,
        key: date,
        align: 'center',
        width: `${100 / 9}%`,
        render: (value, _, index) => {
          if (index === 0) {
            return (
              <div className={styles.timeStamp}>
                <div className={styles.left}>
                  {moment(date, 'MM/DD/YYYY').locale('en').format('DD')}
                </div>
                <div className={styles.right}>
                  <span className={styles.date}>
                    {moment(date, 'MM/DD/YYYY').locale('en').format('dddd')}
                  </span>
                  <span className={styles.month}>
                    {moment(date, 'MM/DD/YYYY').locale('en').format('MMMM')}
                  </span>
                </div>
              </div>
            );
          }
          return 'Hello';
        },
      };
    });

    const result = [
      {
        title: 'All Projects',
        dataIndex: 'project',
        key: 'project',
        align: 'center',
        width: `${100 / 9}%`,
        render: (project, _, index) => {
          if (index === 0) {
            return project;
          }
          return (
            <div className={styles.projectName}>
              <div className={styles.icon} style={{ backgroundColor: getColorByIndex(index) }}>
                <span>{project ? project.toString()?.charAt(0) : 'P'}</span>
              </div>
              <span className={styles.name}>{project}</span>
            </div>
          );
        },
      },
      ...dateColumns,
      {
        title: 'Total Hours',
        dataIndex: 'totalHours',
        key: 'totalHours',
        align: 'center',
        width: `${100 / 9}%`,
        render: (value, _, index) => {
          if (index === 0) {
            return value;
          }
          return 'Total';
        },
      },
    ];
    return result;
  };

  // MAIN AREA
  return (
    <div className={styles.WeeklyTable}>
      <div className={styles.tableContainer}>
        <Table columns={columns()} dataSource={formattedData} bordered pagination={false} />
      </div>
    </div>
  );
};

export default connect(({ loading, timeSheet: { myTimesheet = [] } = {} }) => ({
  myTimesheet,
  loadingFetchMyTimesheet: loading.effects['timeSheet/fetchMyTimesheetEffect'],
}))(WeeklyTable);
