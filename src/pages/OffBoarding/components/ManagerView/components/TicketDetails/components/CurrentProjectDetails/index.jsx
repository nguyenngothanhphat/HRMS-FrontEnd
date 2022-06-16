import { Card } from 'antd';
import React, { useEffect } from 'react';
import { Link, connect } from 'umi';
import { getEmployeeName } from '@/utils/offboarding';
import CommonTable from '@/components/CommonTable';
import styles from './index.less';

const CurrentProjectDetails = ({
  dispatch,
  item = {},
  offboarding,
  loadingFetchEmployeeProjects = false,
}) => {
  const { employee = {} } = item;
  const { employeeProjects = [] } = offboarding;

  const fetchEmployeeProjects = () => {
    dispatch({
      type: 'offboarding/fetchEmployeeProjectEffect',
      payload: {
        employee: employee?._id,
      },
    });
  };

  useEffect(() => {
    if (employee?._id) {
      fetchEmployeeProjects();
    }
  }, [employee?._id]);

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
    <Card title="Current Project details" className={styles.CurrentProjectDetails}>
      <div className={styles.content}>
        <CommonTable
          list={employeeProjects}
          columns={columns}
          loading={loadingFetchEmployeeProjects}
        />
      </div>
    </Card>
  );
};

export default connect(({ offboarding, loading }) => ({
  offboarding,
  loadingFetchEmployeeProjects: loading.effects['offboarding/fetchEmployeeProjectEffect'],
}))(CurrentProjectDetails);
