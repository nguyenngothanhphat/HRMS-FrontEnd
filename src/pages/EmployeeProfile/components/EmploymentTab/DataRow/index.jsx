import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

class DataRow extends PureComponent {
  render() {
    return (
      <div className={styles.dataRow}>
        <Row>
          <Col>Title</Col>
          <Col>UX Lead</Col>
        </Row>
      </div>
    );
  }
}

export default DataRow;
