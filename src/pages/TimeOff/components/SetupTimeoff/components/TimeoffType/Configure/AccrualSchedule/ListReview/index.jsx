import React, { Component } from 'react';
import { Table } from 'antd';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import styles from './index.less';

class ListSpentTime extends Component {
  onChange = () => {};

  render() {
    const data = [
      {
        key: '1',
        schedulePeriod: '01/01/2020 - 31/12/2020',
        accrualDate: '31/12/2020',
        accrualAmount: '10 days',
      },
    ];

    const columns = [
      {
        title: <span className={styles.scheduleTitle}>Schedule Period</span>,
        key: 'schedulePeriod',
        dataIndex: 'schedulePeriod',
        align: 'left',
        // render: (schedulePeriod) => {
        //   return <p>{schedulePeriod}</p>;
        // },
      },
      {
        title: <span className={styles.scheduleTitle}>Accrual date</span>,
        key: 'accrualDate',
        dataIndex: 'accrualDate',
        align: 'left',
        // render: (accrualDate) => {
        //   return <p>{accrualDate}</p>;
        // },
      },
      {
        title: <span className={styles.scheduleTitle}>Accrual amount</span>,
        key: 'accrualAmount',
        dataIndex: 'accrualAmount',
        align: 'right',
        // render: (accrualAmount) => {
        //   return <p>{accrualAmount}</p>;
        // },
      },
    ];

    return (
      <div className={styles.root}>
        <div className={styles.previewTitle}>Accrual schedule preview</div>
        <div className={styles.accrualScheduleTbl}>
          <Table
            locale={{
              emptyText: (
                <div className={styles.viewEmpty}>
                  <img src={empty} alt="empty data" />
                  <p className={styles.textEmpty}>Empty Data</p>
                </div>
              ),
            }}
            columns={columns}
            dataSource={data}
            hideOnSinglePage
          />
        </div>
      </div>
    );
  }
}

export default ListSpentTime;
