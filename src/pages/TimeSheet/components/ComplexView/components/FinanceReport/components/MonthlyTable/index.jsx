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
    // data: { weeks: weeksProp = [], summary: summaryProp = [] } = {},
    data = [],
    selectedProjects = [],
    setSelectedProjects = () => {},
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
    if (type === 1) return <div style={{ paddingLeft: '24px' }}>{title}</div>;
    if (type === 3) return <span className={styles.totalHeader}>{title}</span>;
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
          const find = weeks.find((w) => w.week === weekItem.week);
          return (
            <TaskPopover
              week={weekItem.week}
              startDate={weekItem.startDate}
              endDate={weekItem.endDate}
              tasks={find?.timesheet}
            >
              {!find || find?.weekProjectTime === 0 ? (
                <span className={styles.hourValue}>
                  <img src={EmptyLine} alt="" />
                </span>
              ) : (
                <span className={styles.hourValue}>{convertMsToTime(find.weekProjectTime)}</span>
              )}
            </TaskPopover>
          );
        },
      };
    });

    const result = [
      {
        title: renderTitle('All Projects', 1),
        dataIndex: 'projectName',
        key: 'projectName',
        align: 'left',
        width: `${100 / columnLength}%`,
        render: (projectName, row, index) => {
          const { engagementType = '' } = row;
          return (
            <div className={styles.projectName}>
              <div className={styles.icon} style={{ backgroundColor: getColorByIndex(index) }}>
                <span>{projectName ? projectName.toString()?.charAt(0) : 'P'}</span>
              </div>
              <div className={styles.rightPart}>
                <span className={styles.name}>{projectName}</span>
                <span className={styles.type}>{engagementType}</span>
              </div>
            </div>
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
        render: (value = 0) => {
          if (value === 0) return '';
          return <span className={styles.totalValue}>{convertMsToTime(value)}</span>;
        },
      },
    ];
    return result;
  };

  const onSelectChange = (selectedRowKeys) => {
    setSelectedProjects(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys: selectedProjects,
    onChange: onSelectChange,
  };

  // MAIN AREA
  return (
    <div className={styles.MonthlyTable}>
      <div className={styles.tableContainer}>
        <Table
          columns={columns()}
          dataSource={data}
          bordered
          rowSelection={rowSelection}
          pagination={false}
          // scroll={{ y: 440 }}
          loading={loadingFetch}
          rowKey={(row) => row.projectId}
          locale={{
            emptyText: <EmptyComponent />,
          }}
        />
      </div>
    </div>
  );
};

export default connect(() => ({}))(MonthlyTable);
