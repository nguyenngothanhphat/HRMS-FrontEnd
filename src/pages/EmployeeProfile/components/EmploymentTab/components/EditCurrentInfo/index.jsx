/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-curly-newline */
import { DatePicker, Form, Select } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect, formatMessage } from 'umi';
import DebounceSelect from '@/components/DebounceSelect';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import styles from './index.less';

const { Option } = Select;

@connect(
  ({
    employeeProfile,
    loading,
    employeeProfile: { compensationTypes = [] } = {},
    location: { companyLocationList = {} } = {},
  }) => ({
    employeeProfile,
    compensationTypes,
    loadingTitleList: loading.effects['employeeProfile/fetchTitleByDepartment'],
    loadingCompensationList: loading.effects['employeeProfile/fetchCompensationList'],
    loadingFetchEmployeeList:
      loading.effects['employeeProfile/fetchEmployeeListSingleCompanyEffect'],
    companyLocationList,
    loadingUpdate: loading.effects['employeeProfile/updateEmployment'],
  }),
)
class EditCurrentInfo extends PureComponent {
  formRef = React.createRef();

  componentDidMount() {
    const { employeeProfile, dispatch } = this.props;
    const { department = '' } = employeeProfile.originData.employmentData;
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
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/save',
      payload: {
        isUpdateEmployment: false,
        listTitleByDepartment: [],
        companyLocationList: [],
      },
    });
  }

  onChangeDepartment = (id) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'employeeProfile/fetchTitleByDepartment',
      payload: {
        department: id,
      },
    });
    this.formRef.current.setFieldsValue({
      title: null,
    });
  };

  handleSave = (values, id) => {
    const { dispatch } = this.props;
    const {
      title,
      joinDate,
      initialJoinDate,
      location,
      empTypeOther,
      employeeType,
      manager,
      department,
    } = values;
    const payload = {
      id,
      title,
      joinDate,
      initialJoinDate,
      location,
      employeeType,
      empTypeOther,
      department,
      manager,
    };
    dispatch({
      type: 'employeeProfile/updateEmployment',
      payload,
    });
  };

  onEmployeeSearch = (value) => {
    const { dispatch } = this.props;
    if (!value) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }

    return dispatch({
      type: 'employeeProfile/fetchEmployeeListSingleCompanyEffect',
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

  render() {
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };

    const {
      employeeProfile,
      employeeProfile: { departments = [], listGrades = [] },
      loadingTitleList,
      handleCancel = () => {},
      companyLocationList,
      loadingUpdate = false,
    } = this.props;
    const {
      _id = '',
      title = '',
      joinDate = '',
      location = '',
      department = {},
      employeeType = '',
      initialJoinDate = '',
      empTypeOther = '',
      manager = '',
      compensation = {},
      titleInfo = {},
      initialJoiningDate = '',
    } = employeeProfile.originData.employmentData;

    const compensationType = compensation ? compensation.compensationType : '';

    const dateFormat = 'Do MMMM YYYY';

    return (
      <div className={styles.editCurrentInfo}>
        <Form
          className={styles.editCurrentInfo__form}
          requiredMark={false}
          colon={false}
          labelAlign="left"
          ref={this.formRef}
          layout="horizontal"
          {...formLayout}
          initialValues={{
            title: title._id,
            joinDate: joinDate && moment(joinDate).locale('en'),
            location: location._id,
            employeeType: employeeType._id,
            initialJoinDate: initialJoinDate
              ? initialJoinDate && moment(initialJoinDate).locale('en')
              : joinDate && moment(joinDate).locale('en'),
            empTypeOther,
            department: department?._id,
            manager: (manager && manager._id) || null,
            managerLoading: manager?.generalInfo?.legalName || null,
            compensationType,
            grade: titleInfo?.gradeObj,
            initialJoiningDate:
              (initialJoiningDate && moment(initialJoiningDate).locale('en')) ||
              (joinDate && moment(joinDate).locale('en')),
            // timeOffPolicy,
          }}
          // onFinish={(values) => console.log(values)}
          onFinish={(values) => this.handleSave(values, _id)}
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
              onChange={this.onChangeDepartment}
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
              onChange={this.onChangeGrade}
              disabled
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
              fetchOptions={this.onEmployeeSearch}
              showSearch
              defaultValue={{
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
  }
}

export default EditCurrentInfo;
