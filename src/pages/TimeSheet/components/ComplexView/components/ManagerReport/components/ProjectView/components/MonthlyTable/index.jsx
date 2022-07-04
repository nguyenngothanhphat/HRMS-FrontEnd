import { Table, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import {
  checkHolidayInWeek,
  convertMsToTime,
  dateFormatAPI,
  holidayFormatDate,
  projectColor,
} from '@/utils/timeSheet';
import EmptyComponent from '@/components/Empty';
import EmptyLine from '@/assets/timeSheet/emptyLine.svg';
import TaskPopover from './components/TaskPopover';
import styles from './index.less';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import IconWarning from '@/assets/timeSheet/ic_warning.svg';
import UserProfilePopover from '@/components/UserProfilePopover';
import { getCurrentCompany } from '@/utils/authority';

const MonthlyTable = (props) => {
  const {
    dispatch,
    startDate,
    endDate,
    loadingFetch = false,
    weeksOfMonth = [],
    data = [],
  } = props;

  const [holidays, setHolidays] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [pageSelected, setPageSelected] = useState(1);
  // FUNCTIONS
  const getColorByIndex = (index) => {
    return projectColor[index % projectColor.length];
  };

  const fetchHolidaysByDate = async () => {
    const holidaysResponse = await dispatch({
      type: 'timeSheet/fetchHolidaysByDate',
      payload: {
        companyId: getCurrentCompany(),
        fromDate: moment(startDate).format(dateFormatAPI),
        toDate: moment(endDate).format(dateFormatAPI),
      },
    });
    setHolidays(holidaysResponse);
  };

  // USE EFFECT
  useEffect(() => {
    if (startDate && endDate) fetchHolidaysByDate();
  }, [startDate, endDate]);

  // RENDER UI
  const renderHeaderItem = (weekItem) => {
    const { week = '', startDate: startDate1 = '', endDate: endDate1 = '' } = weekItem;
    const isHoliday = checkHolidayInWeek(startDate1, endDate1, holidays);
    return (
      <div className={styles.timeStamp} style={{ backgroundColor: isHoliday ? '#FFFAF2' : '#FFF' }}>
        <div className={styles.weekName}>Week {week}</div>
        <div className={styles.weekDate}>
          {moment(startDate1).locale('en').format('MMM DD')} -{' '}
          {moment(endDate1).locale('en').format('MMM DD')}
        </div>
        {isHoliday && (
          <Tooltip
            title={
              <span style={{ margin: 0, color: '#F98E2C' }}>
                {holidays.map((holiday) => (
                  <div key={holiday.date}>
                    {checkHolidayInWeek(startDate1, endDate1, [holiday])
                      ? `${holidayFormatDate(holiday.date)} is ${holiday.holiday}`
                      : null}
                  </div>
                ))}
              </span>
            }
            placement="top"
            color="#FFFAF2"
          >
            <img src={IconWarning} className={styles.holidayIconWarning} alt="" />
          </Tooltip>
        )}
      </div>
    );
  };

  const renderTitle = (title, type) => {
    if (type === 1) return title;
    return renderHeaderItem(title);
  };

  const columns = () => {
    const columnLength = weeksOfMonth.length + 1;
    const dateColumns = weeksOfMonth.map((weekItem) => {
      return {
        title: renderTitle(weekItem, 2),
        dataIndex: weekItem.week,
        key: weekItem.week,
        align: 'center',
        width: `${100 / columnLength}}%`,
        render: (value, row) => {
          const { weeks = [] } = row;
          const find = weeks.find((w) => w.week === weekItem.week) || {};
          return (
            <TaskPopover
              week={weekItem.week}
              startDate={weekItem.startDate}
              endDate={weekItem.endDate}
              placement="bottomLeft"
              tasks={find?.timesheet}
            >
              {!find || find?.weekProjectTime === 0 ? (
                <div className={styles.hourValue}>
                  <img src={EmptyLine} alt="" />
                </div>
              ) : (
                <span className={styles.hourValue}>
                  {convertMsToTime(find.weekProjectTime || 0)}
                </span>
              )}
            </TaskPopover>
          );
        },
      };
    });

    const result = [
      {
        title: renderTitle('Employee', 1),
        dataIndex: 'employee',
        key: 'employee',
        align: 'center',
        width: `${100 / columnLength}%`,
        render: (employee, _, index) => {
          const { legalName = '', userId = '', avatar } = employee;
          return (
            <UserProfilePopover placement="rightTop" data={employee}>
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
    ];
    return result;
  };

  const onChangePagination = (pageNumber, pageSizeProp) => {
    // onChangePage(pageNumber);
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
    <div className={styles.MonthlyTable}>
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

export default connect(({ loading }) => ({
  loadingFetch: loading.effects['timeSheet/fetchManagerTimesheetOfProjectViewEffect'],
}))(MonthlyTable);
