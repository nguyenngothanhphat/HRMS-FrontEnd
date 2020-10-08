import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

class View extends PureComponent {
  render() {
    const { location } = this.props;
    return (
      <div className={styles.view}>
        <Row gutter={[0, 16]} className={styles.root}>
          <>
            <Col span={6} className={styles.textLabel}>
              Address
            </Col>
            <Col span={18} className={styles.textValue}>
              {location.address}
            </Col>
            <Col span={6} className={styles.textLabel}>
              State
            </Col>
            <Col span={18} className={styles.textValue}>
              {location.state}
            </Col>
            <Col span={6} className={styles.textLabel}>
              Country
            </Col>
            <Col span={18} className={styles.textValue}>
              {location.country}
            </Col>
            <Col span={6} className={styles.textLabel}>
              ZipCode
            </Col>
            <Col span={18} className={styles.textValue}>
              {location.zipCode}
            </Col>
          </>
          {/* Custom Col Here */}
        </Row>
      </div>
    );
  }
}

export default View;
