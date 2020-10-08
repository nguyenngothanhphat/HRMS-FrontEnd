import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import styles from '../../HeadquaterAddress/View/index.less';

class View extends PureComponent {
  render() {
    const companyDetail = [
      {
        id: 3,
        label: 'Company Name',
        value: 'Terralogic',
      },
      {
        id: 3,
        label: 'DBA',
        value: 'DBA',
      },
      {
        id: 4,
        label: 'EIN',
        value: 'EIN',
      },
      {
        id: 7,
        label: 'Employee Number',
        value: 'Employee Number',
      },
      {
        id: 7,
        label: 'Website',
        value: 'https://www.terralogic.com/',
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
