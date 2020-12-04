/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Row, Col, Select, Typography, Spin } from 'antd';
import { isNull, isEmpty } from 'lodash';
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
      disabled,
    } = this.props;

    console.log(managerList);

    return (
      <>
        <div>
          <Row gutter={[24, 0]}>
            {dropdownField.map((item, id) => {
              // if (item.title !== 'workLocation') {
              //   return null;
              // }
              return (
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
                      (item.title === 'title' && titleList.length <= 0) ||
                      (item.title === 'workLocation' && disabled) ||
                      (item.title === 'reportingManager' && disabled) ||
                      (item.title === 'department' && disabled) ||
                      (item.title === 'title' && disabled)
                    }
                    {...(item.title === 'department' &&
                      !isNull(department) && {
                        defaultValue: department.name,
                      })}
                    {...(item.title === 'title' &&
                      !isNull(title) && {
                        defaultValue: title.name,
                      })}
                    {...(item.title === 'workLocation' &&
                      !isNull(workLocation) && {
                        defaultValue: workLocation.legalAddress.address,
                      })}
                    {...(item.title === 'reportingManager' &&
                      !isEmpty(reportingManager) && {
                        defaultValue: reportingManager.generalInfo.firstName,
                      })}
                    showSearch={item.title === 'reportingManager'}
                    filterOption={(input, option) => {
                      return option.value.toLowerCase().indexOf(input) > -1;
                    }}
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
                          <Option value={data.generalInfo.firstName} key={index}>
                            <Typography.Text>
                              {data.generalInfo && data.generalInfo.firstName}
                            </Typography.Text>
                          </Option>
                        ))
                      : null}
                  </Select>
                </Col>
              );
            })}
          </Row>
        </div>
        <div className={InternalStyle.Line} />
      </>
    );
  }
}

export default FirstFieldsComponent;
