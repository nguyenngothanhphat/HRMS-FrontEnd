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
    // data: { weeks: weeksProp = [], summary: summaryProp = [] } = {},
    data = [],
    selectedProjects = [],
    setSelectedProjects = () => {},
  } = props;
  const [formattedData, setFormattedData] = useState([]);

  // FUNCTIONS
  // format data
  const formatData = () => {
    const header = {
      projectName: 'All Projects',
      totalDuration: 'Total Hours',
      projectId: 'All',
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
          if (!find)
            return (
              <span className={styles.hourValue}>
                <img src={EmptyLine} alt="" />
              </span>
            );
          return (
            <span className={styles.hourValue}>{convertMsToTime(find.weekProjectTime || 0)}</span>
          );
        },
      };
    });

    const result = [
      {
        title: 'All Projects',
        dataIndex: 'projectName',
        key: 'projectName',
        align: 'left',
        width: `${100 / columnLength}%`,
        render: (projectName, _, index) => {
          if (index === 0) {
            return <div style={{ paddingLeft: '24px' }}>{projectName}</div>;
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
        dataIndex: 'totalDuration',
        key: 'totalDuration',
        align: 'center',
        width: `${100 / 9}%`,
        render: (value = 0, _, index) => {
          if (index === 0) return <span className={styles.totalHeader}>{value}</span>;
          return <span className={styles.totalValue}>{convertMsToTime(value)}</span>;
        },
      },
    ];
    return result;
  };

  const onSelectChange = (selectedRowKeys) => {
    console.log('🚀 ~ onSelectChange ~ selectedRowKeys', selectedRowKeys);
    let temp = [...selectedRowKeys];
    const projectListLength = data.length;
    const selectedListLength = selectedRowKeys.length;

    if (projectListLength === selectedListLength) {
      if (!selectedRowKeys.includes('All')) {
        temp = [...data.map((x) => x.projectId), 'All'];
      }
    } else if (selectedRowKeys.includes('All')) {
      temp = [...data.map((x) => x.projectId), 'All'];
    }

    if (temp.length === 1 && temp.includes('All')) {
      temp = [];
    }
    // if (
    //   (selectedRowKeys.includes('All') && selectedRowKeys.length !== 1) ||
    //   (projectListLength === selectedListLength && !selectedRowKeys.includes('All'))
    // ) {
    //   temp = [...data.map((x) => x.projectId), 'All'];
    // }

    setSelectedProjects([...temp]);
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
          dataSource={formattedData}
          bordered
          rowSelection={rowSelection}
          pagination={false}
          // scroll={{ y: 440 }}
          loading={loadingFetch}
          rowKey={(row) => row.projectId}
        />
      </div>
    </div>
  );
};

export default connect(() => ({}))(MonthlyTable);
