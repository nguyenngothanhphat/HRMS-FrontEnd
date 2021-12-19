import { Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { projectColor, convertMsToTime } from '@/utils/timeSheet';
import CompleteIcon from '@/assets/timeSheet/complete.svg';
import FailIcon from '@/assets/timeSheet/fail.svg';
import PendingIcon from '@/assets/timeSheet/pending.svg';
import TaskPopover from './components/TaskPopover';
import EmptyLine from '@/assets/timeSheet/emptyLine.svg';
import EmptyComponent from '@/pages/TimeSheet/components/ComplexView/components/Empty';

import styles from './index.less';

const WeeklyTable = (props) => {
  const { startDate = '', endDate = '', loadingFetchMyTimesheetByType = false, data = [] } = props;
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

  // check if the same date
  const isTheSameDay = (date1, date2) => {
    return moment(date1).format('MM/DD/YYYY') === moment(date2).format('MM/DD/YYYY');
  };

  // format data
  const formatData = () => {
    const dates = {};
    for (let i = 0; i < dateList.length; i += 1) dates[dateList[i]] = dateList[i];
    const header = {
      projectName: 'All Projects',
      totalProjectTime: 'Total Hours',
      ...dates,
    };
    setFormattedData([header].concat(data));
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
  // BODY
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
        render: (_, row, index) => {
          const { projectName = '', days = [] } = row;
          const value = days.find((d) => isTheSameDay(d.date, date));
          const getCellValue = () => {
            if (index === 0 /* / FOR HOLIDAY & LEAVE REQUEST && date !== '10/29/2021' */) {
              return renderDateHeaderItem(date);
            }

            // FOR HOLIDAY & LEAVE REQUEST
            // // if this date has a leave request
            // if (date === '10/27/2021') {
            //   return renderEventColumn();
            // }

            // // if this date is holiday
            // if (date === '10/29/2021') {
            //   return renderHoliday(date);
            // }

            return (
              <TaskPopover
                projectName={projectName}
                date={date}
                tasks={value?.dailyProjectTask}
                placement="bottomLeft"
              >
                {!value ? (
                  <span className={styles.hourValue}>
                    <img src={EmptyLine} alt="" />
                  </span>
                ) : (
                  <span className={styles.hourValue}>
                    {convertMsToTime(value?.projectDailyTime)}
                  </span>
                )}
              </TaskPopover>
            );
          };
          const obj = {
            children: getCellValue(),
            props: {},
          };

          // FOR HOLIDAY & LEAVE REQUEST
          // // pretend 10/27/2021 is a leave day
          // if (index === 1 && date === '10/27/2021') {
          //   obj.props.rowSpan = formattedData.length;
          // }
          // for (let i = 2; i < formattedData.length; i += 1) {
          //   // These ones are merged into above cell
          //   if (index === i && date === '10/27/2021') {
          //     obj.props.rowSpan = 0;
          //   }
          // }

          // // pretend 10/29/2021 is holiday day
          // if (index === 0 && date === '10/29/2021') {
          //   obj.props.rowSpan = formattedData.length;
          // }
          // for (let i = 1; i < formattedData.length; i += 1) {
          //   // These ones are merged into above cell
          //   if (index === i && date === '10/29/2021') {
          //     obj.props.rowSpan = 0;
          //   }
          // }
          return obj;
        },
      };
    });

    const result = [
      {
        title: 'All Projects',
        dataIndex: 'projectName',
        key: 'projectName',
        align: 'center',
        width: `${100 / 9}%`,
        render: (projectName, _, index) => {
          if (index === 0) {
            return projectName;
          }
          return (
            <div className={styles.projectName}>
              <div className={styles.icon} style={{ backgroundColor: getColorByIndex(index) }}>
                <span>{projectName ? projectName.toString()?.charAt(0) : 'P'}</span>
              </div>
              <span className={styles.name}>{projectName}</span>
            </div>
          );
        },
      },
      ...dateColumns,
      {
        title: 'Total Hours',
        dataIndex: 'totalProjectTime',
        key: 'totalProjectTime',
        align: 'center',
        width: `${100 / 9}%`,
        render: (value, _, index) => {
          if (index === 0) return <span className={styles.totalHeader}>{value}</span>;
          return <span className={styles.totalValue}>{convertMsToTime(value)}</span>;
        },
      },
    ];
    return result;
  };

  // FOOTER
  const getDurationByDate = () => {
    let tempData = [];
    data.forEach((d) => {
      tempData = [...tempData, ...d.days];
    });
    return dateList.map((date) => {
      const groupByDate = tempData.filter((v) => isTheSameDay(v.date, date));
      let tasks = [];
      groupByDate.forEach((d) => {
        tasks = [...tasks, ...d.dailyProjectTask];
      });
      const duration = groupByDate.reduce((sum, item) => sum + item.projectDailyTime, 0);
      return {
        date,
        duration,
        tasks,
      };
    });
  };

  const renderFooter = () => {
    if (data.length === 0) return <EmptyComponent />;
    const durationByDate = getDurationByDate();
    return (
      <div className={styles.footer}>
        <div className={styles.item}>
          <span className={styles.text}>Total</span>
        </div>
        {durationByDate.map((item) => {
          return (
            <TaskPopover date={item.date} tasks={item.tasks}>
              {item.tasks.length > 0 ? (
                <div className={styles.item}>
                  <span className={styles.value}>{convertMsToTime(item.duration)}</span>
                </div>
              ) : (
                <div className={styles.item}>
                  <img src={EmptyLine} alt="" />
                </div>
              )}
            </TaskPopover>
          );
        })}
        <div className={styles.item}>
          <img src={EmptyLine} alt="" />
        </div>
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
          loading={loadingFetchMyTimesheetByType}
        />
      </div>
    </div>
  );
};

export default connect(({ loading, timeSheet: { myTimesheet = [] } = {} }) => ({
  myTimesheet,
  loadingFetchMyTimesheetByType: loading.effects['timeSheet/fetchMyTimesheetByTypeEffect'],
}))(WeeklyTable);
