import { Col, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import TaskCard from '../TaskCard';
import styles from './index.less';

const TaskTable = (props) => {
  const { list = [] } = props;

  const renderHeader = () => {
    return (
      <Row className={styles.tableHeader}>
        <Col span={8} className={styles.title}>
          Department
        </Col>
        <Col span={16} className={styles.groupCell}>
          <Row className={styles.groupRow}>
            <Col span={12} className={styles.title}>
              Resources
            </Col>
            <Col span={12} className={`${styles.title} ${styles.alignCenter}`}>
              Time taken
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  const renderTable = () => {
    if (list.length === 0) {
      return <div className={styles.emptyContent}>No data</div>;
    }
    return (
      <div className={styles.content}>
        {list.map((m, i) => (
          <TaskCard card={m} index={i} />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className={styles.TaskTable}>
        {renderHeader()}
        {renderTable()}
      </div>
    </>
  );
};

// export default TaskTable;
export default connect(() => ({}))(TaskTable);
