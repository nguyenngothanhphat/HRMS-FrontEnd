import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { formatMessage } from 'umi';
import styles from './index.less';

class ProjectHistoryTable extends PureComponent {
  generateColumns = () => {};

  renderColumnTeam = () => {};

  render() {
    const columns = [
      {
        title: formatMessage({
          id: 'pages.employeeProfile.performanceHistory.projectHistory.projectName',
        }),
        dataIndex: 'projectName',
        key: 'projectName',
      },
      {
        title: formatMessage({
          id: 'pages.employeeProfile.performanceHistory.projectHistory.team',
        }),
        dataIndex: 'team',
        key: 'team',
      },
      {
        title: formatMessage({
          id: 'pages.employeeProfile.performanceHistory.projectHistory.status',
        }),
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: formatMessage({
          id: 'pages.employeeProfile.performanceHistory.projectHistory.projectDuration',
        }),
        dataIndex: 'projectDuration',
        key: 'projectDuration',
      },
      {
        title: formatMessage({
          id: 'pages.employeeProfile.performanceHistory.projectHistory.engagement',
        }),
        dataIndex: 'engagement',
        key: 'engagement',
      },
    ];

    const { list } = this.props;

    return (
      <div className={styles.projectHistoryTable}>
        <Table size="small" dataSource={list} columns={columns} pagination={false} />
      </div>
    );
  }
}

export default ProjectHistoryTable;
