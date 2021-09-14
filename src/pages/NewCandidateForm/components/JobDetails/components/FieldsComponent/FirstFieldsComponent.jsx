/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import { Checkbox, Col, Form, Row, Select, Spin, Tag } from 'antd';
import { isNull } from 'lodash';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import CloseTagIcon from '@/assets/closeTagIcon.svg';
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
    this.state = {
      listReporteesId: [], // store id
      listReporteesTag: [], // store object reportee (name, )
    };
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
      tempData: { locationList, workLocation, reportees = [] },
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
    }).then((response) => {
      const { statusCode, data } = response;
      if (statusCode === 200) {
        // Check array reportees is not empty => If yes, then store data to listReporteesId
        const showReporteesListAB =
          data.length > 0
            ? data.sort((a, b) => {
                const nameA = a.generalInfo ? a.generalInfo?.firstName.toLowerCase() : '';
                const nameB = b.generalInfo ? b.generalInfo?.firstName.toLowerCase() : '';
                if (nameA < nameB) {
                  return -1;
                }
                return 0;
              })
            : [];
        if (reportees.length > 0) {
          const listReporteesTag = reportees.map((id) => {
            const reportee = showReporteesListAB.find((item) => item._id === id);
            return reportee;
          });

          this.setState({
            listReporteesId: reportees,
            listReporteesTag,
          });
        }
      }
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
        this.handleReporteesValue(value);
        _handleSelect(value, fieldName);
        break;
      }

      default: {
        break;
      }
    }
  };

  handleReporteesValue = (arrId) => {
    const {
      tempData: { reporteeList = [] },
    } = this.props;

    const arrTemp = [...arrId];

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

    const arrTags = arrTemp.map((id) => {
      return showReporteesListAB.find((item) => item.id === id);
    });

    this.setState({
      listReporteesId: arrTemp,
      listReporteesTag: arrTags,
    });
  };

  onCheckbox = (e, showReporteesListAB) => {
    const { listReporteesId } = this.state;
    const arrIDs = [...listReporteesId];
    let arrTags = [];

    const check = e.target.checked;
    const { value } = e.target;

    if (check) {
      arrIDs.push(value);
      arrTags = arrIDs.map((id) => {
        return showReporteesListAB.find((item) => item.id === id);
      });
    } else {
      const index = arrIDs.indexOf(value);
      if (index > -1) {
        arrIDs.splice(index, 1);

        arrTags = arrIDs.map((id) => {
          return showReporteesListAB.find((item) => item.id === id);
        });
      }
    }

    this.setState({
      listReporteesId: arrIDs,
      listReporteesTag: arrTags,
    });
  };

  renderReporteesField = (showReporteesListAB) => {
    const { listReporteesId } = this.state;

    const checkedStatus = (id) => {
      let check = false;
      listReporteesId.forEach((itemId) => {
        if (itemId === id) {
          check = true;
        }
      });

      return check;
    };

    return showReporteesListAB.map((data, index) => {
      const { firstName, middleName, lastName } = data.generalInfo || {};
      let fullName = `${firstName} ${middleName} ${lastName}`;
      if (!middleName) fullName = `${firstName} ${lastName}`;

      const className = index % 2 === 0 ? InternalStyle.evenClass : InternalStyle.oddClass;
      return (
        <Option
          className={`${InternalStyle.optionSelect} ${className}`}
          value={data._id}
          key={index}
        >
          <Checkbox
            value={data._id}
            onChange={(e) => this.onCheckbox(e, showReporteesListAB)}
            checked={checkedStatus(data._id)}
          >
            <div>{fullName}</div>
          </Checkbox>
        </Option>
      );
    });
  };

  handleCloseTag = (id) => {
    const { dispatch } = this.props;
    const { listReporteesId } = this.state;
    const arrTemp = [...listReporteesId];

    const index = arrTemp.indexOf(id);
    arrTemp.splice(index, 1);

    this.formRef.current.setFieldsValue({
      reportees: arrTemp,
    });

    dispatch({
      type: 'newCandidateForm/saveTemp',
      payload: {
        reportees: arrTemp,
      },
    });

    this.setState({
      listReporteesId: arrTemp,
    });
  };

  renderReporteesName = () => {
    const { listReporteesTag } = this.state;
    const { loading4, disabled } = this.props;
    if (listReporteesTag.length === 0 || loading4) return null;

    return (
      <div className={InternalStyle.listTags}>
        {listReporteesTag.map((item) => {
          const fullName = `${item?.generalInfo?.firstName} ${
            item?.generalInfo?.middleName ? item?.generalInfo?.middleName : ''
          } ${item?.generalInfo?.lastName}`;
          return (
            <Tag
              key={item.id}
              closable={!disabled}
              className={InternalStyle.nameTag}
              onClose={() => this.handleCloseTag(item.id)}
              closeIcon={<img alt="close-tag" src={CloseTagIcon} />}
            >
              {fullName}
            </Tag>
          );
        })}
      </div>
    );
  };

  onSearchReportees = (value) => {
    console.log(value);
  };

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
    const { listReporteesId } = this.state;

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
                const className = `${InternalStyle.InputReportees} ${
                  listReporteesId.length > 0 ? InternalStyle.placeholderReportees : ''
                }`;
                return (
                  <Col key={id} xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Form.Item
                      name={item.title}
                      className={`${InternalStyle.formItem} ${
                        item.title === 'reportees' ? InternalStyle.formItemReportees : ''
                      }`}
                      label={item.name}
                      rules={[
                        {
                          required: item.title !== 'reportingManager' && item.title !== 'reportees',
                          message: `Please select the ${item.name}`,
                        },
                      ]}
                    >
                      <Select
                        menuItemSelectedIcon={null}
                        loading={
                          (item.title === 'title' ? loading2 : null) ||
                          (item.title === 'reportingManager' ? loading3 : null) ||
                          (item.title === 'reportees' ? loading4 : null) ||
                          (item.title === 'department' ? loading1 : null)
                        }
                        placeholder={item.placeholder}
                        className={item.title === 'reportees' ? className : styles}
                        value={item.title === 'reportees' ? listReporteesId : null}
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
                          if (item.title === 'reportees') return null;
                          return (
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1
                          );
                        }}
                        mode={item.title === 'reportees' ? 'multiple' : null}
                        onSearch={(value) => this.onSearchReportees(value)}
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
                          this.renderReporteesField(showReporteesListAB)
                        ) : null}
                      </Select>
                    </Form.Item>
                    {item.title === 'reportees' ? this.renderReporteesName() : null}
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
