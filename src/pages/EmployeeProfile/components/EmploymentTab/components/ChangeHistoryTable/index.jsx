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
        render: (changedInfomation) => {
          const info = changedInfomation;
          const keys = Object.keys(info);
          for (let i = 0; i < keys.length; i += 1) {
            if (info[keys[i]] === undefined) delete info[keys[i]];
          }
          return (
            <div>
              {info.promotedPosition ? (
                <div>
                  {employee} is promoted to {info.promotedPosition} postion
                </div>
              ) : null}

              {info.location ? <div>Location: {info.location}</div> : null}
              {info.deparment ? (
                <div>
                  {employee} switched to department: {info.deparment}
                </div>
              ) : null}
              {info.employment ? (
                <div>
                  New employment: <b>{info.employment}</b>
                </div>
              ) : null}
              {info.compensation ? (
                <div>
                  New payment: <b>{info.compensation}</b>
                </div>
              ) : null}
              {info.manager ? (
                <div>
                  {employee} is now reporting to: <b>{info.manager}</b>
                </div>
              ) : null}
              {Object.keys(info).length === 0 ? <b>Nothing changed</b> : null}
            </div>
          );
        },
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
        promotedPosition: item.title?.name,
        location: item.location?.name,
        department: item.department?.name,
        employment: item.employeeType?.name,
        compensation: item.compensationType,
        manager: item.manager?.generalInfo.legalName || item.manager?.generalInfo.firstName,
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
