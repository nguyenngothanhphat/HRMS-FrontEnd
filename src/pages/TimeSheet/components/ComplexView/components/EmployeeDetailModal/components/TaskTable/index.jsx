import React, { useState } from 'react';
import { connect } from 'umi';
import CommonTable from '@/components/CommonTable';
import EmptyLine2 from '@/assets/timeSheet/emptyLine2.svg';
import styles from './index.less';

const TaskTable = (props) => {
  const { list = [] } = props;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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
        showPagination={false}
        selectable
        scrollable
        rowKey="id"
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      />
    </div>
  );
};

// export default TaskTable;
export default connect(() => ({}))(TaskTable);
