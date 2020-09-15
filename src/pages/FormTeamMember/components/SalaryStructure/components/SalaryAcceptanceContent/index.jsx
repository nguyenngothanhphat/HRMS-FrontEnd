import React, { PureComponent } from 'react';
import { Typography, Space, Radio, Row, Col } from 'antd';
import lightning from './assets/lightning.svg';
import styles from './index.less';

class SalaryAcceptanceContent extends PureComponent {
  render() {
    const { radioTitle, note } = this.props;

    return (
      <div className={styles.salaryAcceptanceContent}>
        <Space size="middle">
          <div>
            <img src={lightning} alt="icon" />
          </div>
          <Typography.Title level={5}>Acceptance of salary structure by candidate</Typography.Title>
        </Space>
        <div className={styles.salaryAcceptanceContent__select}>
          <Row>
            <Col span={3}>
              <Radio checked value={1} />
            </Col>
            <Col span={21}>
              <p className="radio__title">{radioTitle}</p>
            </Col>
          </Row>
          <Row>
            <Col span={21} offset={3}>
              <p className="salaryAcceptance__note">{note}</p>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default SalaryAcceptanceContent;
