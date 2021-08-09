/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Row, Col, Select, Typography, Spin, Form } from 'antd';
import { isNull, isEmpty } from 'lodash';
import { connect } from 'umi';
import InternalStyle from './FirstFieldsComponent.less';

const { Option } = Select;

@connect(({ loading }) => ({
  loadingTitle: loading.effects['candidateInfo/fetchTitleList'],
}))
class FirstFieldsComponent extends PureComponent {
  formRef = React.createRef();

  onChangeValue = (value, fieldName) => {
    const {
      _handleSelect = () => {},
      jobGradeList = [],
      locationList = [],
      departmentList = [],
      titleList = [],
    } = this.props;
    switch (fieldName) {
      case 'jobGradeLevel': {
        const getDataGrade = jobGradeList.filter((item) => item === value);
        _handleSelect(getDataGrade[0], fieldName);
        break;
      }
      case 'department': {
        this.formRef.current.setFieldsValue({
          title: null,
        });
        const getDataDepartment = departmentList.filter((item) => item.name === value);
        _handleSelect(getDataDepartment[0]._id, fieldName);
        break;
      }

      case 'workLocation': {
        const getDataLocation = locationList.filter((item) => item.name === value) || [];
        if (getDataLocation.length > 0) {
          _handleSelect(getDataLocation[0]._id, fieldName);
        }
        break;
      }

      case 'title': {
        const getDataTitle = titleList.filter((item) => item.name === value);
        _handleSelect(getDataTitle[0]._id, fieldName);
        break;
      }

      case 'reportingManager': {
        _handleSelect(value, fieldName);
        break;
      }

      default: {
        break;
      }
    }
  };

  render() {
    const {
      styles,
      dropdownField = [],
      jobGradeList,
      departmentList,
      locationList,
      titleList,
      managerList,
      department,
      grade,
      title,
      workLocation,
      reportingManager,
      loading1,
      loading2,
      loading3,
      disabled,
      loadingTitle,
    } = this.props;
    const showManagerListAB =
      managerList.length > 0
        ? managerList.sort((a, b) => {
            const nameA = a.generalInfo.firstName.toLowerCase();
            const nameB = b.generalInfo.firstName.toLowerCase();
            if (nameA < nameB) {
              return -1;
            }
            return 0;
          })
        : [];
    const showWorkLocationAB =
      locationList.length > 0
        ? locationList.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) {
              return -1;
            }
            return 0;
          })
        : [];
    const showDepartmentAB =
      departmentList.length > 0
        ? departmentList.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) {
              return -1;
            }
            return 0;
          })
        : [];
    const showTitleAB =
      titleList.length > 0
        ? titleList.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) {
              return -1;
            }
            return 0;
          })
        : [];
    return (
      <>
        <div className={InternalStyle.listFields}>
          <Form ref={this.formRef}>
            <Row gutter={[24, 0]}>
              {dropdownField.map((item, id) => {
                return (
                  <Col key={id} xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Form.Item
                      name={item.title}
                      className={InternalStyle.formItem}
                      label={item.name}
                      rules={[
                        {
                          required: item.title !== 'reportingManager',
                          message: `Please select the ${item.name}`,
                        },
                      ]}
                    >
                      {/* <Typography.Title level={5}>{item.name}</Typography.Title> */}
                      <Select
                        loading={item.title === 'title' ? loadingTitle : null}
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
                        // onChange={(value) => _handleSelect(value, item.title)}
                        onChange={(value) => this.onChangeValue(value, item.title)}
                        disabled={
                          !!(item.title === 'jobGradeLevel' && jobGradeList.length <= 0) ||
                          (item.title === 'reportingManager' && managerList.length <= 0) ||
                          (item.title === 'department' && departmentList.length <= 0) ||
                          (item.title === 'title' && titleList.length <= 0) ||
                          (item.title === 'workLocation' && disabled) ||
                          (item.title === 'reportingManager' && disabled) ||
                          (item.title === 'department' && disabled) ||
                          (item.title === 'title' && disabled)
                        }
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...(item.title === 'department' &&
                          !isNull(department) && {
                            defaultValue: department?.name,
                          })}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...(item.title === 'title' &&
                          !isNull(title) && {
                            defaultValue: title?.name,
                          })}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...(item.title === 'workLocation' &&
                          !isNull(workLocation) && {
                            defaultValue: workLocation?.name,
                          })}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...(item.title === 'reportingManager' &&
                          !isNull(reportingManager) && {
                            defaultValue: reportingManager?.generalInfo?.firstName,
                          })}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...(item.title === 'jobGradeLevel' &&
                          grade !== null && {
                            defaultValue: grade,
                          })}
                        showSearch={
                          item.title === 'jobGradeLevel' ||
                          item.title === 'reportingManager' ||
                          item.title === 'workLocation' ||
                          item.title === 'title' ||
                          item.title === 'department'
                        }
                        allowClear
                        filterOption={(input, option) => {
                          if (item.title === 'jobGradeLevel')
                            return option.value.toString().indexOf(input) > -1;
                          return option.value.toLowerCase().indexOf(input.toLowerCase()) > -1;
                        }}
                      >
                        {item.title === 'jobGradeLevel' ? (
                          jobGradeList.map((data) => (
                            <Option value={data} key={data}>
                              <Typography.Text>{data}</Typography.Text>
                            </Option>
                          ))
                        ) : item.title === 'workLocation' ? (
                          showWorkLocationAB.map((data, index) => (
                            <Option value={data.name} key={index}>
                              <Typography.Text>{data.name}</Typography.Text>
                            </Option>
                          ))
                        ) : item.title === 'department' && departmentList.length > 0 ? (
                          showDepartmentAB.map((data, index) => (
                            <Option value={data.name} key={index}>
                              <Typography.Text>{data.name}</Typography.Text>
                            </Option>
                          ))
                        ) : item.title === 'title' && titleList.length > 0 ? (
                          <>
                            {loadingTitle ? (
                              <Option value="error">
                                <Spin className={InternalStyle.spin} />
                              </Option>
                            ) : (
                              <>
                                {showTitleAB.map((data, index) => (
                                  <Option value={data.name} key={index}>
                                    <Typography.Text>{data.name}</Typography.Text>
                                  </Option>
                                ))}
                              </>
                            )}
                          </>
                        ) : item.title === 'reportingManager' && showManagerListAB.length > 0 ? (
                          showManagerListAB.map((data, index) => (
                            <Option value={data.generalInfo.firstName} key={index}>
                              <Typography.Text>
                                {data.generalInfo && data.generalInfo?.firstName
                                  ? `${data.generalInfo?.firstName} (${data.generalInfo?.workEmail})`
                                  : ''}
                              </Typography.Text>
                            </Option>
                          ))
                        ) : null}
                      </Select>
                    </Form.Item>
                  </Col>
                );
              })}
            </Row>
          </Form>
        </div>
      </>
    );
  }
}

export default FirstFieldsComponent;
