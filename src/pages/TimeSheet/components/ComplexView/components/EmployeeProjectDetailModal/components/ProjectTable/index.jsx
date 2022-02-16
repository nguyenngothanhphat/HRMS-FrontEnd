import { Table } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import { convertMsToTime, employeeColor } from '@/utils/timeSheet';
import styles from './index.less';

const ProjectTable = (props) => {
  const { list = [], loading = false } = props;
  const [pageSelected, setPageSelected] = useState(1);

  const getColorByIndex = (index) => {
    return employeeColor[index % employeeColor.length];
  };

  const _renderProject = (record, index) => {
    const { projectName = '' } = record;

    return (
      <div className={styles.renderProject}>
        <div className={styles.avatar}>
          <div className={styles.icon} style={{ backgroundColor: getColorByIndex(index) }}>
            <span>{projectName ? projectName.toString()?.charAt(0) : 'P'}</span>
          </div>
        </div>
        <div className={styles.right}>
          <span className={styles.name}>{projectName || '-'}</span>
        </div>
      </div>
    );
  };

  // COLUMNS
  const generateColumns = () => {
    const columns = [
      {
        title: 'Project Name',
        dataIndex: 'projectName',
        key: 'projectName',
        width: '20%',
        render: (_, row, index) => {
          return _renderProject(row, index);
        },
      },
      {
        title: 'Task Name',
        dataIndex: 'taskName',
        key: 'taskName',
      },
      {
        title: 'Description',
        dataIndex: 'notes',
        key: 'notes',
      },
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        render: (_, record) => {
          return (
            <span>
              {record.startTime} - {record.endTime}
            </span>
          );
        },
      },
      {
        title: 'Total hours',
        dataIndex: 'duration',
        key: 'duration',
        align: 'center',
        render: (duration) => (
          <span className={styles.totalHours}>{duration ? convertMsToTime(duration) : ''}</span>
        ),
      },
    ];

    return columns;
  };

  const pagination = {
    position: ['bottomLeft'],
    total: list.length,
    showTotal: (total, range) => (
      <span>
        Showing{' '}
        <b>
          {range[0]} - {range[1]}
        </b>{' '}
        of {total}
      </span>
    ),
    defaultPageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '25', '50', '100'],
    pageSize: 10,
    current: pageSelected,
    onPageChange: (page) => setPageSelected(page),
  };

  // MAIN AREA
  return (
    <div className={styles.ProjectTable}>
      <Table
        size="middle"
        columns={generateColumns()}
        dataSource={list}
        pagination={pagination}
        loading={loading}
      />
    </div>
  );
};

export default connect(() => ({}))(ProjectTable);
