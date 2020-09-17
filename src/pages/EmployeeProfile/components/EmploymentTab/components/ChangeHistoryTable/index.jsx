import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './index.less';

class ChangeHistoryTable extends PureComponent {
  generateColumns = () => {
    const columns = [
      {
        title: 'Changed Infomation',
        dataIndex: 'changedInfomation',
        key: 'changedInfomation',
        render: (changedInfomation) => (
          <div>
            <span>Aditya is promoted to {changedInfomation.promotedPosition} postion</span>
            <br />
            <span>
              Revised Salary: <b>{changedInfomation.salary}</b>
            </span>
            <br />
            <span>Location: {changedInfomation.location}</span>
          </div>
        ),
        align: 'left',
        width: '25%',
      },
      {
        title: 'Effective Date',
        dataIndex: 'effectiveDate',
        key: 'effectiveDate',
        align: 'left',
      },
      {
        title: 'Changed By',
        dataIndex: 'changedBy',
        key: 'changedBy',
        align: 'left',
      },
      {
        title: 'Changed Date',
        key: 'changedDate',
        dataIndex: 'changedDate',
        align: 'left',
        render: (changedDate) => <span>{changedDate}</span>,
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'left',
        render: (action) => <span className={styles.changeHistoryTable_action}>{action}</span>,
      },
    ];

    return columns.map((col) => ({
      ...col,
      title: col.title,
    }));
  };

  render() {
    const data = [
      {
        key: '1',
        changedInfomation: {
          promotedPosition: 'UX Manager',
          salary: '$100000',
          location: 'Calfornia',
        },
        effectiveDate: '21th December 2019',
        changedBy: 'HR Admin',
        changedDate: '10th December 2019',
        action: 'Revoke',
      },
      {
        key: '2',
        changedInfomation: {
          promotedPosition: 'UX Lead',
          salary: '$750000',
          location: 'Calfornia',
        },
        effectiveDate: '10th December 2019',
        changedBy: 'HR Admin',
        changedDate: '21st November 2019',
        action: '',
      },
    ];
    return (
      <div className={styles.changeHistoryTable}>
        <Table size="small" columns={this.generateColumns()} dataSource={data} pagination={false} />
      </div>
    );
  }
}

export default ChangeHistoryTable;
