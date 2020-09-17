import React, { PureComponent, Fragment } from 'react';
import { Card, Row, Col } from 'antd';
import styles from './index.less';

class PerformanceReview extends PureComponent {
  render() {
    const dummyData = [
      { id: 1, label: 'Date', value: '12th Dec 2020' },
      { id: 2, label: 'Reporting to', value: 'Anil Reddy' },
      { id: 3, label: 'Collaboration & TeamWork' },
      { id: 4, label: 'Problem solving' },
      { id: 5, label: 'Problem solving' },
      { id: 5, label: 'Organising and Planning' },
    ];
    return (
      <div className={styles.performanceReview}>
        <Card className={styles.performanceReview_card} title="Performance Reviews">
          <Row gutter={[16, 16]} className={styles.root}>
            {dummyData.map((item) => (
              <Fragment key={item.id}>
                <Col span={6} className={styles.textLabel}>
                  {item.label}
                </Col>
                <Col span={18} className={styles.textValue}>
                  {item.value}
                </Col>
              </Fragment>
            ))}
          </Row>
        </Card>
      </div>
    );
  }
}

export default PerformanceReview;
