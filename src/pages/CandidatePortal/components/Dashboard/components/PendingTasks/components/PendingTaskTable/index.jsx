import { Col, Row } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { Link } from 'umi';
import { CANDIDATE_TASK_STATUS } from '@/utils/candidatePortal';
import styles from './index.less';

class PendingTaskTable extends PureComponent {
  renderItem = (item, listLength, index) => {
    return (
      <div key={index}>
        <Row span={24} className={styles.eachItem} align="middle">
          <Col span={16}>
            {item.status === CANDIDATE_TASK_STATUS.IN_PROGRESS ? (
              <Link to={`/candidate-portal/ticket/${item.link}`}>{item.name}</Link>
            ) : (
              <span>{item.name}</span>
            )}
          </Col>
          <Col span={8}>
            <span>{item.dueDate ? moment(item.dueDate).format('MM/DD/YYYY') : '-'}</span>
          </Col>
        </Row>
        {index + 1 <= listLength && <div className={styles.divider} />}
      </div>
    );
  };

  renderTasks = () => {
    const data = this.getData();
    if (data.length > 0) {
      return (
        <div className={styles.taskTableContent}>
          {data.map((val, index) => this.renderItem(val, data.length, index))}
        </div>
      );
    }
    return (
      <div className={styles.emptyTableContent}>
        <span>You have no pending tasks</span>
      </div>
    );
  };

  getData = () => {
    const { tasks = [], sliceNumber = 0 } = this.props;
    const tempTasks = tasks.filter(
      (t) => ![CANDIDATE_TASK_STATUS.DONE, CANDIDATE_TASK_STATUS.UPCOMING].includes(t.status),
    );
    if (sliceNumber === 0 || !sliceNumber) return tempTasks;
    return tempTasks.slice(0, sliceNumber);
  };

  render() {
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
          {this.renderTasks()}
        </div>
      </div>
    );
  }
}

export default PendingTaskTable;
