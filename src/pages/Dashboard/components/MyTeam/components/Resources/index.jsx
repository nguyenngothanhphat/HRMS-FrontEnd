import { Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import EmployeeCard from './components/EmployeeCard';
import Empty from '@/components/Empty';
import Icon from '@/assets/timeOffTableEmptyIcon.svg';
import styles from './index.less';

const Resources = (props) => {
  const { data = [] } = props;
  if (data.length === 0)
    return (
      <div className={styles.Resources}>
        <Empty image={Icon} />
      </div>
    );
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
