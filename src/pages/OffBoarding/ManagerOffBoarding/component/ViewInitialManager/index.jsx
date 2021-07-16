import React, { Component } from 'react';
import { Row, Col } from 'antd';
import ViewRightManager from './components/ViewRightManager';
import ViewLeftManager from './components/ViewLeftManager';

import styles from './index.less';

class ViewInitialManager extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.root}>
        <Row className={styles.content} gutter={[20, 20]}>
          <Col span={18}>
            <ViewLeftManager />
          </Col>
          <Col span={6}>
            <ViewRightManager />
          </Col>
        </Row>
      </div>
    );
  }
}

export default ViewInitialManager;
