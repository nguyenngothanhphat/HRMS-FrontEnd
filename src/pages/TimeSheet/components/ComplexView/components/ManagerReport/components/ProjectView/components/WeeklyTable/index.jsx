import { Table, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import EmptyLine from '@/assets/timeSheet/emptyLine.svg';
import IconWarning from '@/assets/timeSheet/ic_warning.svg';
import IconHoliday from '@/assets/timeSheet/ic_holiday.svg';
import EmptyComponent from '@/components/Empty';
import {
  checkHoliday,
  convertMsToTime,
  getHolidayNameByDate,
  holidayFormatDate,
  projectColor,
} from '@/utils/timeSheet';
import TaskPopover from './components/TaskPopover';
import styles from './index.less';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import UserProfilePopover from '@/components/UserProfilePopover';

const WeeklyTable = (props) => {
  const { startDate = '', endDate = '', loadingFetch = false, data = [], holidays = [] } = props;

  const [dateList, setDateList] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [pageSelected, setPageSelected] = useState(1);

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
    return moment(date1, 'YYYY-MM-DD').format('MM/DD/YYYY') === moment(date2).format('MM/DD/YYYY');
  };

  const getColorByIndex = (index) => {
    return projectColor[index % projectColor.length];
  };

  useEffect(() => {
    const dateListTemp = enumerateDaysBetweenDates(moment(startDate), moment(endDate));
    setDateList(dateListTemp);
  }, [startDate, endDate]);

  const renderHoliday = (date) => {
    const holidayName = getHolidayNameByDate(date);
    return (
      <div className={styles.holidayContainer}>
        <img src={IconHoliday} width={40} height={40} alt="" />
        <p>{holidayName}</p>
      </div>
    );
  };

  const renderDateHeaderItem = (date) => {
    const isHoliday = checkHoliday(date, holidays);
    const holidayName = getHolidayNameByDate(date);
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
                {`${holidayFormatDate(date)} is ${holidayName}`}
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

  const renderLeaveDays = () => {
    return (
      <div className={styles.leaveCell} style={{ fontWeight: 500 }}>
        Leave
      </div>
    );
  };

  const dataHover = (values) => {
    const {
      legalName = '',
      avatar: avatar1 = '',
      userId = '',
      workEmail = '',
      workNumber = '',
      skills = [],
      department = {},
      location = {},
      manager = {},
      title = {},
    } = values;
    return {
      legalName,
      userId,
      department: department || {},
      workEmail,
      workNumber,
      location: location || {},
      manager,
      title,
      avatar1,
      skills,
    };
  };

  const columns = () => {
    const checkTaskOnHoliday = (date) => {
      return data.every((list) => {
        if (list.dailyList.some((day) => isTheSameDay(day.date, date))) return false;
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
        render: (_, row, index) => {
          const { projectName = '', dailyList = [] } = row;
          const value = dailyList.find((d) => isTheSameDay(d.date, date));
          const getCellValue = () => {
            if (value?.isMorning && value?.isAfternoon) {
              return renderLeaveDays(date);
            }

            return (
              <TaskPopover
                projectName={projectName}
                date={date}
                tasks={value?.dailyTask}
                placement="bottomLeft"
              >
                {isHoliday && checkTaskOnHoliday(date) ? (
                  renderHoliday(date)
                ) : (
                  <>
                    {value ? (
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {(value?.isMorning || value?.isAfternoon) && (
                          <span
                            className={
                              (value.isMorning && styles.hourValue__morningOff) ||
                              (value.isAfternoon && styles.hourValue__afternoonOff)
                            }
                          >
                            Leave
                          </span>
                        )}
                        <span
                          className={
                            value?.isMorning || value?.isAfternoon
                              ? styles.hourValue__work
                              : styles.hourValue
                          }
                        >
                          {convertMsToTime(value.spentTime)}
                        </span>
                      </div>
                    ) : (
                      <span className={styles.hourValue}>
                        <img src={EmptyLine} alt="" />
                      </span>
                    )}
                  </>
                )}
              </TaskPopover>
            );
          };
          const obj = {
            children: getCellValue(),
            props: {},
          };

          // Handle Holiday cell
          if (checkTaskOnHoliday(date)) {
            if (index === 0 && isHoliday) {
              obj.props.rowSpan = data.length;
            }
            for (let i = 1; i < data.length; i += 1) {
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
        title: renderTitle('Employee', 1),
        dataIndex: 'employee',
        key: 'employee',
        align: 'center',
        width: `${100 / 9}%`,
        render: (employee, _, index) => {
          const { legalName = '', userId = '', avatar } = employee;
          return (
            <UserProfilePopover placement="rightTop" data={dataHover(employee)}>
              <div className={styles.member}>
                <div className={styles.renderEmployee}>
                  <div className={styles.avatar}>
                    {avatar ? (
                      <img src={avatar || MockAvatar} alt="" />
                    ) : (
                      <div
                        className={styles.icon}
                        style={{ backgroundColor: getColorByIndex(index) }}
                      >
                        <span>{legalName ? legalName.toString()?.charAt(0) : 'P'}</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.right}>
                    <span className={styles.name}>{legalName}</span>
                    <span className={styles.id}>({userId})</span>
                  </div>
                </div>
              </div>
            </UserProfilePopover>
          );
        },
      },
      ...dateColumns,
      {
        title: renderTitle('Total Hours', 3),
        dataIndex: 'totalDuration',
        key: 'totalDuration',
        align: 'center',
        width: `${100 / 9}%`,
        render: (value) => {
          return <span className={styles.totalValue}>{convertMsToTime(value)}</span>;
        },
      },
    ];
    return result;
  };

  const onChangePagination = (pageNumber, pageSizeProp) => {
    setPageSelected(pageNumber);
    setPageSize(pageSizeProp);
  };
  const pagination = {
    position: ['bottomLeft'],
    total: data.length,
    showTotal: (total, range) => (
      <span>
        Showing{' '}
        <b>
          {range[0]} - {range[1]}
        </b>{' '}
        of {total}{' '}
      </span>
    ),
    defaultPageSize: pageSize,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '25', '50'],
    pageSize,
    current: pageSelected,
    onChange: onChangePagination,
  };

  // MAIN AREA
  return (
    <div className={styles.WeeklyTable}>
      <div className={styles.tableContainer}>
        <Table
          columns={columns()}
          dataSource={data}
          bordered
          pagination={data.length > 0 ? pagination : { position: ['none', 'none'] }}
          // scroll={{ y: 440 }}
          loading={loadingFetch}
          locale={{
            emptyText: <EmptyComponent />,
          }}
        />
      </div>
    </div>
  );
};

export default connect(({ loading, timeSheet: { myTimesheet = [] } = {} }) => ({
  myTimesheet,
  loadingFetch: loading.effects['timeSheet/fetchManagerTimesheetOfProjectViewEffect'],
}))(WeeklyTable);
