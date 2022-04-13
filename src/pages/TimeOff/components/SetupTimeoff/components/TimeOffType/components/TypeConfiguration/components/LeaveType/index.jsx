import { Card } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const LeaveType = (props) => {
  const { dispatch } = props;

  return (
    <Card title="Overview" className={styles.LeaveType}>
      Hello
    </Card>
  );
};
export default connect(() => ({}))(LeaveType);
