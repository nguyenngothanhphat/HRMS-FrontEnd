import { Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import TaskTag from '../TaskTag';
import styles from './index.less';

const mockTask = [
  {
    id: 1,
    name: 'Performance evaluation',
    description: 'one - one with',
    status: 'Medium',
  },
  {
    id: 2,
    name: 'Udaan',
    description: 'Update the documentation + Client call + Presentation + UI Support  - one with',
    status: 'High',
  },
  {
    id: 3,
    name: 'Byjus',
    description: 'one - one with',
    status: 'Completed',
  },
];

const MyTasks = (props) => {
  const { isInModal = false } = props;

  return (
    <div className={styles.MyTasks} style={isInModal ? { maxHeight: '600px' } : {}}>
      <Row gutter={[16, 16]}>
        {mockTask.map((task) => {
          return <TaskTag task={task} />;
        })}
      </Row>
    </div>
  );
};

export default connect(() => ({}))(MyTasks);
