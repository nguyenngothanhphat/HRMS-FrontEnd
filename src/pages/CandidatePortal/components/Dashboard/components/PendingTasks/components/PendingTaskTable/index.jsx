import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { Link } from 'umi';
import { taskStatus } from '@/utils/candidatePortal';
import styles from './index.less';

class PendingTaskTable extends PureComponent {
  renderItem = (item, listLength, index) => {
    return (
      <div key={index}>
        <Row span={24} className={styles.eachItem} align="middle">
          <Col span={16}>
            {item.status === taskStatus.IN_PROGRESS ? (
              <Link to={`/candidate-portal/ticket/${item.link}`}>{item.name}</Link>
            ) : (
              <span>{item.name}</span>
            )}
          </Col>
          <Col span={8}>
            <span>{item.dueDate}</span>
          </Col>
        </Row>
        {index + 1 < listLength && <div className={styles.divider} />}
      </div>
    );
  };

  getData = () => {
    const { tasks = [], sliceNumber = 0 } = this.props;
    const tempTasks = tasks.filter(
      (t) => ![taskStatus.DONE, taskStatus.UPCOMING].includes(t.status),
    );
    if (sliceNumber === 0 || !sliceNumber) return tempTasks;
    return tempTasks.slice(0, sliceNumber);
  };

  render() {
    const data = this.getData();

    return (
      <div className={styles.PendingTaskTable}>
        <div className={styles.taskContainer}>
          <Row className={styles.taskTableHeader} align="middle">
            <Col span={16}>
              <span>Name</span>
            </Col>
            <Col span={8}>
              <span>Due Date</span>
            </Col>
          </Row>
          <div className={styles.taskTableContent}>
            {data.map((val, index) => this.renderItem(val, data.length, index))}
          </div>
        </div>
      </div>
    );
  }
}

export default PendingTaskTable;
