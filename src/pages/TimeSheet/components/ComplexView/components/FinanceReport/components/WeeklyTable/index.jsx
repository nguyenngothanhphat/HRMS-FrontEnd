import { Table } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import { employeeColor } from '@/utils/timeSheet';
import styles from './index.less';

const WeeklyTable = (props) => {
  const { data = [], limit = 10, selectedProjects = [], setSelectedProjects = () => {} } = props;
  const [pageSelected, , setPageSelected] = useState(1);

  const getColorByIndex = (index) => {
    return employeeColor[index % employeeColor.length];
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'Project Name',
        dataIndex: 'project',
        key: 'project',
        render: (project, _, index) => (
          <div className={styles.renderProject}>
            <div className={styles.avatar}>
              <div className={styles.icon} style={{ backgroundColor: getColorByIndex(index) }}>
                <span>{project ? project.toString()?.charAt(0) : 'P'}</span>
              </div>
            </div>
            <div className={styles.right}>
              <span className={styles.name}>{project}</span>
            </div>
          </div>
        ),
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: 'Resources',
        dataIndex: 'resources',
        key: 'resources',
      },
      {
        title: 'Total Days',
        dataIndex: 'totalDays',
        key: 'totalDays',
      },
      {
        title: 'Total Hours',
        dataIndex: 'totalHours',
        key: 'totalHours',
      },
    ];
    return columns;
  };

  const onSelectChange = (values) => {
    setSelectedProjects(values);
  };

  const rowSelection = {
    selectedRowKeys: selectedProjects,
    onChange: onSelectChange,
  };

  const onChangePagination = (pageNumber) => {
    setPageSelected(pageNumber);
  };

  const pagination = {
    position: ['bottomLeft'],
    total: data.length,
    showTotal: (total, range) => (
      <span>
        {' '}
        Showing{' '}
        <b>
          {range[0]} - {range[1]}
        </b>{' '}
        of {total}{' '}
      </span>
    ),
    pageSize: limit,
    current: pageSelected,
    onChange: onChangePagination,
  };

  // MAIN AREA
  return (
    <div className={styles.WeeklyTable}>
      <Table
        columns={generateColumns()}
        dataSource={data}
        rowSelection={rowSelection}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={selectedProjects.length > 0 ? { y: 400 } : {}}
        // pagination={pagination}
      />
    </div>
  );
};

export default connect(() => ({}))(WeeklyTable);
