import React, { PureComponent } from 'react';
import { Row, Col, Select, Typography } from 'antd';
import InternalStyle from './FilledByHR.less';

class FilledByHR extends PureComponent {
  render() {
    const { Tab, styles, jobDetails } = this.props;
    const { position, employeeType } = jobDetails;
    return (
      <div className={styles.FilledByHR}>
        <Typography.Title level={5}>{Tab.positionTab.title}</Typography.Title>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Typography.Text className={styles.Padding}>{position}</Typography.Text>
          </Col>
        </Row>

        <Typography.Title level={5} className={styles.paddingBotTitle}>
          {Tab.classificationTab.title}
        </Typography.Title>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Typography.Text className={styles.Padding}>{employeeType}</Typography.Text>
          </Col>
        </Row>
      </div>
    );
  }
}

export default FilledByHR;
