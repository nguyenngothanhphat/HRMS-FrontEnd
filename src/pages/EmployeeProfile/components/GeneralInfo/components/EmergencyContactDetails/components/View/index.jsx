import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

class View extends PureComponent {
  render() {
    const { dataAPI } = this.props;
    const dummyData = [
      { label: 'Emergency Contact', value: dataAPI.emergencyContact },
      { label: 'Person’s Name', value: dataAPI.emergencyPersonName },
      { label: 'Relation', value: dataAPI.emergencyRelation },
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
      </Row>
    );
  }
}

export default View;
