import React, { PureComponent } from 'react';
import { Table, Dropdown, Row } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';
import styles from './index.less';

class ProjectHistoryTable extends PureComponent {
  generateColumns = () => {};

  renderColumnTeam = () => {};

  renderEngagementColumn = (engagement) => {
    const engagementColumn = (
      <Row className={styles.engagementColumn} justify="space-between">
        <span>{engagement}</span>
        <Dropdown overlay={this.menu}>
          <EllipsisOutlined
            onClick={this.handleMenuClick}
            className={styles.engagementColumn_menu}
          />
        </Dropdown>
      </Row>
    );
    return engagementColumn;
  };

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
        render: (engagement) => this.renderEngagementColumn(engagement),
        width: '15%',
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
