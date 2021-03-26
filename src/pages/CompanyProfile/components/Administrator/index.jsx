import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';

import styles from './index.less';

class Administrator extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.header__title}>Primary administrator</div>
          <div className={styles.header__action}>Change</div>
        </div>
        <div className={styles.primaryList}>
          <Row gutter={[24, 12]}>
            <Col span={8}>
              <div className={styles.primaryList__left} />
            </Col>
            <Col span={8}>
              <div className={styles.primaryList__center} />
            </Col>
            <Col span={8}>
              <div className={styles.primaryList__right} />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Administrator;
