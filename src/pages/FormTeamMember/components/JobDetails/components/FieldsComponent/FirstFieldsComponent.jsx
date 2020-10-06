/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Row, Col, Select, Typography } from 'antd';
import InternalStyle from './FirstFieldsComponent.less';

const { Option } = Select;

class FirstFieldsComponent extends PureComponent {
  render() {
    const {
      styles,
      dropdownField = [],
      handleSelect = () => {},
      jobDetail = {},
      departmentList,
      locationList,
      titleList,
      managerList,
      _handleSelect,
    } = this.props;
    const { department, title, workLocation, reportingManager } = jobDetail;
    return (
      <>
        <div>
          <Row gutter={[24, 0]}>
            {dropdownField.map((item) => (
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Typography.Title level={5}>{item.name}</Typography.Title>
                <Select
                  placeholder={item.placeholder}
                  className={styles}
                  onChange={
                    item.title === 'workLocation' || item.title === 'department'
                      ? (value) => handleSelect(value, item.title)
                      : (value) => _handleSelect(value, item.title)
                  }
                  disabled={
                    !!(item.title === 'reportingManager' && managerList.length <= 0) ||
                    (item.title === 'department' && departmentList.length <= 0) ||
                    (item.title === 'title' && titleList.length <= 0)
                  }
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
                >
                  {item.title === 'department'
                    ? departmentList.map((data, index) => (
                        <Option value={data._id} key={index}>
                          <Typography.Text>{data.name}</Typography.Text>
                        </Option>
                      ))
                    : item.title === 'workLocation'
                    ? locationList.map((data, index) => (
                        <Option value={data._id} key={index}>
                          <Typography.Text>{data.legalAddress.address}</Typography.Text>
                        </Option>
                      ))
                    : item.title === 'title'
                    ? titleList.map((data, index) => (
                        <Option value={data._id} key={index}>
                          <Typography.Text>{data.name}</Typography.Text>
                        </Option>
                      ))
                    : item.title === 'reportingManager' && managerList.length > 1
                    ? managerList.map((data, index) => (
                        <Option value={data._id} key={index}>
                          <Typography.Text>{data.generalinfos.firstName}</Typography.Text>
                        </Option>
                      ))
                    : null}
                </Select>
              </Col>
            ))}
          </Row>
        </div>
        <div className={InternalStyle.Line} />
      </>
    );
  }
}

export default FirstFieldsComponent;
