import { Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import EmployeeCard from './components/EmployeeCard';
import styles from './index.less';

const Resources = (props) => {
  const { data = [] } = props;
  return (
    <div className={styles.Resources}>
      <Row gutter={[24, 24]}>
        {data.map((employee) => (
          <EmployeeCard employee={employee} />
        ))}
      </Row>
    </div>
  );
};

export default connect(() => ({}))(Resources);
