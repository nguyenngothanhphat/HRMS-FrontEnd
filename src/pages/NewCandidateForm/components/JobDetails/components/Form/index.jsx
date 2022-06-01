/* eslint-disable react/no-array-index-key */
import { Checkbox, Col, DatePicker, Form, Row, Select, TreeSelect } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import styles from './index.less';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';

const { Option } = Select;
const { TreeNode } = TreeSelect;

const JobDetailForm = (props) => {
  const [form] = Form.useForm();
  const [isShowClientLocation, setIsShowClientLocation] = useState(false)
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
        managerList = [],
        jobGradeLevelList = [],
        // values
        position = '',
        grade,
        department,
        workLocation,
        workFromHome,
        clientLocation,
        title,
        reportingManager,
        dateOfJoining = '',
        employeeType,
        processStatus = '',
      } = {},
    } = {},
    validateFields = () => {},
    setNeedRefreshDocument = () => {},
    loadingFetchTitle = false,
  } = props;

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
      case 'dateOfJoining':
      case 'reportingManager': {
        saveToRedux({
          [type]: value,
        });
        break;
      }

      case 'workLocation': {
        const selectedWorkLocation = locationList.find((x) => x._id === value);
        if (value === 'work from home') {
          saveToRedux({
            workFromHome: true,
            workLocation: null,
            clientLocation: null,
          });
          setIsShowClientLocation(false)
        } else if (selectedWorkLocation) {
          saveToRedux({
            location: value,
            workLocation: selectedWorkLocation,
            workFromHome: false,
            clientLocation: null,
          });
          setIsShowClientLocation(false)
        } else {
          setIsShowClientLocation(true)
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
      value: 'EMPLOYEE',
      label: 'Employee',
    },
    {
      value: 'CONTINGENT-WORKER',
      label: 'Contingent Worker',
    },
  ];

  const renderCheckboxes = () => {
    const arr = [
      {
        label: 'Position',
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
        label: 'Employee Type',
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
            treeLine
            placeholder="Select the work location"
            onChange={(value) => onChangeValue(value, 'workLocation')}
            disabled={disabled || ![NEW_PROCESS_STATUS.DRAFT].includes(processStatus)}
            showSearch
            showArrow
            allowClear
            filterOption={(input, option) => {
              return option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1;
            }}
          >
            <TreeNode title="Office Location">
              {locationList.map((x, index) => (
                <TreeNode title={x.name} value={x._id} key={index} />
              ))}
            </TreeNode>
            <TreeNode title="Work From Home" value="work from home" />
            <TreeNode title="Client Location" value="client location" />
          </TreeSelect>
        ),
      },
      {
        title: 'clientLocation',
        name: 'Client Location',
        id: 2,
        rules: [
          {
            required: false,
          },
        ],
        component: (
          isShowClientLocation && 
          <TreeSelect
            treeLine
            placeholder="Select the client location"
            onChange={(value) => onChangeValue(value, 'clientLocation')}
            disabled={disabled}
            showSearch
            showArrow
            allowClear
            filterOption={(input, option) => {
            return option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1;
          }}
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
        )
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
          <Select
            placeholder="Select the reporting manager"
            onChange={(value) => onChangeValue(value, 'reportingManager')}
            disabled={disabled}
            showSearch
            showArrow
            allowClear
            filterOption={(input, option) => {
              return option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1;
            }}
          >
            {managerList.map((x, index) => (
              <Option value={x._id} key={index}>
                {x.generalInfo?.legalName}
              </Option>
            ))}
          </Select>
        ),
      },
    ];
    return (
      <div className={styles.selectors}>
        <Row gutter={[24, 0]}>
          {selectors.map((x, i) => {
            return (
              <Col span={24} md={12} key={i}>
                <Form.Item
                  rules={x.rules}
                  name={x.title}
                  label={x.name !== 'Client Location'|| isShowClientLocation ? x.name : null}
                >
                  {x.component}
                </Form.Item>
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
            format="MM/DD/YYYY"
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
          workLocation: workLocation ? workLocation._id : clientLocation || workFromHome && 'Work From Home',
          department: department?._id || department,
          title: title?._id || title,
          grade: grade?._id || grade,
          reportingManager: reportingManager?._id || reportingManager,
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
