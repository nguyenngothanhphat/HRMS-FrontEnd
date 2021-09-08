/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Row, Col, Select, Spin, Form, Checkbox, Dropdown, Input } from 'antd';
import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { isNull } from 'lodash';
import { connect } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import InternalStyle from './FirstFieldsComponent.less';

const { Option } = Select;

@connect(() => ({}))
class FirstFieldsComponent extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      inputVal: '',
      visible: false,
    };
  }

  componentDidMount = () => {
    this.fetchData();
  };

  fetchData = () => {
    const { department, title, reportingManager, dispatch } = this.props;

    const companyId = getCurrentCompany();
    const tenantId = getCurrentTenant();
    if (department) {
      dispatch({
        type: 'newCandidateForm/fetchDepartmentList',
        payload: {
          company: companyId,
          tenantId,
        },
      });
    }
    if (title && department) {
      dispatch({
        type: 'newCandidateForm/fetchTitleList',
        payload: {
          department: department ? department._id : '',
          tenantId,
        },
      });
    }
    if (department) {
      dispatch({
        type: 'newCandidateForm/fetchDepartmentList',
        payload: {
          company: companyId,
          tenantId,
        },
      });
    }
    if (reportingManager && Object.keys(reportingManager).length > 0) {
      dispatch({
        type: 'newCandidateForm/fetchManagerList',
        payload: {
          company: companyId,
          status: ['ACTIVE'],
          // location: locationPayload,
          tenantId: getCurrentTenant(),
          page: 1,
          limit: 10,
        },
      });
    }
  };

  onChangeValue = (value, fieldName) => {
    const { _handleSelect = () => {} } = this.props;
    switch (fieldName) {
      case 'grade': {
        _handleSelect(value, fieldName);
        break;
      }
      case 'department': {
        this.formRef.current.setFieldsValue({
          title: null,
        });
        _handleSelect(value, fieldName);
        break;
      }

      case 'workLocation': {
        _handleSelect(value, fieldName);

        break;
      }

      case 'title': {
        _handleSelect(value, fieldName);
        break;
      }

      case 'reportingManager': {
        _handleSelect(value, fieldName);
        break;
      }

      case 'reportees': {
        _handleSelect(value, fieldName);
        break;
      }

      default: {
        break;
      }
    }
  };

  onChangeInput = ({ target: { value } }) => {
    this.setState({
      inputVal: value,
    });
  };

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  renderMenu = (item, showManagerListAB) => {
    const style = (index) => {
      if (index % 2 === 0) return InternalStyle.evenClass;

      return InternalStyle.oddClass;
    };

    return (
      <div className={InternalStyle.dropdown}>
        <div className={InternalStyle.dropdownMenu}>
          {item.title === 'reportees' && showManagerListAB.length > 0
            ? showManagerListAB.map((data, index) => (
                <div className={`${InternalStyle.dropdownMenu__menu} ${style(index)}`} key={index}>
                  <Checkbox>
                    <div className={InternalStyle.dropdownMenu__name}>
                      {data.generalInfo && data.generalInfo?.firstName
                        ? `${data.generalInfo?.firstName}`
                        : ''}
                    </div>
                  </Checkbox>
                </div>
              ))
            : null}
        </div>
      </div>
    );
  };

  reporteesField = (item, showManagerListAB) => {
    const { loading3, disabled, reportees } = this.props;
    const { visible, inputVal } = this.state;

    return (
      <Dropdown
        placement="bottomCenter"
        trigger={['click']}
        visible={visible}
        onVisibleChange={this.handleVisibleChange}
        className={InternalStyle.rootDropdown}
        overlay={() => this.renderMenu(item, showManagerListAB)}
      >
        <Input
          disabled={item.title === 'reportees' && disabled}
          value={inputVal}
          placeholder={item.placeholder}
          onChange={this.onChangeInput}
          suffix={loading3 ? <LoadingOutlined /> : <DownOutlined />}
          className={InternalStyle.rootDropdown__input}
          loading
        />
      </Dropdown>
    );
  };

  customReporteesField = (item, showManagerListAB) => {
    const { styles, loading3, disabled, reportees } = this.props;
    return (
      <>
        <Select
          loading={item.title === 'reportees' ? loading3 : null}
          placeholder={item.placeholder}
          className={styles}
          onChange={(value) => this.onChangeValue(value, item.title)}
          disabled={item.title === 'reportees' && disabled}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...(item.title === 'reportees' &&
            !isNull(reportees) && {
              defaultValue: reportees,
            })}
          showSearch={item.title === 'reportees'}
          showArrow
          allowClear
          filterOption={(input, option) => {
            if (item.title === 'grade') return option.value.toString().indexOf(input) > -1;
            return option.value.toLowerCase().indexOf(input.toLowerCase()) > -1;
          }}
          mode="multiple"
        >
          {item.title === 'reportees' && showManagerListAB.length > 0
            ? showManagerListAB.map((data, index) => (
                <Option value={data._id} key={index}>
                  <div>
                    {data.generalInfo && data.generalInfo?.firstName
                      ? `${data.generalInfo?.firstName}`
                      : ''}
                  </div>
                </Option>
              ))
            : null}
        </Select>
      </>
    );
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
      reportees,
      loading1,
      loading2,
      loading3,
      disabled,
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
                          required: item.title !== 'reportingManager' || item.title !== 'reportees',
                          message: `Please select the ${item.name}`,
                        },
                      ]}
                    >
                      {item.title === 'reportees'
                        ? this.reporteesField(item, showManagerListAB)
                        : null}
                      {item.title !== 'reportees' ? (
                        <Select
                          loading={
                            (item.title === 'title' ? loading2 : null) ||
                            (item.title === 'reportingManager' ? loading3 : null) ||
                            (item.title === 'reportees' ? loading3 : null) ||
                            (item.title === 'department' ? loading1 : null)
                          }
                          placeholder={item.placeholder}
                          className={styles}
                          // onChange={(value) => _handleSelect(value, item.title)}
                          onChange={(value) => this.onChangeValue(value, item.title)}
                          disabled={
                            !!(item.title === 'grade' && jobGradeList.length <= 0) ||
                            (item.title === 'reportingManager' && managerList.length <= 0) ||
                            // (item.title === 'reportees' && managerList.length <= 0) ||
                            (item.title === 'department' && departmentList.length <= 0) ||
                            (item.title === 'title' && titleList.length <= 0) ||
                            (item.title === 'grade' && disabled) ||
                            (item.title === 'workLocation' && disabled) ||
                            (item.title === 'reportingManager' && disabled) ||
                            (item.title === 'department' && disabled) ||
                            (item.title === 'title' && disabled)
                            // (item.title === 'reportees' && disabled)
                          }
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...(item.title === 'department' &&
                            !isNull(department) && {
                              defaultValue: department._id,
                            })}
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...(item.title === 'title' &&
                            !isNull(title) && {
                              defaultValue: title._id,
                            })}
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...(item.title === 'workLocation' &&
                            !isNull(workLocation) && {
                              defaultValue: workLocation._id,
                            })}
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...(item.title === 'reportingManager' &&
                            !isNull(reportingManager) && {
                              defaultValue: reportingManager?._id,
                            })}
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...(item.title === 'grade' &&
                            grade !== null && {
                              defaultValue: grade,
                            })}
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          // {...(item.title === 'reportees' &&
                          //   !isNull(reportees) && {
                          //     defaultValue: reportees,
                          //   })}
                          showSearch={
                            item.title === 'grade' ||
                            item.title === 'reportingManager' ||
                            item.title === 'workLocation' ||
                            item.title === 'title' ||
                            item.title === 'department'
                            // item.title === 'reportees'
                          }
                          showArrow
                          allowClear
                          filterOption={(input, option) => {
                            if (item.title === 'grade')
                              return option.value.toString().indexOf(input) > -1;
                            return option.value.toLowerCase().indexOf(input.toLowerCase()) > -1;
                          }}
                          // mode={item.title === 'reportees' ? 'multiple' : ''}
                        >
                          {item.title === 'grade' ? (
                            jobGradeList.map((data) => (
                              <Option value={data} key={data}>
                                {data}
                              </Option>
                            ))
                          ) : item.title === 'workLocation' ? (
                            showWorkLocationAB.map((data, index) => (
                              <Option value={data._id} key={index}>
                                {data.name}
                              </Option>
                            ))
                          ) : item.title === 'department' && departmentList.length > 0 ? (
                            showDepartmentAB.map((data, index) => (
                              <Option value={data._id} key={index}>
                                {data.name}
                              </Option>
                            ))
                          ) : item.title === 'title' && titleList.length > 0 ? (
                            <>
                              {loading2 ? (
                                <Option value="error">
                                  <Spin className={InternalStyle.spin} />
                                </Option>
                              ) : (
                                <>
                                  {showTitleAB.map((data, index) => (
                                    <Option value={data._id} key={index}>
                                      {data.name}
                                    </Option>
                                  ))}
                                </>
                              )}
                            </>
                          ) : item.title === 'reportingManager' && showManagerListAB.length > 0 ? (
                            showManagerListAB.map((data, index) => (
                              <Option value={data._id} key={index}>
                                {data.generalInfo && data.generalInfo?.firstName
                                  ? `${data.generalInfo?.firstName} (${data.generalInfo?.workEmail})`
                                  : ''}
                              </Option>
                            ))
                          ) : null}
                          {/* ) : item.title === 'reportees' && showManagerListAB.length > 0 ? (
                            showManagerListAB.map((data, index) => (
                              <Option value={data._id} key={index}>
                                {data.generalInfo && data.generalInfo?.firstName
                                  ? `${data.generalInfo?.firstName}`
                                  : ''}
                              </Option>
                            ))
                          ) : null} */}
                        </Select>
                      ) : null}
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
