/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import { Table, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import {
  projectColor,
  convertMsToTime,
  VIEW_TYPE,
  checkHoliday,
  holidayFormatDate,
  getHolidayNameByDate,
} from '@/utils/timeSheet';
import AirPlanIcon from '@/assets/timeSheet/airplanIcon.svg';
import TaskPopover from './components/TaskPopover';
import TimeoffPopover from './components/TimeoffPopover';
import EmptyLine from '@/assets/timeSheet/emptyLine.svg';
import IconHoliday from '@/assets/timeSheet/ic_holiday.svg';
import IconWarning from '@/assets/timeSheet/ic_warning.svg';
import IconAdd from '@/assets/timeSheet/add.svg';
import EmptyComponent from '@/components/Empty';
import CellMenu from './components/CellMenu';
import styles from './index.less';

const WeeklyTable = (props) => {
  const {
    startDate = '',
    endDate = '',
    loadingFetchMyTimesheetByType = false,
    data = [],
    timeoffList = [],
    timeSheet = { holidays: [] },
    setSelectedDate = () => {},
    setSelectedView = () => {},
  } = props;
  const [dateList, setDateList] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [popup, setPopup] = useState({ visible: false, x: 0, y: 0 });
  const { holidays } = timeSheet;

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

  const getColorByIndex = (index) => {
    return projectColor[index % projectColor.length];
  };

  const formatData = () => {
    let row = [];

    if (timeoffList.length > 0) {
      const [firstRow] = timeoffList;
      if (firstRow.days.length > 0) {
        row = [Object.assign(firstRow, { projectName: 'Timeoff' })];
      }
    }

    setFormattedData(row.concat(data));
  };

  // USE EFFECT
  useEffect(() => {
    const dateListTemp = enumerateDaysBetweenDates(moment(startDate), moment(endDate));
    setDateList(dateListTemp);
  }, [startDate, endDate]);

  useEffect(() => {
    formatData();
  }, [JSON.stringify(data), JSON.stringify(timeoffList)]);

  // RENDER UI
  // BODY
  const renderDateHeaderItem = (date) => {
    const isHoliday = checkHoliday(date, holidays);
    return (
      <div className={styles.timeStamp} style={{ backgroundColor: isHoliday ? '#FFFAF2' : 'FFF' }}>
        <div className={styles.left}>{moment(date, 'MM/DD/YYYY').locale('en').format('DD')}</div>
        <div className={styles.right}>
          <span className={styles.date}>
            {moment(date, 'MM/DD/YYYY').locale('en').format('dddd')}
          </span>
          <span className={styles.month}>
            {moment(date, 'MM/DD/YYYY').locale('en').format('MMMM')}
          </span>
        </div>
        {isHoliday ? (
          <Tooltip
            title={
              <span style={{ margin: 0, color: '#F98E2C' }}>
                {`${holidayFormatDate(date)} is ${getHolidayNameByDate(date, holidays)}`}
              </span>
            }
            placement="top"
            color="#FFFAF2"
          >
            <img src={IconWarning} className={styles.holidayIconWarning} alt="" />
          </Tooltip>
        ) : null}
      </div>
    );
  };

  const renderTitle = (title, type) => {
    if (type === 1) return title;
    if (type === 3) return <span className={styles.totalHeader}>{title}</span>;
    return renderDateHeaderItem(title);
  };

  const onViewDetail = (date) => {
    setSelectedDate(moment(date, 'MM/DD/YYYY'));
    setSelectedView(VIEW_TYPE.D);
  };

  const renderHoliday = (date) => {
    return (
      <div className={styles.holidayContainer}>
        <img src={IconHoliday} width={40} height={40} alt="" />
        <p>{getHolidayNameByDate(date, holidays)}</p>
        <div className={styles.addTaskContainer}>
          {formattedData.map((item) => (
            <div className={styles.addTaskHoliday} key={item.projectName}>
              <img src={IconAdd} alt="" width={40} height={40} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const onCell = (onClick) => ({
    // temporarily disable the cell menu
    onContextMenu: (event) => {
      event.preventDefault();
      if (!popup.visible) {
        document.addEventListener(`click`, function onClickOutside() {
          setPopup({ visible: false });
          document.removeEventListener(`click`, onClickOutside);
        });
      }
      setPopup({
        onClick,
        visible: true,
        x: event.clientX - 60,
        y: event.clientY - document.body.scrollTop,
      });
    },
  });

  const columns = () => {
    const checkTaskOnHoliday = (date) => {
      return formattedData.every((list) => {
        if (list.days.some((day) => isTheSameDay(day.date, date))) return false;
        return true;
      });
    };

    const dateColumns = dateList.map((date) => {
      const isHoliday = checkHoliday(date, holidays);
      return {
        title: renderTitle(date, 2),
        dataIndex: date,
        key: date,
        align: 'center',
        width: `${100 / 9}%`,
        onCell: () => onCell(() => onViewDetail(date)),
        render: (_, row, index) => {
          const { projectName = '', days = [] } = row;

          const getCellValue = () => {
            const value = days.find((d) => isTheSameDay(d.date, date));
            return (
              <TaskPopover
                projectName={projectName}
                date={date}
                tasks={value?.dailyProjectTask}
                placement="bottomLeft"
                isHoliday={checkTaskOnHoliday(date) && isHoliday}
              >
                {isHoliday && checkTaskOnHoliday(date) ? (
                  renderHoliday(date)
                ) : (
                  <div style={{ height: '100%' }}>
                    {!value ? (
                      <span className={styles.hourValue}>
                        <img src={EmptyLine} alt="" />
                      </span>
                    ) : (
                      <span className={styles.hourValue}>
                        {convertMsToTime(value?.projectDailyTime)}
                      </span>
                    )}
                  </div>
                )}
              </TaskPopover>
            );
          };

          const getCellTimeoffValue = () => {
            const arr = days.filter((d) => isTheSameDay(d.date, date));
            const sum = arr.reduce((accum, obj) => accum + obj.totalTimeOffTime, 0);
            return (
              <TimeoffPopover
                projectName={projectName}
                date={date}
                timeoff={arr}
                placement="bottomLeft"
              >
                {isHoliday && checkTaskOnHoliday(date) ? (
                  renderHoliday(date)
                ) : (
                  <>
                    {arr.length === 0 ? (
                      <span className={styles.hourValue}>
                        <img src={EmptyLine} alt="" />
                      </span>
                    ) : (
                      <span className={styles.hourValue}>{convertMsToTime(sum)}</span>
                    )}
                  </>
                )}
              </TimeoffPopover>
            );
          };
          const obj = {
            children: projectName === 'Timeoff' ? getCellTimeoffValue() : getCellValue(),
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

          // Handle Holiday cell
          if (checkTaskOnHoliday(date)) {
            if (index === 0 && isHoliday) {
              obj.props.rowSpan = formattedData.length;
            }
            for (let i = 1; i < formattedData.length; i += 1) {
              if (index === i && isHoliday) {
                obj.props.rowSpan = 0;
              }
            }
          }

          return obj;
        },
      };
    });

    const result = [
      {
        title: renderTitle('All Projects', 1),
        dataIndex: 'projectName',
        key: 'projectName',
        align: 'center',
        width: `${100 / 9}%`,
        render: (projectName, _, index) => {
          return (
            <div className={styles.projectName}>
              <div className={styles.icon} style={{ backgroundColor: getColorByIndex(index) }}>
                <span>
                  {projectName === 'Timeoff' ? (
                    <img src={AirPlanIcon} alt="" />
                  ) : projectName ? (
                    projectName.toString()?.charAt(0)
                  ) : (
                    'P'
                  )}
                </span>
              </div>
              <span className={styles.name}>{projectName}</span>
            </div>
          );
        },
      },
      ...dateColumns,
      {
        title: renderTitle('Total Hours', 3),
        dataIndex: ['totalProjectTime', 'totalTimeOffTime'],
        key: 'totalProjectTime',
        align: 'center',
        width: `${100 / 9}%`,
        render: (value, row) => {
          return (
            <span className={styles.totalValue}>
              {convertMsToTime(row.totalProjectTime || row.totalTimeOffTime)}
            </span>
          );
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
    const durationByDate = getDurationByDate();
    return (
      <div className={styles.footer}>
        <div className={styles.item}>
          <span className={styles.text}>Total</span>
        </div>
        {durationByDate.map((item, index) => {
          return (
            <TaskPopover date={item.date} tasks={item.tasks} key={item.date} index={index}>
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
          footer={data.length === 0 ? null : renderFooter}
          loading={loadingFetchMyTimesheetByType}
          locale={{
            emptyText: <EmptyComponent />,
          }}
        />
        <CellMenu {...popup} />
      </div>
    </div>
  );
};

export default connect(({ loading, timeSheet, timeSheet: { myTimesheet = [] } = {} }) => ({
  timeSheet,
  myTimesheet,
  loadingFetchMyTimesheetByType: loading.effects['timeSheet/fetchMyTimesheetByTypeEffect'],
}))(WeeklyTable);
