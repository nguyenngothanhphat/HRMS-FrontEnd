import { Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { projectColor } from '@/utils/timeSheet';
import CompleteIcon from '@/assets/timeSheet/complete.svg';
import FailIcon from '@/assets/timeSheet/fail.svg';
import PendingIcon from '@/assets/timeSheet/pending.svg';
import TaskPopover from './components/TaskPopover';
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
  const getIcon = (key) => {
    switch (key) {
      case 'pending':
        return PendingIcon;
      case 'completed':
        return CompleteIcon;
      case 'rejected':
        return FailIcon;

      default:
        return PendingIcon;
    }
  };

  const getBackgroundColor = (key) => {
    switch (key) {
      case 'pending':
        return '#FFFBF5';
      case 'completed':
        return '#F4FFFD';
      case 'rejected':
        return '#FFF4F4';

      default:
        return '#fff';
    }
  };

  const getTitleColor = (key) => {
    switch (key) {
      case 'pending':
        return '#FFA100;';
      case 'completed':
        return '#00C598';
      case 'rejected':
        return '#F44E21';

      default:
        return '#000';
    }
  };

  const renderEventColumn = (type = 'completed') => {
    return (
      <div className={styles.eventColumn} style={{ backgroundColor: getBackgroundColor(type) }}>
        <img src={getIcon(type)} alt="" />
        <span className={styles.title} style={{ color: getTitleColor(type) }}>
          Leave Applied
        </span>
        <span className={styles.description}>Waiting for approval</span>
      </div>
    );
  };

  const renderDateHeaderItem = (date) => {
    return (
      <div className={styles.timeStamp}>
        <div className={styles.left}>{moment(date, 'MM/DD/YYYY').locale('en').format('DD')}</div>
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
  };

  const renderHoliday = (date) => {
    return <div className={styles.holidayColumn}>{renderDateHeaderItem(date)}</div>;
  };

  const columns = () => {
    const dateColumns = dateList.map((date) => {
      return {
        title: date,
        dataIndex: date,
        key: date,
        align: 'center',
        width: `${100 / 9}%`,
        render: (value, row, index) => {
          const valueTemp = () => {
            if (index === 0 && date !== '10/29/2021') {
              return renderDateHeaderItem(date);
            }
            // if this date has a leave request
            if (date === '10/27/2021') {
              return renderEventColumn();
            }

            // if this date is holiday
            if (date === '10/29/2021') {
              return renderHoliday(date);
            }

            // console.log('row', row);
            return (
              <TaskPopover>
                <span className={styles.hourValue}>{date}</span>
              </TaskPopover>
            );
          };
          const obj = {
            children: valueTemp(),
            props: {},
          };

          // pretend 10/27/2021 is a leave day
          if (index === 1 && date === '10/27/2021') {
            obj.props.rowSpan = formattedData.length;
          }
          for (let i = 2; i < formattedData.length; i += 1) {
            // These ones are merged into above cell
            if (index === i && date === '10/27/2021') {
              obj.props.rowSpan = 0;
            }
          }

          // pretend 10/29/2021 is holiday day
          if (index === 0 && date === '10/29/2021') {
            obj.props.rowSpan = formattedData.length;
          }
          for (let i = 1; i < formattedData.length; i += 1) {
            // These ones are merged into above cell
            if (index === i && date === '10/29/2021') {
              obj.props.rowSpan = 0;
            }
          }
          return obj;
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

  const renderFooter = (values) => {
    return (
      <div className={styles.footer}>
        <div className={styles.item}>
          <span className={styles.text}>Total</span>
        </div>
        <div className={styles.item}>Item</div>
        <div className={styles.item}>Item</div>
        <div className={styles.item}>Item</div>
        <div className={styles.item}>Item</div>
        <div className={styles.item}>Item</div>
        <div className={styles.item}>Item</div>
        <div className={styles.item}>Item</div>
        <div className={styles.item} />
      </div>
    );
  };
  // MAIN AREA
  return (
    <div className={styles.WeeklyTable}>
      <div className={styles.tableContainer}>
        <Table
          columns={columns()}
          dataSource={formattedData}
          bordered
          pagination={false}
          // scroll={{ y: 440 }}
          footer={renderFooter}
        />
      </div>
    </div>
  );
};

export default connect(({ loading, timeSheet: { myTimesheet = [] } = {} }) => ({
  myTimesheet,
  loadingFetchMyTimesheet: loading.effects['timeSheet/fetchMyTimesheetEffect'],
}))(WeeklyTable);
