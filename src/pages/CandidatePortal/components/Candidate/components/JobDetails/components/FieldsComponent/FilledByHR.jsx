/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Row, Col, Typography, Input } from 'antd';
import styles1 from './FilledByHR.less';

class FilledByHR extends PureComponent {
  render() {
    const { Tab, styles, HRField, data = {} } = this.props;
    const {
      department = {},
      title,
      workLocation,
      reportingManager = {},
      employeeType = {},
      position = {},
      grade = '',
    } = data || {};
    return (
      <div>
        <div className={styles1.FilledByHR}>
          <Typography.Title level={5}>{Tab.positionTab.title}</Typography.Title>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8} className={styles1.Padding}>
              <Typography.Text className={styles1.text}>{position}</Typography.Text>
            </Col>
          </Row>
          <div className={styles1.paddingBotTitle}>
            <Typography.Title level={5}>{Tab.classificationTab?.title}</Typography.Title>
          </div>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8} className={styles1.Padding}>
              <Typography.Text className={styles1.text}>{employeeType?.name}</Typography.Text>
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
                  disabled
                  defaultValue={
                    item.title === 'department'
                      ? department.name
                      : item.title === 'title'
                      ? title.name
                      : item.title === 'workLocation'
                      ? workLocation.name
                      : item.title === 'reportingManager'
                      ? reportingManager?.generalInfo?.firstName
                      : item.title === 'grade'
                      ? grade
                      : null
                  }
                />
              </Col>
            ))}
          </Row>
        </div>
        <div className={styles1.Line} />
      </div>
    );
  }
}

export default FilledByHR;
