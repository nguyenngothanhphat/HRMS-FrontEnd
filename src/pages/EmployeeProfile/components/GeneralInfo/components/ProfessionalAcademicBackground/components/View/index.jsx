import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

export default class View extends PureComponent {
  render() {
    const dummyData = [
      { label: 'Previous Job label', value: 'Senior UX Designer' },
      { label: 'Previous Company', value: 'Apple' },
      { label: 'Past Experience', value: '5 Years' },
      { label: 'Total Experience', value: '12 Years' },
      { label: 'Qualification', value: '12th PUC' },
    ];
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        {dummyData.map((item) => (
          <Fragment key={item.label}>
            <Col span={6} className={styles.textLabel}>
              {item.label}
            </Col>
            <Col span={18} className={styles.textValue}>
              {item.value}
            </Col>
          </Fragment>
        ))}
        {/* Custom Col Here */}
      </Row>
    );
  }
}
