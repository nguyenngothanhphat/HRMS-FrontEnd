import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';

import RelievingTables from './components/RelievingTables';
import styles from './index.less';

class RelievingFormalities extends PureComponent {
  render() {
    return (
      <div className={styles.relievingFormalities}>
        {/* <p style={{ padding: '24px' }}>Content Relieving Formalities</p> */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={24} lg={18} xl={18}>
            <RelievingTables />
          </Col>
          <Col xs={24} sm={24} md={24} lg={6} xl={6}>
            8
          </Col>
        </Row>
      </div>
    );
  }
}

export default RelievingFormalities;
