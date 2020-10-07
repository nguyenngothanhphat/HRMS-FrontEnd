import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

class View extends PureComponent {
  render() {
    const companyDetail = [
      {
        id: 1,
        label: 'Full Name',
        value: 'Terralogic',
      },
      {
        id: 2,
        label: 'Email',
        value: 'Terralogic@terralogic.com',
      },
      {
        id: 3,
        label: 'Phone Number',
        value: '0123456789',
      },
    ];

    return (
      <div className={styles.view}>
        <Row gutter={[0, 16]} className={styles.root}>
          {companyDetail.map((item) => (
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
      </div>
    );
  }
}

export default View;
