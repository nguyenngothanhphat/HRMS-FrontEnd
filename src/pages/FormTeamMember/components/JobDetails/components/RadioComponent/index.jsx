/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Radio, Typography, Row, Col } from 'antd';
import styles from './index.less';

class RadioComponent extends PureComponent {
  render() {
    const { Tab, handleRadio, employeeTypeList, employeeType, position, data: test } = this.props;
    return (
      <div className={styles.RadioComponent}>
        <Typography.Title level={5}>{Tab.positionTab.title}</Typography.Title>
        <Radio.Group
          className={styles.Padding}
          defaultValue={position !== 'EMPLOYEE' ? test.position : position}
          onChange={(e) => handleRadio(e)}
          name={Tab.positionTab.name}
        >
          <Row gutter={[24, 0]}>
            {Tab.positionTab.arr.map((data) => (
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Radio className={styles.paddingRightRadio} value={data.value}>
                  <Typography.Text>{data.position}</Typography.Text>
                </Radio>
              </Col>
            ))}
          </Row>
        </Radio.Group>

        <Typography.Title level={5} className={styles.paddingBotTitle}>
          {Tab.classificationTab.title}
        </Typography.Title>
        <Radio.Group
          className={styles.paddingRadio}
          defaultValue={test.employeeType !== null ? test.employeeType._id : employeeType}
          onChange={(e) => handleRadio(e)}
          name={Tab.classificationTab.name}
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              {employeeTypeList.map((data) => (
                <Radio className={styles.Radio} value={data._id}>
                  <Typography.Text>{data.name}</Typography.Text>
                </Radio>
              ))}
            </Col>
          </Row>
        </Radio.Group>
      </div>
    );
  }
}

export default RadioComponent;
