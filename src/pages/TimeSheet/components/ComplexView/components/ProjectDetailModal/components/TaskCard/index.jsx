import { Col, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const TaskCard = (props) => {
  const { card: { task = '', description = '', department = '', taskList = [] } = {} } = props;

  // MAIN AREA
  return (
    <div className={styles.TaskCard}>
      <Row>
        <Col span={4} className={styles.normalCell}>
          {department}
        </Col>
        <Col span={4} className={styles.normalCell}>
          {task}
        </Col>
        <Col span={4} className={styles.normalCell}>
          {description}
        </Col>
        <Col span={12} className={styles.groupCell}>
          {taskList.map((x) => {
            return (
              <Row className={styles.groupRow}>
                <Col span={8} className={styles.normalCell}>
                  {x.resources}
                </Col>
                <Col span={8} className={`${styles.normalCell} ${styles.alignCenter}`}>
                  {x.timeTaken}
                </Col>
                <Col span={8} className={`${styles.normalCell} ${styles.alignCenter}`}>
                  {x.totalTime}
                </Col>
              </Row>
            );
          })}
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({ employee }))(
  TaskCard,
);
