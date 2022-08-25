/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-curly-newline */
import { DatePicker, Form, Select } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { connect, formatMessage } from 'umi';
import DebounceSelect from '@/components/DebounceSelect';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import styles from './index.less';

const { Option } = Select;

const dateFormat = 'Do MMMM YYYY';

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

const EditCurrentInfo = (props) => {
  const [form] = Form.useForm();

  const {
    dispatch,
    employeeProfile,
    employeeProfile: { employee = '', departments = [], listGrades = [] },
    loadingTitleList,
    handleCancel = () => {},
    companyLocationList,
    loadingUpdate = false,
  } = props;

  const {
    title = {},
    joinDate = '',
    location = {},
    department = {},
    employeeType = '',
    initialJoinDate = '',
    empTypeOther = '',
    manager = {},
    compensation = {},
    grade = {},
    initialJoiningDate = '',
  } = employeeProfile.employmentData;

  const compensationType = compensation ? compensation.compensationType : '';

  useEffect(() => {
    dispatch({
      type: 'employeeProfile/fetchTitleByDepartment',
      payload: {
        department: department._id,
      },
    });
    dispatch({
      type: 'employeeProfile/fetchCompensationList',
    });
    dispatch({
      type: 'employeeProfile/fetchGradeList',
    });
    return () => {
      dispatch({
        type: 'employeeProfile/save',
        payload: {
          listTitleByDepartment: [],
          companyLocationList: [],
        },
      });
    };
  }, []);

  const onChangeDepartment = (id) => {
    dispatch({
      type: 'employeeProfile/fetchTitleByDepartment',
      payload: {
        department: id,
      },
    });
    form.setFieldsValue({
      title: null,
    });
  };

  const handleSave = async (values) => {
    const payload = {
      _id: employee,
      title: values.title,
      joinDate: values.joinDate,
      initialJoinDate: values.initialJoinDate,
      location: values.location,
      employeeType: values.employeeType,
      empTypeOther: values.empTypeOther,
      department: values.department,
      manager: values.manager,
      grade: values.grade,
    };
    const res = await dispatch({
      type: 'employeeProfile/patchEmployment',
      payload,
    });
    if (res.statusCode === 200) {
      handleCancel();
    }
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
        label: user.generalInfo?.legalName,
        value: user._id,
      }));
    });
  };

  return (
    <div className={styles.editCurrentInfo}>
      <Form
        className={styles.editCurrentInfo__form}
        requiredMark={false}
        colon={false}
        labelAlign="left"
        form={form}
        layout="horizontal"
        {...formLayout}
        initialValues={{
          title: title?._id,
          joinDate: joinDate && moment(joinDate).locale('en'),
          location: location?._id,
          employeeType: employeeType?._id,
          initialJoinDate: initialJoinDate
            ? initialJoinDate && moment(initialJoinDate).locale('en')
            : joinDate && moment(joinDate).locale('en'),
          empTypeOther,
          department: department?._id,
          manager: (manager && manager?._id) || null,
          managerLoading: manager?.generalInfo?.legalName || null,
          compensationType,
          grade: grade?._id,
          initialJoiningDate:
            (initialJoiningDate && moment(initialJoiningDate).locale('en')) ||
            (joinDate && moment(joinDate).locale('en')),
        }}
        onFinish={(values) => handleSave(values)}
      >
        <Form.Item label="Job Title" name="title">
          <Select
            placeholder="Enter Job Title"
            showArrow
            showSearch
            loading={loadingTitleList}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {employeeProfile.listTitleByDepartment.map((item) => (
              <Option key={item._id}>{item.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Department" name="department">
          <Select
            placeholder="Enter Department"
            showArrow
            onChange={onChangeDepartment}
            showSearch
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {departments.map((item) => (
              <Option key={item._id}>{item.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Grade" name="grade">
          <Select
            placeholder="Enter the grade"
            showArrow
            showSearch
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {listGrades.map((item) => (
              <Option key={item._id}>{item.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Initial Joining Date" name="initialJoinDate">
          <DatePicker format={dateFormat} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Joining Date" name="joinDate">
          <DatePicker format={dateFormat} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'addEmployee.location' })} name="location">
          <Select
            placeholder={formatMessage({ id: 'addEmployee.placeholder.location' })}
            showArrow
            showSearch
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {companyLocationList.map((item) => (
              <Option key={item._id}>{item.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Employee Type" name="empTypeOther">
          <Select
            showSearch
            placeholder="Select an employee type"
            optionFilterProp="children"
            // onChange={(value) => onChange(value, 'employment')}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {['Regular', 'Contingent Worker'].map((x, index) => {
              return (
                <Option key={`${index + 1}`} value={x}>
                  {x}
                </Option>
              );
            })}
            ]
          </Select>
        </Form.Item>
        <Form.Item label="Employment Type" name="employeeType">
          <Select
            showSearch
            placeholder="Select an employment type"
            optionFilterProp="children"
            // onChange={(value) => onChange(value, 'employment')}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {employeeProfile.employeeTypes.map((item, index) => {
              return (
                <Option key={`${index + 1}`} value={item._id}>
                  {item.name}
                </Option>
              );
            })}
            ]
          </Select>
        </Form.Item>

        <Form.Item label="Manager" name="manager">
          <DebounceSelect
            placeholder="Select the manager"
            fetchOptions={onEmployeeSearch}
            showSearch
            defaultOptions={{
              value: manager?._id,
              label: manager?.generalInfo?.legalName,
            }}
          />
        </Form.Item>

        <div className={styles.spaceFooter}>
          <CustomSecondaryButton onClick={handleCancel}>Cancel</CustomSecondaryButton>
          <CustomPrimaryButton htmlType="submit" loading={loadingUpdate}>
            Save
          </CustomPrimaryButton>
        </div>
      </Form>
    </div>
  );
};

export default connect(
  ({ employeeProfile, loading, location: { companyLocationList = {} } = {} }) => ({
    employeeProfile,
    loadingTitleList: loading.effects['employeeProfile/fetchTitleByDepartment'],
    companyLocationList,
    loadingUpdate: loading.effects['employeeProfile/patchEmployment'],
  }),
)(EditCurrentInfo);
