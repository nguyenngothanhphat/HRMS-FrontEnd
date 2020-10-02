import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Table } from 'antd';
import styles from './index.less';

@connect(({ employeeProfile }) => ({ employeeProfile }))
class ChangeHistoryTable extends PureComponent {
  constructor(props) {
    super(props);
    const { employeeProfile } = this.props;
    this.state = {
      employee:
        employeeProfile.originData.generalData.legalName ||
        employeeProfile.originData.generalData.firstName,
    };
  }

  generateColumns = () => {
    const { employee } = this.state;
    const columns = [
      {
        title: 'Changed Infomation',
        dataIndex: 'changedInfomation',
        key: 'changedInfomation',
        render: (changedInfomation) => (
          <div>
            <span>
              {employee} is promoted to {changedInfomation.promotedPosition} postion
            </span>
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
    const { employeeProfile } = this.props;

    const newData = employeeProfile.originData.changeHistories.map((item, index) => ({
      key: `${index + 1}`,
      changedInfomation: {
        promotedPosition:
          item.title?.name || employeeProfile.originData.employmentData.title?.name || 'Loading...',
        salary: item.salary || employeeProfile.originData.compensationData.currentAnnualCTC || 0,
        location: item.location?.name || employeeProfile.originData.employmentData.location?.name,
      },
      effectiveDate: moment(item.effectiveDate).locale('en').format('Do MMMM YYYY'),
      changedBy: 'HR Admin',
      changedDate: moment(item.changeDate).locale('en').format('Do MMMM YYYY'),
      action: index === 0 ? 'Revoke' : '',
    }));

    return (
      <div className={styles.changeHistoryTable}>
        <Table
          size="small"
          columns={this.generateColumns()}
          dataSource={newData}
          pagination={false}
        />
      </div>
    );
  }
}

export default ChangeHistoryTable;
