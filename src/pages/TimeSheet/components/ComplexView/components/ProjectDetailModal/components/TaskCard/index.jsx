import { Col, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const TaskCard = (props) => {
  const { card: {  department = '', projectMembers = [] } = {} } =
    props;

  // MAIN AREA
  return (
    <div className={styles.TaskCard}>
      <Row>
        <Col span={8} className={styles.normalCell}>
          {department}
        </Col>
        <Col span={16} className={styles.groupCell}>
          {projectMembers.map((x) => {
            return (
              <Row className={styles.groupRow}>
                <Col span={12} className={styles.normalCell}>
                  {x.legalName}
                </Col>
                <Col span={12} className={`${styles.normalCell} ${styles.alignCenter}`}>
                  {x.userSpentTimeInHours}hrs
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
