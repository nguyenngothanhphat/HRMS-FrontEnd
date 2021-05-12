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
    const { _handleSelect = () => {} } = this.props;
    if (fieldName === 'department') {
      this.formRef.current.setFieldsValue({
        title: null,
      });
    }
    _handleSelect(value, fieldName);
  };

  render() {
    const {
      styles,
      dropdownField = [],
      departmentList,
      locationList,
      titleList,
      managerList,
      department,
      title,
      workLocation,
      reportingManager,
      loading1,
      loading2,
      loading3,
      disabled,
      loadingTitle,
    } = this.props;

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
                          !!(item.title === 'reportingManager' && managerList.length <= 0) ||
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
                            defaultValue: department.name,
                          })}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...(item.title === 'title' &&
                          !isNull(title) && {
                            defaultValue: title.name,
                          })}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...(item.title === 'workLocation' &&
                          !isNull(workLocation) && {
                            defaultValue: workLocation.name,
                          })}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...(item.title === 'reportingManager' &&
                          !isEmpty(reportingManager) && {
                            defaultValue: reportingManager?.generalInfo?.firstName,
                          })}
                        showSearch={item.title === 'reportingManager'}
                        allowClear
                        filterOption={(input, option) => {
                          return option.value.toLowerCase().indexOf(input) > -1;
                        }}
                      >
                        {item.title === 'workLocation' ? (
                          locationList.map((data, index) => (
                            <Option value={data._id} key={index}>
                              <Typography.Text>{data.name}</Typography.Text>
                            </Option>
                          ))
                        ) : item.title === 'department' && departmentList.length > 0 ? (
                          departmentList.map((data, index) => (
                            <Option value={data._id} key={index}>
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
                                {titleList.map((data, index) => (
                                  <Option value={data._id} key={index}>
                                    <Typography.Text>{data.name}</Typography.Text>
                                  </Option>
                                ))}
                              </>
                            )}
                          </>
                        ) : item.title === 'reportingManager' && managerList.length > 0 ? (
                          managerList.map((data, index) => (
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
        <div className={InternalStyle.Line} />
      </>
    );
  }
}

export default FirstFieldsComponent;
