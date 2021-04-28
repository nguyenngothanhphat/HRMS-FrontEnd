import React, { Component } from 'react';
import { Col, Row } from 'antd';

import styles from './index.less';

class UserProfileLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { children } = this.props;
    return (
      <div className={styles.root}>
        <Row gutter={[24, 0]}>
          <Col span={18}>
            <div className={styles.profile}>{children}</div>
          </Col>
          <Col span={6}>
            <div className={styles.avatar}>hello</div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default UserProfileLayout;
