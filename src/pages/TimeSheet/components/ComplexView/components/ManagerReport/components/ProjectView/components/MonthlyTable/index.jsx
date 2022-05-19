import { Table } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import { convertMsToTime, projectColor } from '@/utils/timeSheet';
import EmptyComponent from '@/components/Empty';
import EmptyLine from '@/assets/timeSheet/emptyLine.svg';
import TaskPopover from './components/TaskPopover';
import styles from './index.less';

const MonthlyTable = (props) => {
  const {
    loadingFetch = false,
    weeksOfMonth = [],
    data = [],
    tablePagination: {
      page = 0,
      // pageCount = 0,
      pageSize = 0,
      rowCount = 0,
    } = {},
    onChangePage = () => {},
  } = props;

  // FUNCTIONS
  const getColorByIndex = (index) => {
    return projectColor[index % projectColor.length];
  };

  // RENDER UI
  const renderHeaderItem = (weekItem) => {
    const { week = '', startDate: startDate1 = '', endDate: endDate1 = '' } = weekItem;
    return (
      <div className={styles.timeStamp}>
        <div className={styles.weekName}>Week {week}</div>
        <div className={styles.weekDate}>
          {moment(startDate1).locale('en').format('MMM DD')} -{' '}
          {moment(endDate1).locale('en').format('MMM DD')}
        </div>
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
        title: renderTitle('All Projects', 1),
        dataIndex: 'functionalArea',
        key: 'functionalArea',
        align: 'center',
        width: `${100 / columnLength}%`,
        render: (functionalArea, _, index) => {
          return (
            <div className={styles.functionalArea}>
              <div className={styles.icon} style={{ backgroundColor: getColorByIndex(index) }}>
                <span>{functionalArea ? functionalArea.toString()?.charAt(0) : 'P'}</span>
              </div>
              <span className={styles.name}>{functionalArea}</span>
            </div>
          );
        },
      },
      ...dateColumns,
    ];
    return result;
  };

  const onChangePagination = (pageNumber) => {
    onChangePage(pageNumber);
  };

  const pagination = {
    position: ['bottomLeft'],
    total: rowCount,
    showTotal: (total, range) => (
      <span>
        Showing{' '}
        <b>
          {range[0]} - {range[1]}
        </b>{' '}
        of {total}{' '}
      </span>
    ),
    pageSize,
    current: page,
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
