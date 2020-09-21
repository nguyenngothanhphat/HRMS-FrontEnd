import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { formatMessage } from 'umi';
import styles from './index.less';

class ProjectHistoryTable extends PureComponent {
  generateColumns = () => {};

  renderColumnTeam = () => {};

  render() {
    const dataSource = [
      {
        key: '1',
        projectName: 'MyGiis Singapore',
        team: 32,
        status: 'Ongoing',
        projectDuration: '27 Feb 2020 - Present',
        engagement: '4 Months',
      },
      {
        key: '2',
        projectName: 'Udaan',
        team: 42,
        status: 'Complete',
        projectDuration: '27 Feb 2020 - Present',
        engagement: '4 Months',
      },
      {
        key: '3',
        projectName: 'Hukoomi',
        team: 42,
        status: 'Complete',
        projectDuration: '27 Feb 2020 - Present',
        engagement: '4 Months',
      },
      {
        key: '4',
        projectName: 'Kotak',
        team: 42,
        status: 'Ongoing',
        projectDuration: '27 Feb 2020 - Present',
        engagement: '4 Months',
      },
    ];

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

    return (
      <div className={styles.projectHistoryTable}>
        <Table size="small" dataSource={dataSource} columns={columns} pagination={false} />
      </div>
    );
  }
}

export default ProjectHistoryTable;
