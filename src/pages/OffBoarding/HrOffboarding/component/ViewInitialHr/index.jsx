import React, { Component } from 'react';
import { Row, Col } from 'antd';
import ViewRightHr from './components/ViewRightHr';
import ViewLeftHr from './components/ViewLeftHr';

import styles from './index.less';

class ViewInitialHr extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.root}>
        <Row className={styles.content} gutter={[20, 20]}>
          <Col span={18}>
            <ViewLeftHr />
          </Col>
          <Col span={6}>
            <ViewRightHr />
          </Col>
        </Row>
      </div>
    );
  }
}

export default ViewInitialHr;
