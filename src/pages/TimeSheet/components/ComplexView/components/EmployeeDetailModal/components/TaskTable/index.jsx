import React, { useState } from 'react';
import { connect } from 'umi';
import CommonTable from '@/components/CommonTable';
import styles from './index.less';

const mockData = [
  {
    id: 1,
    date: '01 Feb, Mon',
    inTime: '10:00',
    outTime: '12:00',
    leaves: 0,
    notes: 'Talk with PM',
  },
  {
    id: 2,
    date: '01 Feb, Mon',
    inTime: '10:00',
    outTime: '12:00',
    leaves: 0,
    notes: '',
  },
  {
    id: 3,
    date: '01 Feb, Mon',
    inTime: '10:00',
    outTime: '12:00',
    leaves: 0,
    notes: 'Talk with PM',
  },
  {
    id: 4,
    date: '01 Feb, Mon',
    inTime: '10:00',
    outTime: '12:00',
    leaves: 0,
    notes: '',
  },
];

const TaskTable = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const generateColumns = () => {
    return [
      {
        title: 'Date',
        key: 'date',
        dataIndex: 'date',
      },
      {
        title: 'In Time',
        key: 'inTime',
        dataIndex: 'inTime',
      },
      {
        title: 'Out Time',
        key: 'outTime',
        dataIndex: 'outTime',
      },
      {
        title: 'Leaves',
        key: 'leaves',
        dataIndex: 'leaves',
      },
      {
        title: 'Notes',
        key: 'notes',
        dataIndex: 'notes',
        render: (notes) => notes || '-',
      },
    ];
  };

  return (
    <div className={styles.TaskTable}>
      <CommonTable
        list={mockData}
        columns={generateColumns()}
        showPagination={false}
        selectable
        rowKey="id"
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      />
    </div>
  );
};

// export default TaskTable;
export default connect(() => ({}))(TaskTable);
