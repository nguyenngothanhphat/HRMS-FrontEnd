import { Empty, Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import EmptyImage from '@/assets/timeSheet/emptyImage.png';
import { isTheSameDay } from '@/utils/timeSheet';
import styles from './index.less';

const TaskTable = (props) => {
  const { list = [], selectedDate = '', loading = false, dispatch, importingIds = [] } = props;
  const [selectedTask, setSelectedTask] = useState([]);

  useEffect(() => {
    const selectRowsRedux = importingIds.find((v) => isTheSameDay(v.date, selectedDate));
    if (selectRowsRedux) {
      setSelectedTask(selectRowsRedux.selectedIds);
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
    saveImportingIds(selectedRowKeys);
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
          scroll={{ y: 245 }}
        />
      </div>
    </>
  );
};

// export default TaskTable;
export default connect(() => ({}))(TaskTable);
