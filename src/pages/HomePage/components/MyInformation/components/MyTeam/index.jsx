import { Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import EmployeeCard from './components/EmployeeCard';
import styles from './index.less';

const MyTeam = (props) => {
  const { myTeam = [], employee = {} } = props;

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
    location: { companyLocationList = [] } = {},
    user: { currentUser: { roles = [], employee = {} } = {} } = {},
  }) => ({
    roles,
    employee,
    myTeam,
    companyLocationList,
  }),
)(MyTeam);
