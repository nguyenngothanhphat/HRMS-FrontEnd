import { Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { projectColor, convertMsToTime } from '@/utils/timeSheet';
import TaskPopover from './components/TaskPopover';
import EmptyLine from '@/assets/timeSheet/emptyLine.svg';

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
  const [formattedData, setFormattedData] = useState([]);

  // FUNCTIONS
  // format data
  const formatData = () => {
    const header = {
      functionalArea: 'Functional Area',
    };
    setFormattedData([header].concat(data));
  };

  const getColorByIndex = (index) => {
    return projectColor[index % projectColor.length];
  };

  // USE EFFECT
  useEffect(() => {
    formatData();
  }, [JSON.stringify(data)]);

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

  const columns = () => {
    const columnLength = weeksOfMonth.length + 1;
    const dateColumns = weeksOfMonth.map((weekItem) => {
      return {
        title: weekItem.week,
        dataIndex: weekItem.week,
        key: weekItem.week,
        align: 'center',
        width: `${100 / columnLength}}%`,
        render: (value, row, index) => {
          const { weeks = [] } = row;
          if (index === 0) return renderHeaderItem(weekItem);
          const find = weeks.find((w) => w.week === weekItem.week) || {};
          return (
            <TaskPopover
              week={weekItem.week}
              startDate={weekItem.startDate}
              endDate={weekItem.endDate}
              tasks={find?.timesheet}
            >
              {(!find || find?.weekProjectTime === 0) ? (
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
        title: 'All Projects',
        dataIndex: 'functionalArea',
        key: 'functionalArea',
        align: 'center',
        width: `${100 / columnLength}%`,
        render: (functionalArea, _, index) => {
          if (index === 0) {
            return functionalArea;
          }
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
          dataSource={formattedData}
          bordered
          pagination={pagination}
          // scroll={{ y: 440 }}
          loading={loadingFetch}
        />
      </div>
    </div>
  );
};

export default connect(({ loading }) => ({
  loadingFetch: loading.effects['timeSheet/fetchManagerTimesheetOfProjectViewEffect'],
}))(MonthlyTable);
