/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import { Checkbox, Col, Form, Row, Select, Spin, Tag } from 'antd';
import { isNull, debounce } from 'lodash';
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
      listReporteesId: [], // store id reportees from redux
      listReporteesTag: [], // store object reportee info (name,id,...) => PURPOSE: to render tags name
      nameReportees: '',
      isSearch: false,
    };

    this.setDebounce = debounce((nameReportees) => {
      this.setState({
        nameReportees,
      });
    }, 500);
  }

  componentDidMount = () => {
    this.fetchData();
  };

  componentDidUpdate = (prevProps, prepStates) => {
    const { nameReportees } = this.state;
    if (JSON.stringify(prepStates.nameReportees) !== JSON.stringify(nameReportees)) {
      this.fetchReportees(nameReportees);
    }
  };

  fetchData = () => {
    const {
      dispatch,
      tempData: { departmentList, titleList, managerList, department, title, reportingManager },
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
    this.fetchReportees();
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
    }).then((response) => {
      const { statusCode, data } = response;
      if (statusCode === 200) {
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
        this.storeReporteesInformation(showReporteesListAB);
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
        break;
      }

      case 'reportees': {
        _handleSelect(value, fieldName);

        this.setState({
          listReporteesId: value,
        });
        break;
      }

      default: {
        break;
      }
    }
  };

  /// ///////////////////////////////////////////////// [START] HANDLE REPORTEES FIELD ////////////////////////////////////////////////////

  storeReporteesInformation = (showReporteesListAB) => {
    const { listReporteesTag: stateListTags } = this.state;
    const {
      tempData: { reportees = [] },
    } = this.props;

    let listTemp = [...stateListTags];
    if (reportees.length > 0) {
      // Get an array of object elements base on list IDs in reportees array. => PURPOSE: TO RENDER TAGS NAME
      let listReporteesTag = reportees.map((id) => {
        const reportee = showReporteesListAB.find((item) => item._id === id);
        return reportee;
      });

      listReporteesTag = listReporteesTag.filter((item) => item !== undefined); // Because showReporteesListAB maybe emtpy when we search then cause returning undefined
      listTemp = [...listReporteesTag, ...listTemp]; // This array listTemp maybe has the same (or exist) elements between 2 listReporteesTag and listTemp

      // => Therefore, need to fix to get a new array with unique element
      const uniqueArr = [...new Set(listTemp.map((item) => item.id))];
      const newListTags = uniqueArr.map((id) => {
        return listTemp.find((temp) => temp.id === id);
      });

      this.setState({
        listReporteesId: reportees,
        listReporteesTag: newListTags,
      });
    }
  };

  onSelectReportees = (reporteeId) => {
    const { listReporteesId, listReporteesTag } = this.state;
    const {
      tempData: { reporteeList = [] },
    } = this.props;

    const listReportees = [...listReporteesId];
    let listTemp = [...listReporteesTag];

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

    listReportees.push(reporteeId);

    let arrTags = listReportees.map((id) => {
      return showReporteesListAB.find((item) => item.id === id);
    });

    arrTags = arrTags.filter((item) => item !== undefined);
    listTemp = [...arrTags, ...listTemp];
    listTemp = [...new Set(listTemp)];

    this.setState({
      listReporteesId: listReportees,
      listReporteesTag: listTemp,
      isSearch: false,
    });
  };

  onDeselectReportees = (reporteeId) => {
    const { listReporteesId, listReporteesTag } = this.state;
    const listReportees = [...listReporteesId];
    const listTags = [...listReporteesTag];

    const index = listReportees.indexOf(reporteeId);
    let indexTag = null;
    listTags.forEach((item, indexItem) => {
      if (item.id === reporteeId) indexTag = indexItem;
    });

    if (index > -1 && indexTag > -1 && indexTag !== null) {
      listReportees.splice(index, 1);
      listTags.splice(indexTag, 1);
    }

    this.setState({
      listReporteesId: listReportees,
      listReporteesTag: listTags,
      isSearch: false,
    });
  };

  onCheckbox = (e, showReporteesListAB) => {
    const { listReporteesId, listReporteesTag } = this.state;
    const arrIDs = [...listReporteesId];
    let listTags = [...listReporteesTag];

    const check = e.target.checked;
    const { value } = e.target;

    if (check) {
      arrIDs.push(value);
      let arrTags = arrIDs.map((id) => {
        return showReporteesListAB.find((item) => item.id === id);
      });
      arrTags = arrTags.filter((item) => item !== undefined);
      listTags = [...arrTags, ...listTags];
      listTags = [...new Set(listTags)];
    } else {
      const index = arrIDs.indexOf(value);
      let indexTag = null;
      listTags.forEach((item, indexItem) => {
        if (item.id === value) indexTag = indexItem;
      });

      if (index > -1 && indexTag > -1 && indexTag !== null) {
        arrIDs.splice(index, 1);
        listTags.splice(indexTag, 1);
      }
    }

    this.setState({
      listReporteesId: arrIDs,
      listReporteesTag: listTags,
    });
  };

  renderReporteesField = (showReporteesListAB) => {
    const { listReporteesId } = this.state;
    const { loading4 } = this.props;

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
          disabled={loading4}
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
    const { disabled } = this.props;
    if (listReporteesTag.length === 0) return null;

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
    const formatValue = value.toLowerCase();
    if (value) {
      this.setState({
        isSearch: true,
      });
      this.setDebounce(formatValue);
    } else {
      this.setState({
        isSearch: false,
      });
      this.setDebounce('');
    }
  };

  dropdownRender = (menu) => {
    const { loading4 } = this.props;

    return (
      <div className={InternalStyle.dropdownRender}>
        {loading4 ? (
          <div className={InternalStyle.dropdownRender__spin}>
            <Spin />
          </div>
        ) : null}
        <div className={loading4 ? InternalStyle.dropdownRender__menu : null}>{menu}</div>
      </div>
    );
  };

  onInputKeyDown = (e) => {
    const { nameReportees } = this.state;

    if (e.keyCode === 8) {
      if (nameReportees === '' && e.target.value === '') {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  };

  /// ///////////////////////////////////////////////// [END] REPORTEES FIELD ////////////////////////////////////////////////////

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
    const { listReporteesId, nameReportees, isSearch } = this.state;

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
                  listReporteesId.length > 0 && !isSearch ? InternalStyle.placeholderReportees : ''
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
                        /// /////////////////////// [START] REPORTEES FIELD //////////////////////////
                        onInputKeyDown={this.onInputKeyDown} // Fix issue pressing BACKSPACE key event
                        onBlur={
                          // Handle fetch reportees
                          item.title === 'reportees'
                            ? () => {
                                this.setState({ nameReportees: '', isSearch: false });
                                if (nameReportees !== '') this.fetchReportees('');
                              }
                            : null
                        }
                        tagRender={() => null}
                        onDeselect={item.title === 'reportees' ? this.onDeselectReportees : null}
                        onSelect={item.title === 'reportees' ? this.onSelectReportees : null}
                        mode={item.title === 'reportees' ? 'multiple' : null}
                        onSearch={
                          item.title === 'reportees'
                            ? (value) => this.onSearchReportees(value)
                            : null
                        }
                        dropdownRender={
                          item.title === 'reportees' ? (menu) => this.dropdownRender(menu) : null
                        }
                        className={item.title === 'reportees' ? className : styles}
                        value={item.title === 'reportees' ? listReporteesId : null}
                        /// /////////////////////// [END] REPORTEES FIELD //////////////////////////
                        menuItemSelectedIcon={null}
                        loading={
                          (item.title === 'title' ? loading2 : null) ||
                          (item.title === 'reportingManager' ? loading3 : null) ||
                          (item.title === 'reportees' ? loading4 : null) ||
                          (item.title === 'department' ? loading1 : null)
                        }
                        placeholder={item.placeholder}
                        onChange={(value) => this.onChangeValue(value, item.title)}
                        disabled={
                          !!(item.title === 'grade' && jobGradeList.length <= 0) ||
                          (item.title === 'reportingManager' && managerList.length <= 0) ||
                          (item.title === 'reportees' &&
                            reporteeList.length <= 0 &&
                            nameReportees === '') ||
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
                          if (item.title === 'reportees') {
                            return true;
                          }
                          return (
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1
                          );
                        }}
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
