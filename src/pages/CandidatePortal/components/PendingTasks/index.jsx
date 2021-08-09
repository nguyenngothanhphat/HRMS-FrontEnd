import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

const pendingTasks = [
  {
    name: 'Review Profile',
    dueDate: '30 July 2021',
  },
  {
    name: 'Upload Documents ',
    dueDate: '30 July 2021',
  },
  {
    name: 'Employee Details form',
    dueDate: '30 July 2021',
  },
  {
    name: 'Offer Acceptance Form',
    dueDate: '30 July 2021',
  },
];

class PendingTasks extends PureComponent {
  renderItem = (item, listLength, index) => {
    return (
      <>
        <Row span={24} className={styles.eachItem} align="middle">
          <Col span={16}>
            <span>{item.name}</span>
          </Col>
          <Col span={8}>
            <span>{item.dueDate}</span>
          </Col>
        </Row>
        {index + 1 < listLength && <div className={styles.divider} />}
      </>
    );
  };

  render() {
    return (
      <div className={styles.PendingTasks}>
        <div>
          <div className={styles.header}>
            <span>Pending Tasks</span>
          </div>
          <div className={styles.content}>
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
                {pendingTasks.map((val, index) => this.renderItem(val, pendingTasks.length, index))}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.viewMoreBtn}>
          <span>View All</span>
        </div>
      </div>
    );
  }
}

export default PendingTasks;
