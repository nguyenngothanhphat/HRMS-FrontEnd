import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd';

import styles from './index.less';

export default class BottomBar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { className } = this.props;
    return (
      <div className={`${styles.bottomBar} ${className}`}>
        <Row>
          <Col span={16}>
            <div className={styles.bottomBar__status}>ssssssssssssssssss</div>
          </Col>
          <Col span={8}>
            <div className={styles.bottomBar__button}>
              <Button />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
