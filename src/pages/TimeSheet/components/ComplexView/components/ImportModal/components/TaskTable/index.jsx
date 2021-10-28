import { Empty, Table } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect } from 'umi';
import EmptyImage from '@/assets/timeSheet/emptyImage.png';
import styles from './index.less';

const TaskTable = (props) => {
  const { list = [], selectedDate = '', loading = false } = props;
  const [selectedTask, setSelectedTask] = useState([]);

  const generateColumns = () => {
    return [
      {
        title: 'Project',
        dataIndex: 'project',
        key: 'project',
        render: (project) => <span className={styles.boldText}>{project}</span>,
      },
      {
        title: 'Task',
        dataIndex: 'task',
        key: 'task',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
    ];
  };

  const onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedTask(selectedRowKeys);
  };

  const rowSelection = {
    selectedTask,
    onChange: onSelectChange,
  };

  return (
    <>
      <div className={styles.TaskTable}>
        <Table
          size="small"
          locale={{
            emptyText: (
              <Empty
                description={`The sheet for ${moment(selectedDate)
                  .locale('en')
                  .format('ddd, MMMM Do')} is empty!`}
                image={EmptyImage}
              />
            ),
          }}
          columns={generateColumns()}
          dataSource={list}
          loading={loading}
          pagination={false}
          rowSelection={rowSelection}
          rowKey={(row) => row.id}
        />
      </div>
    </>
  );
};

// export default TaskTable;
export default connect(() => ({}))(TaskTable);
