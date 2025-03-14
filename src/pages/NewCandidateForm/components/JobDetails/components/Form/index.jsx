/* eslint-disable react/no-array-index-key */
import { Checkbox, Col, DatePicker, Form, Row, Select, TreeSelect } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { isEmpty } from 'lodash';
import { getCurrentTenant } from '@/utils/authority';
import styles from './index.less';
import { NEW_PROCESS_STATUS } from '@/constants/onboarding';
import CheckBoxIcon from '@/assets/onboarding/checkbox.svg';
import UnCheckBoxIcon from '@/assets/onboarding/uncheckbox.svg';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import DebounceSelect from '@/components/DebounceSelect';

const { Option } = Select;
const { TreeNode } = TreeSelect;

const JobDetailForm = (props) => {
  const [form] = Form.useForm();
  const {
    disabled = false,
    dispatch,
    newCandidateForm: {
      tempData,
      tempData: {
        // list
        employeeTypeList = [],
        locationList = [],
        listCustomerLocation = [],
        departmentList = [],
        titleList = [],
        jobGradeLevelList = [],
        // values
        position = '',
        grade,
        department,
        workLocation,
        location,
        workFromHome,
        clientLocation,
        title,
        reportingManager,
        reportingManagerObj = {},
        dateOfJoining = '',
        employeeType,
        processStatus = '',
      } = {},
    } = {},
    validateFields = () => {},
    setNeedRefreshDocument = () => {},
    loadingFetchTitle = false,
  } = props;
  const [isShowClientLocation, setIsShowClientLocation] = useState(Boolean(clientLocation));

  const tenantId = getCurrentTenant();

  const saveToRedux = (values) => {
    dispatch({
      type: 'newCandidateForm/save',
      payload: {
        tempData: {
          ...tempData,
          ...values,
        },
      },
    });
  };

  const onEmployeeSearch = (value) => {
    if (!value) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }

    return dispatch({
      type: 'globalData/fetchEmployeeListEffect',
      payload: {
        name: value,
        status: ['ACTIVE'],
      },
    }).then((res = {}) => {
      const { data = [] } = res;
      return data.map((user) => ({
        label: user.generalInfoInfo?.legalName,
        value: user._id,
      }));
    });
  };

  useEffect(() => {
    if (!employeeType && employeeTypeList.length > 0) {
      const [first] = employeeTypeList;
      form.setFieldsValue({
        employeeType: first._id,
      });
      saveToRedux({
        employeeType: first._id,
      });
    }
  }, [JSON.stringify(employeeTypeList)]);

  useEffect(() => {
    if (grade) {
      form.setFieldsValue({
        grade: grade?._id || grade,
      });
    }
  }, [JSON.stringify(grade)]);

  useEffect(() => {
    if (department) {
      dispatch({
        type: 'newCandidateForm/fetchTitleList',
        payload: {
          department: department?._id || department,
          tenantId,
        },
      });
    }
  }, [JSON.stringify(department)]);

  const onChangeValue = (value, type) => {
    switch (type) {
      case 'employeeType':
      case 'position': {
        // get the selected value
        const selectedChoice = value[value.length - 1];
        // save
        if (selectedChoice) {
          saveToRedux({
            [type]: selectedChoice,
          });
          form.setFieldsValue({
            [type]: selectedChoice,
          });
        } else {
          // if user try to uncheck
          form.setFieldsValue({
            [type]: tempData[type]?._id || tempData[type],
          });
        }
        break;
      }

      case 'department': {
        if (value) {
          saveToRedux({
            department: value,
            title: null,
          });
          form.setFieldsValue({
            title: null,
          });
        }

        break;
      }

      case 'grade':
      case 'dateOfJoining': {
        saveToRedux({
          [type]: value,
        });
        break;
      }
      case 'reportingManager': {
        saveToRedux({
          [type]: value?.value,
          reportingManagerObj: value,
        });
        break;
      }

      case 'workLocation': {
        const selectedWorkLocation = locationList.find((x) => x._id === value);
        if (value === 'client location') {
          setIsShowClientLocation(true);
        }
        if (value === 'work from home') {
          saveToRedux({
            workFromHome: true,
            workLocation: null,
            clientLocation: null,
          });
          setIsShowClientLocation(false);
        }

        if (selectedWorkLocation) {
          saveToRedux({
            location: value,
            workLocation: selectedWorkLocation,
            workFromHome: false,
            clientLocation: null,
          });
          setIsShowClientLocation(false);
        }

        setNeedRefreshDocument(true);
        break;
      }
      case 'clientLocation': {
        saveToRedux({
          clientLocation: value,
          workLocation: null,
          workFromHome: false,
        });
        break;
      }
      case 'title': {
        const titleData = titleList.find((item) => item._id === value);
        if (titleData) {
          saveToRedux({
            grade: titleData?.gradeObj?._id,
            title: value,
          });
        }
        break;
      }

      default:
        break;
    }
    validateFields();
  };

  const positions = [
    {
      value: 'Regular',
      label: 'Regular Worker',
    },
    {
      value: 'Contingent Worker',
      label: 'Contingent Worker',
    },
  ];

  const renderCheckboxes = () => {
    const arr = [
      {
        label: 'Employee Type',
        name: 'position',
        options: positions,
        rules: [
          {
            required: true,
            message: 'Required field!',
          },
        ],
      },
      {
        label: 'Employment Type',
        name: 'employeeType',
        options: employeeTypeList.map((x) => {
          return {
            label: x.name,
            value: x._id,
          };
        }),
        rules: [
          {
            required: true,
            message: 'Required field!',
          },
        ],
      },
    ];

    return arr.map((x) => {
      return (
        <div className={styles.checkBoxesContainer}>
          <Form.Item name={x.name} label={x.label} rules={x.rules} valuePropName="value">
            <Checkbox.Group
              options={x.options}
              onChange={(values) => onChangeValue(values, x.name)}
              disabled={disabled}
            />
          </Form.Item>
        </div>
      );
    });
  };

  const CustomIcon = (value) => {
    if (value === location || workLocation?._id === value) {
      return (
        <>
          <img style={{ width: 15, padding: 1 }} src={CheckBoxIcon} alt="Custom Icon" />
        </>
      );
    }
    return (
      <>
        <img style={{ width: 15, padding: 1 }} src={UnCheckBoxIcon} alt="Custom Icon" />
      </>
    );
  };

  const CustomIconHeader = () => {
    if (!location) {
      if (!isEmpty(workLocation)) {
        return (
          <>
            <img style={{ width: 15, padding: 1 }} src={CheckBoxIcon} alt="Custom Icon" />
          </>
        );
      }
      return (
        <>
          <img style={{ width: 15, padding: 1 }} src={UnCheckBoxIcon} alt="Custom Icon" />
        </>
      );
    }
    return (
      <>
        <img style={{ width: 15, padding: 1 }} src={CheckBoxIcon} alt="Custom Icon" />
      </>
    );
  };

  const CustomIconDisable = () => {
    return (
      <>
        <img style={{ width: 15, padding: 1 }} src={UnCheckBoxIcon} alt="Custom Icon" />
      </>
    );
  };

  const renderSelectors = () => {
    const selectors = [
      {
        title: 'workLocation',
        name: 'Work Location',
        id: 1,
        rules: [
          {
            required: true,
            message: 'Required field!',
          },
        ],
        component: (
          <TreeSelect
            placeholder="Select the work location"
            onChange={(value) => onChangeValue(value, 'workLocation')}
            disabled={disabled || ![NEW_PROCESS_STATUS.DRAFT].includes(processStatus)}
            showSearch
            showArrow
            allowClear
            treeIcon
            treeDefaultExpandAll
            filterTreeNode={(input, treeNode) =>
              treeNode.title.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            <TreeNode icon={CustomIconHeader()} title="Office Location">
              {locationList
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((x, index) => (
                  <TreeNode icon={CustomIcon(x._id)} title={x.name} value={x._id} key={index} />
                ))}
            </TreeNode>
            <TreeNode
              icon={CustomIconDisable()}
              title="Work From Home"
              value="work from home"
              disabled
            />
            <TreeNode
              icon={CustomIconDisable()}
              title="Client Location"
              value="client location"
              disabled
            />
          </TreeSelect>
        ),
      },
      {
        title: 'clientLocation',
        name: 'Client Location',
        id: 2,
        rules: [
          {
            required: true,
            message: 'Required field!',
          },
        ],
        hide: !isShowClientLocation,
        component: (
          <TreeSelect
            treeLine
            placeholder="Select the client location"
            onChange={(value) => onChangeValue(value, 'clientLocation')}
            disabled={disabled}
            showSearch
            showArrow
            allowClear
          >
            {listCustomerLocation.map((x) => (
              <TreeNode title={x.legalName} key={`${x.customerId}`}>
                {x.location.map((local, firstIndex) => (
                  <TreeNode title={local.country} key={`${x.customerId + firstIndex}`}>
                    {local.state.map((state, secondIndex) => (
                      <TreeNode
                        title={state.name}
                        key={`${x.customerId + firstIndex + secondIndex}`}
                        value={state.value}
                      />
                    ))}
                  </TreeNode>
                ))}
              </TreeNode>
            ))}
          </TreeSelect>
        ),
      },
      {
        title: 'department',
        name: 'Department',
        id: 3,
        rules: [
          {
            required: true,
            message: 'Required field!',
          },
        ],
        component: (
          <Select
            placeholder="Select the department"
            onChange={(value) => onChangeValue(value, 'department')}
            disabled={disabled || !(workLocation || workFromHome || clientLocation)}
            showSearch
            showArrow
            allowClear
            filterOption={(input, option) => {
              return option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1;
            }}
          >
            {departmentList.map((x, index) => (
              <Option value={x._id} key={index}>
                {x.name}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        title: 'title',
        name: 'Job Title',
        id: 4,
        rules: [
          {
            required: true,
            message: 'Required field!',
          },
        ],
        component: (
          <Select
            placeholder="Select the job title"
            onChange={(value) => onChangeValue(value, 'title')}
            disabled={disabled || !department || loadingFetchTitle}
            showSearch
            showArrow
            allowClear
            filterOption={(input, option) => {
              return option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1;
            }}
            loading={loadingFetchTitle}
          >
            {titleList.map((x, index) => (
              <Option value={x._id} key={index}>
                {x.name}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        title: 'grade',
        name: 'Job Grade',
        id: 5,
        rules: [
          {
            required: true,
            message: 'Required field!',
          },
        ],
        component: (
          <Select
            placeholder="Select the grade"
            onChange={(value) => onChangeValue(value, 'grade')}
            disabled={disabled || !title}
            showSearch
            showArrow
            allowClear
            filterOption={(input, option) => {
              return option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1;
            }}
          >
            {jobGradeLevelList.map((x, index) => (
              <Option value={x._id} key={index}>
                {x.name}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        title: 'reportingManager',
        name: 'Reporting Manager',
        id: 6,
        rules: [
          {
            required: true,
            message: 'Required field!',
          },
        ],
        component: (
          <DebounceSelect
            placeholder="Select the reporting manager"
            fetchOptions={onEmployeeSearch}
            showSearch
            onChange={(value) => onChangeValue(value, 'reportingManager')}
            disabled={disabled}
            labelInValue
            showArrow
            allowClear
            // do not change anything if you do not understand
            defaultOptions={
              reportingManager
                ? {
                    value: reportingManagerObj?.value || reportingManager?._id,
                    label:
                      reportingManagerObj?.label || reportingManager?.generalInfoInfo?.legalName,
                  }
                : null
            }
          />
        ),
      },
    ];
    return (
      <div className={styles.selectors}>
        <Row gutter={[24, 0]}>
          {selectors.map((x, i) => {
            return (
              <Col span={24} md={12} key={i}>
                {!x.hide && (
                  <Form.Item rules={x.rules} name={x.title} label={x.name}>
                    {x.component}
                  </Form.Item>
                )}
              </Col>
            );
          })}
        </Row>
      </div>
    );
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().startOf('day');
  };

  const renderDateOfJoining = () => {
    const items = [
      {
        title: 'dateOfJoining',
        name: 'Preferred date of joining',
        id: 1,
        rules: [
          {
            required: true,
            message: 'Required field!',
          },
        ],
        component: (
          <DatePicker
            className={styles}
            placeholder="Select a date"
            picker="date"
            format={DATE_FORMAT_MDY}
            disabledDate={disabledDate}
            onChange={(value) => onChangeValue(value, 'dateOfJoining')}
          />
        ),
      },
    ];

    return (
      <div className={styles.items}>
        <Row gutter={[24, 24]}>
          {items.map((x) => {
            return (
              <Col span={24} md={12}>
                <Form.Item rules={x.rules} name={x.title} label={x.name}>
                  {x.component}
                </Form.Item>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  };

  return (
    <div className={styles.JobDetailForm}>
      <Form
        name="jobDetailForm"
        form={form}
        layout="vertical"
        initialValues={{
          position: position || 'EMPLOYEE',
          employeeType: employeeType?._id || employeeType,
          workLocation: workLocation
            ? workLocation._id
            : (clientLocation && 'client location') || null, // (workFromHome && 'work from home')
          department: department?._id || department,
          clientLocation,
          title: title?._id || title,
          grade: grade?._id || grade,
          // because debounceSelect has labelInValue, we need to pass the value as value.value
          reportingManager: { value: reportingManager?._id || reportingManager },
          dateOfJoining: dateOfJoining ? moment(dateOfJoining) : null,
        }}
      >
        {renderCheckboxes()}
        {renderSelectors()}
        {renderDateOfJoining()}
      </Form>
    </div>
  );
};

export default connect(({ newCandidateForm, user, loading }) => ({
  newCandidateForm,
  user,

  loadingFetchTitle: loading.effects['newCandidateForm/fetchTitleList'],
}))(JobDetailForm);
