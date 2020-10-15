/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Row, Col, Typography, Input } from 'antd';
import InternalStyle from './FilledByHR.less';

class FilledByHR extends PureComponent {
  render() {
    const { Tab, styles, jobDetails, HRField } = this.props;
    const { position, employeeType } = jobDetails;
    const { department, title, workLocation, reportingManager } = jobDetails;
    return (
      <div>
        <div className={InternalStyle.FilledByHR}>
          <Typography.Title level={5}>{Tab.positionTab.title}</Typography.Title>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8} className={InternalStyle.Padding}>
              <Typography.Text>{position}</Typography.Text>
            </Col>
          </Row>
          <div className={InternalStyle.paddingBotTitle}>
            <Typography.Title level={5}>{Tab.classificationTab.title}</Typography.Title>
          </div>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8} className={InternalStyle.Padding}>
              <Typography.Text>{employeeType}</Typography.Text>
            </Col>
          </Row>
        </div>
        <div>
          <Row gutter={[24, 0]}>
            {HRField.map((item) => (
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Typography.Title level={5}>{item.name}</Typography.Title>
                <Input
                  className={styles}
                  disabled="true"
                  defaultValue={
                    item.title === 'department'
                      ? department
                      : item.title === 'title'
                      ? title
                      : item.title === 'workLocation'
                      ? workLocation
                      : item.title === 'reportingManager'
                      ? reportingManager
                      : null
                  }
                />
              </Col>
            ))}
          </Row>
        </div>
        <div className={InternalStyle.Line} />
      </div>
    );
  }
}

export default FilledByHR;
