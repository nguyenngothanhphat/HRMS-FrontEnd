import { Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { isTheSameDay } from '@/utils/timeSheet';
import EmptyComponent from '@/components/Empty';
import styles from './index.less';

const TaskTable = (props) => {
  const { list = [], selectedDate = '', loading = false, dispatch, importingIds = [] } = props;
  const [selectedTask, setSelectedTask] = useState([]);

  useEffect(() => {
    const selectRowsRedux = importingIds.find((v) => isTheSameDay(v.date, selectedDate));
    if (selectRowsRedux) {
      setSelectedTask(selectRowsRedux.selectedIds.map((v) => v.id));
    }
  }, [JSON.stringify(list)]);

  const generateColumns = () => {
    return [
      {
        title: 'Project',
        dataIndex: 'projectName',
        key: 'projectName',
        render: (projectName) => <span className={styles.boldText}>{projectName}</span>,
        width: '25%',
      },
      {
        title: 'Task',
        dataIndex: 'taskName',
        key: 'taskName',
        width: '25%',
      },
      {
        title: 'Description',
        dataIndex: 'notes',
        key: 'notes',
      },
    ];
  };

  const saveImportingIds = (selectedIds) => {
    dispatch({
      type: 'timeSheet/saveImportingIds',
      payload: {
        selectedIds,
        date: selectedDate,
      },
    });
  };

  const onSelectChange = (selectedRowKeys) => {
    const arr = list.filter((v) => selectedRowKeys.includes(v.id));
    saveImportingIds(arr);
    setSelectedTask(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys: selectedTask,
    onChange: onSelectChange,
  };

  return (
    <>
      <div className={styles.TaskTable}>
        <Table
          size="small"
          locale={{
            emptyText: (
              <EmptyComponent
                height={227}
                description={`The sheet for ${moment(selectedDate)
                  .locale('en')
                  .format('ddd, MMMM Do')} is empty!`}
              />
            ),
          }}
          columns={generateColumns()}
          dataSource={list}
          loading={loading}
          pagination={false}
          rowSelection={rowSelection}
          rowKey={(row) => row.id}
          scroll={{ y: 245 }}
        />
      </div>
    </>
  );
};

// export default TaskTable;
export default connect(() => ({}))(TaskTable);
