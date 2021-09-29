import { Table } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpeg';
import styles from './index.less';

const TimelineTable = (props) => {
  const {
    firstDateOfWeek = '',
    endDateOfWeek = '',
    managerTimesheet = [],
    loadingFetchManagerTimesheet = false,
  } = props;
  const [pageSelected, setPageSelected] = useState(1);
  const _renderEmployee = (record) => {
    const { employeeName = '', employeeId = '' } = record;
    return (
      <div className={styles.renderEmployee}>
        <div className={styles.avatar}>
          <img src={MockAvatar} alt="" />
        </div>
        <div className={styles.right}>
          <span className={styles.name}>{employeeName}</span>
          <span className={styles.id}>({employeeId})</span>
        </div>
      </div>
    );
  };

  // COLUMNS
  const generateColumns = () => {
    const columns = [
      {
        title: 'Employee Name',
        dataIndex: 'employeeName',
        key: 'employeeName',
        width: '25%',
        render: (_, row) => {
          return _renderEmployee(row);
        },
      },
      {
        title: 'No.of hours worked',
        dataIndex: 'workedHours',
        key: 'workedHours',
      },
      {
        title: 'No.of overtime hours',
        dataIndex: 'overtimeHours',
        key: 'overtimeHours',
      },
      {
        title: 'PTO',
        dataIndex: 'pto',
        key: 'pto',
        render: (pto) => pto || '-',
      },
    ];

    return columns;
  };

  const pagination = {
    position: ['bottomLeft'],
    total: managerTimesheet.length,
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
    <div className={styles.TimelineTable}>
      <Table
        size="middle"
        columns={generateColumns()}
        dataSource={managerTimesheet}
        pagination={pagination}
        loading={loadingFetchManagerTimesheet}
      />
    </div>
  );
};

export default connect(({ loading, timeSheet: { managerTimesheet = [] } = {} }) => ({
  managerTimesheet,
  loadingFetchManagerTimesheet: loading.effects['timeSheet/fetchManagerTimesheetEffect'],
}))(TimelineTable);
