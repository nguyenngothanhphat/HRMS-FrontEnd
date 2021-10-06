import { Table } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import { parseTimeAPI } from '@/utils/timeSheet';
import styles from './index.less';

const TimelineTable = (props) => {
  const { managerTimesheet = [], loadingFetchManagerTimesheet = false, employeeList = [] } = props;
  const [pageSelected, setPageSelected] = useState(1);

  const _renderEmployee = (record) => {
    const { employeeId = '', employee: { employeeName = '', employeeCode = '' } = {} || {} } =
      record;
    const employeeInfo = employeeList.find((e) => e._id === employeeId) || {};
    const { generalInfo: { avatar = '' } = {} || {} } = employeeInfo;
    return (
      <div className={styles.renderEmployee}>
        <div className={styles.avatar}>
          <img src={avatar || MockAvatar} alt="" />
        </div>
        <div className={styles.right}>
          <span className={styles.name}>{employeeName}</span>
          <span className={styles.id}>({employeeCode})</span>
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
        dataIndex: 'totalWorkedTime',
        key: 'totalWorkedTime',
        render: (totalWorkedTime = '') => {
          return parseTimeAPI(totalWorkedTime);
        },
      },
      {
        title: 'No.of overtime hours',
        dataIndex: 'totalOTTime',
        key: 'totalOTTime',
        render: (totalOTTime = '') => {
          return parseTimeAPI(totalOTTime);
        },
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

export default connect(
  ({ loading, timeSheet: { managerTimesheet = [], employeeList = [] } = {} }) => ({
    managerTimesheet,
    employeeList,
    loadingFetchManagerTimesheet: loading.effects['timeSheet/fetchManagerTimesheetEffect'],
  }),
)(TimelineTable);
