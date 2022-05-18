import React from 'react';
import { connect } from 'umi';
import CommonTable from '@/components/CommonTable';
import EmptyLine2 from '@/assets/timeSheet/emptyLine2.svg';
import styles from './index.less';

const TaskTable = (props) => {
  const { list = [], selectedRowKeys = [], setSelectedRowKeys = () => {} } = props;

  const generateColumns = () => {
    return [
      {
        title: 'Date',
        key: 'date',
        dataIndex: 'date',
        render: (date) => <span className={styles.boldText}>{date}</span>,
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
        key: 'leave',
        dataIndex: 'leave',
      },
      {
        title: 'Notes',
        key: 'notes',
        dataIndex: 'notes',
        render: (notes) => notes || <img src={EmptyLine2} alt="" />,
      },
    ];
  };

  return (
    <div className={styles.TaskTable}>
      <CommonTable
        list={list}
        columns={generateColumns()}
        showPagination
        selectable
        scrollable
        rowKey="date"
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      />
    </div>
  );
};

// export default TaskTable;
export default connect(() => ({}))(TaskTable);
