import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import { formatMessage } from 'umi';
import styles from './index.less';

class View extends PureComponent {
  render() {
    const { location } = this.props;
    const locationData = [
      {
        label: formatMessage({ id: 'pages_admin.company.location.address' }),
        value: location.address,
      },
      {
        label: formatMessage({ id: 'pages_admin.company.location.country' }),
        value: location.country?.name,
      },
      {
        label: formatMessage({ id: 'pages_admin.company.location.state' }),
        value: location.state,
      },
      {
        label: formatMessage({ id: 'pages_admin.company.location.zipCode' }),
        value: location.zipCode,
      },
    ];
    return (
      <div className={styles.view}>
        <Row gutter={[0, 16]} className={styles.root}>
          {locationData.map((item) => (
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
