import { Card } from 'antd';
import React from 'react';
import { Link } from 'umi';
import { getEmployeeName } from '@/utils/offboarding';
import CommonTable from '@/components/CommonTable';
import styles from './index.less';

const CurrentProjectDetails = (props) => {
  const { projectList = [] } = props;

  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Project Manager',
      dataIndex: 'manager',
      key: 'manager',
      render: (manager = {}) => {
        return (
          <Link to={`/directory/employee-profile/${manager._id}`}>
            {getEmployeeName(manager.generalInfo)}
          </Link>
        );
      },
    },
  ];
  return (
    <Card title="Requestee details" className={styles.CurrentProjectDetails}>
      <div className={styles.content}>
        <CommonTable list={projectList} columns={columns} />
      </div>
    </Card>
  );
};

export default CurrentProjectDetails;
