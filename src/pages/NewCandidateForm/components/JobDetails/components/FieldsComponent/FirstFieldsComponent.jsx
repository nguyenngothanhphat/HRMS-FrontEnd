/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import { Col, Form, Row, Select, Spin } from 'antd';
import { isNull } from 'lodash';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import InternalStyle from './FirstFieldsComponent.less';

const { Option } = Select;

@connect(
  ({
    locationSelection: { listLocationsByCompany = [] } = {},
    user: { currentUser = {}, companiesOfUser = [] },
    newCandidateForm: { currentStep, tempData } = {},
    loading,
  }) => ({
    currentUser,
    listLocationsByCompany,
    companiesOfUser,
    currentStep,
    tempData,
    loading1: loading.effects['newCandidateForm/fetchDepartmentList'],
    loading2: loading.effects['newCandidateForm/fetchTitleList'],
    loading3: loading.effects['newCandidateForm/fetchManagerList'],
    loading4: loading.effects['newCandidateForm/fetchReporteesList'],
  }),
)
class FirstFieldsComponent extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this.fetchData();
  };

  componentDidUpdate = (prevProps) => {
    const { tempData: { locationList, reportees = [], reporteeList = [] } = {} } = this.props;
    if (
      JSON.stringify(prevProps.locationList) !== JSON.stringify(locationList) &&
      reportees.length > 0 &&
      reporteeList.length === 0
    ) {
      this.fetchReportees();
    }
  };

  fetchData = () => {
    const {
      dispatch,
      tempData: {
        departmentList,
        titleList,
        managerList,
        department,
        title,
        reportingManager,
        workLocation,
      },
    } = this.props;
    const companyId = getCurrentCompany();
    const tenantId = getCurrentTenant();
    if (department && departmentList.length === 0) {
      dispatch({
        type: 'newCandidateForm/fetchDepartmentList',
        payload: {
          company: companyId,
          tenantId,
        },
      });
    }
    if (title && department && titleList.length === 0) {
      dispatch({
        type: 'newCandidateForm/fetchTitleList',
        payload: {
          department: department ? department._id || department : '',
          tenantId,
        },
      });
    }
    if (reportingManager && Object.keys(reportingManager).length > 0 && managerList.length === 0) {
      dispatch({
        type: 'newCandidateForm/fetchManagerList',
        payload: {
          company: companyId,
          status: ['ACTIVE'],
          // location: locationPayload,
          tenantId: getCurrentTenant(),
        },
      });
    }
    if (department && workLocation?._id) {
      this.fetchReportees();
    }
  };

  fetchReportees = (name = '') => {
    const { dispatch } = this.props;
    const {
      tempData: { locationList, workLocation },
      companiesOfUser = [],
    } = this.props;

    const currentCompany = getCurrentCompany();
    const currentLocation = workLocation?._id;
    const companyPayload = companiesOfUser.filter((lo) => lo?._id === currentCompany);
    let locationPayload = [];

    if (currentLocation) {
      const selectedLocation = locationList.find((l) => l._id === currentLocation);
      if (selectedLocation) {
        const {
          headQuarterAddress: { country = {}, state = '' },
        } = selectedLocation || {};
        locationPayload = {
          country: country._id,
          state: [state],
        };
      }
    }
    // const departmentPayload = departmentList.find((d) => d._id === department?._id || department);
    dispatch({
      type: 'newCandidateForm/fetchReporteesList',
      payload: {
        status: ['ACTIVE'],
        company: companyPayload,
        // department: departmentPayload ? [departmentPayload.name] : [],
        location: locationPayload,
        // page: 1,
        // limit: 10,
        name,
      },
    });
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
        this.fetchReportees(0, value);
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
    // this.setState({
    //   inputVal: value,
    // });

    this.setDebounce(value);
  };

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  // renderMenu = (item, showReporteesListAB) => {
  //   const style = (index) => {
  //     if (index % 2 === 0) return InternalStyle.evenClass;

  //     return InternalStyle.oddClass;
  //   };

  //   return (
  //     <div className={InternalStyle.dropdown}>
  //       <div className={InternalStyle.dropdownMenu}>
  //         {item.title === 'reportees' && showReporteesListAB.length > 0
  //           ? showReporteesListAB.map((data, index) => (
  //               <div className={`${InternalStyle.dropdownMenu__menu} ${style(index)}`} key={index}>
  //                 <Checkbox>
  //                   <div className={InternalStyle.dropdownMenu__name}>
  //                     {data.generalInfo && data.generalInfo?.firstName
  //                       ? `${data.generalInfo?.firstName}`
  //                       : ''}
  //                   </div>
  //                 </Checkbox>
  //               </div>
  //             ))
  //           : null}
  //       </div>
  //     </div>
  //   );
  // };

  // reporteesField = (item, showReporteesListAB) => {
  //   const { loading4, disabled } = this.props;
  //   const { visible } = this.state;

  //   return (
  //     <Dropdown
  //       placement="bottomCenter"
  //       trigger={['click']}
  //       visible={visible}
  //       onVisibleChange={this.handleVisibleChange}
  //       className={InternalStyle.rootDropdown}
  //       overlay={() => this.renderMenu(item, showReporteesListAB)}
  //     >
  //       <Input
  //         disabled={item.title === 'reportees' && disabled}
  //         // value={inputVal}
  //         placeholder={item.placeholder}
  //         onChange={this.onChangeInput}
  //         suffix={loading4 ? <LoadingOutlined /> : <DownOutlined />}
  //         className={InternalStyle.rootDropdown__input}
  //         loading
  //       />
  //     </Dropdown>
  //   );
  // };

  render() {
    const {
      styles,
      dropdownField = [],
      tempData: {
        jobGradeLevelList: jobGradeList,
        departmentList,
        locationList,
        titleList,
        managerList,
        department,
        title,
        workLocation,
        reportingManager,
        grade,
        reportees = [],
        reporteeList = [],
      },
      loading1,
      loading2,
      loading3,
      loading4,
      disabled,
      currentStep,
    } = this.props;

    const showManagerListAB =
      managerList.length > 0
        ? managerList.sort((a, b) => {
            const nameA = a.generalInfo ? a.generalInfo?.firstName.toLowerCase() : '';
            const nameB = b.generalInfo ? b.generalInfo?.firstName.toLowerCase() : '';
            if (nameA < nameB) {
              return -1;
            }
            return 0;
          })
        : [];
    const showReporteesListAB =
      reporteeList.length > 0
        ? reporteeList.sort((a, b) => {
            const nameA = a.generalInfo ? a.generalInfo?.firstName.toLowerCase() : '';
            const nameB = b.generalInfo ? b.generalInfo?.firstName.toLowerCase() : '';
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
                          required: item.title !== 'reportingManager' && item.title !== 'reportees',
                          message: `Please select the ${item.name}`,
                        },
                      ]}
                    >
                      <Select
                        loading={
                          (item.title === 'title' ? loading2 : null) ||
                          (item.title === 'reportingManager' ? loading3 : null) ||
                          (item.title === 'reportees' ? loading4 : null) ||
                          (item.title === 'department' ? loading1 : null)
                        }
                        placeholder={item.placeholder}
                        className={styles}
                        // onChange={(value) => _handleSelect(value, item.title)}
                        onChange={(value) => this.onChangeValue(value, item.title)}
                        disabled={
                          !!(item.title === 'grade' && jobGradeList.length <= 0) ||
                          (item.title === 'reportingManager' && managerList.length <= 0) ||
                          (item.title === 'reportees' && reporteeList.length <= 0) ||
                          (item.title === 'department' && departmentList.length <= 0) ||
                          (item.title === 'title' && titleList.length <= 0) ||
                          (item.title === 'grade' && disabled) ||
                          (item.title === 'workLocation' && disabled) ||
                          (item.title === 'reportingManager' && disabled) ||
                          (item.title === 'department' && disabled) ||
                          (item.title === 'title' && disabled) ||
                          (item.title === 'reportees' && disabled) ||
                          (item.title === 'workLocation' && currentStep !== 1)
                        }
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...(item.title === 'department' &&
                          !isNull(department) && {
                            defaultValue: department?._id || department,
                          })}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...(item.title === 'title' &&
                          !isNull(title) && {
                            defaultValue: title?._id || title,
                          })}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...(item.title === 'workLocation' &&
                          !isNull(workLocation) && {
                            defaultValue: workLocation?._id,
                          })}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...(item.title === 'reportingManager' &&
                          !isNull(reportingManager) && {
                            defaultValue: reportingManager?._id,
                          })}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...(item.title === 'grade' &&
                          grade !== null && {
                            defaultValue: grade && grade !== 0 ? grade : null,
                          })}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...(item.title === 'reportees' &&
                          !isNull(reportees) && {
                            defaultValue: reportees,
                          })}
                        showSearch={
                          item.title === 'grade' ||
                          item.title === 'reportingManager' ||
                          item.title === 'workLocation' ||
                          item.title === 'title' ||
                          item.title === 'department' ||
                          item.title === 'reportees'
                        }
                        showArrow
                        allowClear
                        filterOption={(input, option) => {
                          if (item.title === 'grade')
                            return option.value.toString().indexOf(input) > -1;
                          return option.value.toLowerCase().indexOf(input.toLowerCase()) > -1;
                        }}
                        mode={item.title === 'reportees' ? 'multiple' : ''}
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
                          showManagerListAB.map((data, index) => {
                            const { firstName, middleName, lastName } = data.generalInfo || {};
                            let fullName = `${firstName} ${middleName} ${lastName}`;
                            if (!middleName) fullName = `${firstName} ${lastName}`;
                            return (
                              <Option value={data._id} key={index}>
                                {fullName}
                              </Option>
                            );
                          })
                        ) : item.title === 'reportees' && showReporteesListAB.length > 0 ? (
                          showReporteesListAB.map((data, index) => {
                            const { firstName, middleName, lastName } = data.generalInfo || {};
                            let fullName = `${firstName} ${middleName} ${lastName}`;
                            if (!middleName) fullName = `${firstName} ${lastName}`;
                            return (
                              <Option value={data._id} key={index}>
                                {fullName}
                              </Option>
                            );
                          })
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
