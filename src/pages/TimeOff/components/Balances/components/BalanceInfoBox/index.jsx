import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

class BalanceInfoBox extends PureComponent {
  render() {
    const { title = '', value = 0, icon = null } = this.props;
    return (
      <div className={styles.BalanceInfoBox}>
        <Row>
          <Col span={8}>
            <img src={icon} alt="ico" />
          </Col>
          <Col span={16}>
            <p>{title}</p>
            <p>{value}</p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default BalanceInfoBox;
