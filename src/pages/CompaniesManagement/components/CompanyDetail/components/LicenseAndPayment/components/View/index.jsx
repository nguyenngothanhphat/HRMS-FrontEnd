import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import styles from '../../../CompanyInformation/components/HeadquaterAddress/View/index.less';

class View extends PureComponent {
  render() {
    const companyDetail = [
      {
        id: 1,
        label: 'License',
        value: 'v4.02',
      },
      {
        id: 2,
        label: 'Payment Info',
        value: 'Paid',
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
