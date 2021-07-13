import React, { PureComponent } from 'react';
import { Table, Dropdown, Row, Avatar, Tooltip, Menu, message } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';
import styles from './index.less';

class ProjectHistoryTable extends PureComponent {
  generateColumns = () => {};

  renderTeamColumn = () => {
    const teamColumn = (
      <Avatar.Group
        maxCount={3}
        maxStyle={{
          backgroundColor: 'unset',
        }}
      >
        <Tooltip overlayClassName={styles.teamColumn_toolTip} title="User Name" placement="top">
          <Avatar
            className={styles.teamColumn_avatar}
            src="https://res.cloudinary.com/dqcituopq/image/upload/v1600341724/hrms/smiling-woman-office_23-2147802011_vaf8ir.jpg"
          />
        </Tooltip>
        <Tooltip overlayClassName={styles.teamColumn_toolTip} title="User Name" placement="top">
          <Avatar
            className={styles.teamColumn_avatar}
            src="https://res.cloudinary.com/dqcituopq/image/upload/v1600341723/hrms/gettyimages-1178688517-612x612_w2cyyp.jpg"
          />
        </Tooltip>
        <Tooltip overlayClassName={styles.teamColumn_toolTip} title="User Name" placement="top">
          <Avatar
            className={styles.teamColumn_avatar}
            src="https://res.cloudinary.com/dqcituopq/image/upload/v1600341723/hrms/800px_COLOURBOX3911959_smreob.jpg"
          />
        </Tooltip>
        <Tooltip overlayClassName={styles.teamColumn_toolTip} title="User Name" placement="top">
          <Avatar
            className={styles.teamColumn_avatar}
            src="https://res.cloudinary.com/dqcituopq/image/upload/v1600341723/hrms/gettyimages-1178688517-612x612_w2cyyp.jpg"
          />
        </Tooltip>
      </Avatar.Group>
    );
    return teamColumn;
  };

  renderEngagementColumn = (engagement) => {
    const menu = (
      <Menu onClick={this.onClickItemFilter}>
        <Menu.Item key="1">
          <span>Lest than 1 months</span>
        </Menu.Item>
        <Menu.Item key="2">
          <span>1 Months</span>
        </Menu.Item>
        <Menu.Item key="3">
          <span>2 Months</span>
        </Menu.Item>
        <Menu.Item key="4">
          <span>3 Months</span>
        </Menu.Item>
      </Menu>
    );
    const engagementColumn = (
      <Row className={styles.engagementColumn} justify="space-between" align="middle">
        <span>{engagement}</span>
        <Dropdown overlayStyle={{ width: 200 }} overlay={menu}>
          <EllipsisOutlined
            onClick={this.handleMenuClick}
            className={styles.engagementColumn_menu}
          />
        </Dropdown>
      </Row>
    );
    return engagementColumn;
  };

  onClickItemFilter = ({ key }) => {
    message.info(`Click on item ${key}`);
  };

  renderStatusColumn = (status) => {
    const statusOnGoing = 'Ongoing';
    let className = `${styles.statusColumn}`;
    if (status === statusOnGoing) {
      className += ` ${styles.statusColumn_onGoing}`;
    } else {
      className += ` ${styles.statusColumn_complete}`;
    }
    const statusColumn = <span className={className}>{status}</span>;
    return statusColumn;
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
        render: (team) => this.renderTeamColumn(team),
      },
      {
        title: formatMessage({
          id: 'pages.employeeProfile.performanceHistory.projectHistory.status',
        }),
        dataIndex: 'status',
        key: 'status',
        render: (status) => this.renderStatusColumn(status),
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
        width: '18%',
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
