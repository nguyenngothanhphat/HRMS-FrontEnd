/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Row, Col, Select, Typography, Spin } from 'antd';
import { isString } from 'lodash';
import InternalStyle from './FirstFieldsComponent.less';

const { Option } = Select;

class FirstFieldsComponent extends PureComponent {
  render() {
    const {
      styles,
      dropdownField,
      departmentList,
      locationList,
      titleList,
      managerList,
      _handleSelect,
      department,
      title,
      workLocation,
      reportingManager,
      loading1,
      loading2,
      loading3,
      data: test,
    } = this.props;
    return (
      <>
        {isString(test.department) ? null : (
          <>
            <div>
              <Row gutter={[24, 0]}>
                {dropdownField.map((item, id) => (
                  <Col key={id} xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Typography.Title level={5}>{item.name}</Typography.Title>
                    <Select
                      placeholder={
                        (loading1 && item.name === 'Department') ||
                        (loading2 && item.name === 'Job Title') ||
                        (loading3 && item.name === 'Reporting Manager') ? (
                          <div className={styles.viewLoading}>
                            <Spin />
                          </div>
                        ) : (
                          item.placeholder
                        )
                      }
                      className={styles}
                      onChange={(value) => _handleSelect(value, item.title)}
                      disabled={
                        !!(item.title === 'reportingManager' && managerList.length <= 0) ||
                        (item.title === 'department' && departmentList.length <= 0) ||
                        (item.title === 'title' && titleList.length <= 0)
                      }
                      defaultValue={
                        item.title === 'department' && test.department === null
                          ? department
                          : item.title === 'title' && test.title === null
                          ? title
                          : item.title === 'workLocation' && test.workLocation === null
                          ? workLocation
                          : item.title === 'reportingManager' && test.reportingManager === null
                          ? reportingManager
                          : test.department !== null && item.title === 'department'
                          ? test.department.name
                          : test.workLocation !== null &&
                            item.title === 'workLocation' &&
                            test.workLocation.company
                          ? test.workLocation.company.legalAddress.address
                          : test.workLocation !== null &&
                            item.title === 'workLocation' &&
                            !test.workLocation.company
                          ? test.workLocation.legalAddress.address
                          : test.title !== null && item.title === 'title'
                          ? test.title.name
                          : test.title !== null && item.title === 'reportingManager'
                          ? test.reportingManager.generalInfo.firstName
                          : null
                      }
                    >
                      {item.title === 'workLocation'
                        ? locationList.map((data, index) => (
                            <Option value={data._id} key={index}>
                              <Typography.Text>{data.legalAddress.address}</Typography.Text>
                            </Option>
                          ))
                        : item.title === 'department' && departmentList.length > 0
                        ? departmentList.map((data, index) => (
                            <Option value={data._id} key={index}>
                              <Typography.Text>{data.name}</Typography.Text>
                            </Option>
                          ))
                        : item.title === 'title' && titleList.length > 0
                        ? titleList.map((data, index) => (
                            <Option value={data._id} key={index}>
                              <Typography.Text>{data.name}</Typography.Text>
                            </Option>
                          ))
                        : item.title === 'reportingManager' && managerList.length > 0
                        ? managerList.map((data, index) => (
                            <Option value={data._id} key={index}>
                              <Typography.Text>
                                {data.generalInfo && data.generalInfo.firstName}
                              </Typography.Text>
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
        )}
      </>
    );
  }
}

export default FirstFieldsComponent;
