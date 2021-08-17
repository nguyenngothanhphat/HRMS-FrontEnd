import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

class PendingTaskTable extends PureComponent {
  renderItem = (item, listLength, index) => {
    return (
      <div key={index}>
        <Row span={24} className={styles.eachItem} align="middle">
          <Col span={16}>
            <span>{item.name}</span>
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
    if (sliceNumber === 0 || !sliceNumber) return tasks;
    return tasks.slice(0, sliceNumber);
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
