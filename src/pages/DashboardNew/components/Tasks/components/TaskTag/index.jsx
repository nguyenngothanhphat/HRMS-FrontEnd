import { Row, Col, Checkbox } from 'antd';
import React from 'react';
import { connect } from 'umi';
import MockAvatar from '@/assets/dashboard/mockAvatar.jpg';
import styles from './index.less';

const TaskTag = (props) => {
  const { task: taskProp } = props;

  // FUNCTIONS
  const getColorClassName = (type) => {
    const typeTemp = type.toLowerCase();
    switch (typeTemp) {
      case 'medium':
        return styles.greenTag;
      case 'high':
        return styles.orangeTag;
      case 'completed':
        return styles.violetTag;
      default:
        return styles.greenTag;
    }
  };

  // RENDER UI
  const renderTag = (task) => {
    return (
      <Col span={24}>
        <div className={styles.TaskTag}>
          <Row align="top" justify="space-between">
            <Col span={16} className={styles.leftPart}>
              <Checkbox className={styles.taskName}>{task.name}</Checkbox>
              <div className={styles.taskDescription}>
                <span>{task.description}</span>
                <div className={styles.employeeTag}>
                  <img src={MockAvatar} alt="" />
                  <span>Aditya Venkatesan</span>
                </div>
              </div>
            </Col>
            <Col span={8} className={styles.rightPart}>
              <div className={`${styles.progressTag} ${getColorClassName(task.status)}`}>
                {task.status}
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    );
  };

  return renderTag(taskProp);
};

export default connect(() => ({}))(TaskTag);
