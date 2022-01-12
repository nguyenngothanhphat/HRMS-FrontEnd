import { Row } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import EmployeeCard from './components/EmployeeCard';
import styles from './index.less';
import { getCurrentTenant } from '@/utils/authority';

const MyTeam = (props) => {
  const { dispatch, myTeam = [], employee = {} } = props;

  useEffect(() => {
    const roleEmployee = employee && employee?.title ? employee.title.roles : [];
    const employeeId = employee ? employee._id : '';
    const companyInfo = employee ? employee.company : {};
    dispatch({
      type: 'dashboard/fetchMyTeam',
      payload: {
        tenantId: getCurrentTenant(),
        roles: roleEmployee,
        employee: employeeId,
        status: ['ACTIVE'],
        company: [companyInfo],
      },
    });
  }, []);

  return (
    <div className={styles.MyTeam}>
      <Row gutter={[24, 24]}>
        {myTeam.map((x) => (
          <EmployeeCard employee={x} isMySelf={employee?._id === x._id} />
        ))}
      </Row>
    </div>
  );
};

export default connect(
  ({
    dashboard: { myTeam = [] } = {},
    locationSelection: { listLocationsByCompany = [] } = {},
    user: { currentUser: { roles = [], employee = {} } = {} } = {},
  }) => ({
    roles,
    employee,
    myTeam,
    listLocationsByCompany,
  }),
)(MyTeam);
