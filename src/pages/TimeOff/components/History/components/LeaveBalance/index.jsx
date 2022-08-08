import { Col, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import CommonTable from '@/components/CommonTable';
import IconLeaveCategory from '@/assets/employeeProfile/ic_leave_category.svg';
import LeaveInformation from '../LeaveInformation';
import styles from './index.less';

const LeaveBalance = ({ data, loading }) => {
  const getColumns = () => {
    const getRowSpan = (type) => {
      let sum = 0;
      let firstIndex;
      let lastIndex = 0;
      data.forEach((item, idx) => {
        if (item.type === type) {
          if (firstIndex === undefined) firstIndex = idx;
          sum += 1;
          lastIndex = idx;
        }
      });

      return { sum, firstIndex, lastIndex };
    };

    const columns = [
      {
        title: 'Leave Category',
        dataIndex: 'typeName',
        key: 'typeName',
        render: (typeName, row, index) => {
          const { type } = row;
          const children = (
            <div className={styles.leaveCategory}>
              <img src={IconLeaveCategory} width={16} height={16} alt="" />
              <span className={styles.leaveCategoryName}> {typeName}</span>
            </div>
          );
          const props = {};

          const { sum, firstIndex, lastIndex } = getRowSpan(type);
          if (index === firstIndex) props.rowSpan = sum;
          else if (index <= lastIndex) props.rowSpan = 0;

          return {
            children,
            props,
          };
        },
      },
      {
        title: 'Leave Type',
        dataIndex: 'name',
        key: 'name',
        render: (name) => <span>{name}</span>,
      },
      {
        title: 'Total Remaining',
        dataIndex: 'total',
        key: 'total',
        align: 'center',
        render: (_, row) => {
          const { total, taken } = row;
          return <span className={styles.totalValue}>{total - taken}</span>;
        },
      },
      {
        title: 'Total Accrued',
        dataIndex: 'total',
        key: 'total',
        editable: 'true',
        align: 'center',
        render: (total) => {
          return <span className={styles.totalValue}>{total}</span>;
        },
      },
      {
        title: 'Total Taken',
        dataIndex: 'taken',
        key: 'taken',
        editable: 'true',
        align: 'center',
        render: (taken) => {
          return <span className={styles.totalValue}>{taken}</span>;
        },
      },
    ];
    return columns;
  };

  return (
    <Row className={styles.LeaveBalance}>
      <Col span={6} className={styles.leaveInfoContainer}>
        <LeaveInformation />
      </Col>
      <Col span={18} className={styles.leaveTableContainer}>
        <CommonTable list={data} columns={getColumns()} showPagination={false} loading={loading} />
      </Col>
    </Row>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['timeOff/fetchTimeOffTypeByEmployeeEffect'],
}))(LeaveBalance);
