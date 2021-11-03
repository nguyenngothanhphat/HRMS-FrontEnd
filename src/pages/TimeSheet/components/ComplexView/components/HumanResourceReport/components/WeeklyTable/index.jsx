import { Table } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const WeeklyTable = (props) => {
  const { data = [], limit = 10 } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pageSelected, , setPageSelected] = useState(1);

  const generateColumns = () => {
    const columns = [
      {
        title: 'Employee',
        dataIndex: 'user',
        key: 'user',
        render: (user) => user.name,
      },
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
      },
      {
        title: 'Projects',
        dataIndex: 'project',
        key: 'project',
      },
      {
        title: 'Working Days',
        dataIndex: 'workingDays',
        key: 'workingDays',
      },
      {
        title: 'Leaves Taken',
        dataIndex: 'leavesTaken',
        key: 'leavesTaken',
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
    setSelectedRowKeys(values);
  };

  const rowSelection = {
    selectedRowKeys,
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
        bordered
        rowSelection={rowSelection}
        rowKey={(record) => record.id}
        pagination={pagination}
      />
    </div>
  );
};

export default connect(() => ({}))(WeeklyTable);
