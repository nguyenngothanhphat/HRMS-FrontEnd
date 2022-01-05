/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-curly-newline */
import React, { PureComponent } from 'react';
import { Form, Select, Button, DatePicker, InputNumber, Skeleton } from 'antd';
import { formatMessage, connect } from 'umi';
import moment from 'moment';
import styles from './index.less';

const { Option } = Select;

@connect(
  ({
    employeeProfile,
    loading,
    employeeProfile: { tenantCurrentEmployee = '', compensationTypes = [] } = {},
    locationSelection: { listLocationsByCompany = {} } = {},
  }) => ({
    employeeProfile,
    compensationTypes,
    tenantCurrentEmployee,
    loadingLocationsList: loading.effects['employeeProfile/fetchLocationsByCompany'],
    loadingTitleList: loading.effects['employeeProfile/fetchTitleByDepartment'],
    loadingCompensationList: loading.effects['employeeProfile/fetchCompensationList'],
    listLocationsByCompany,

    // loadingEmployeeTypes: loading.effects['employeeProfile/fetchEmployeeTypes'],
  }),
)
class EditCurrentInfo extends PureComponent {
  formRef = React.createRef();

  componentDidMount() {
    const { employeeProfile, dispatch, tenantCurrentEmployee = '' } = this.props;
    const { department = '', company = '' } = employeeProfile.originData.employmentData;
    const payload = {
      company: company._id,
      department: department._id,
      tenantId: tenantCurrentEmployee,
    };
    // const tenantId = getCurrentTenant();

    dispatch({
      type: 'employeeProfile/fetchEmployeeTypes',
      payload: {
        tenantId: tenantCurrentEmployee,
      },
    });

    dispatch({
      type: 'employeeProfile/fetchTitleByDepartment',
      payload,
    });

    dispatch({
      type: 'employeeProfile/fetchLocationsByCompany',
      payload: {
        company: company._id,
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
        listLocationsByCompany: [],
      },
    });
  }

  onChangeDepartment = (id) => {
    const { employeeProfile, dispatch, tenantCurrentEmployee = '' } = this.props;
    const { company = '' } = employeeProfile.originData.employmentData;

    dispatch({
      type: 'employeeProfile/fetchTitleByDepartment',
      payload: {
        company: company._id,
        department: id,
        tenantId: tenantCurrentEmployee,
      },
    });
    this.formRef.current.setFieldsValue({
      title: null,
    });
  };

  handleSave = (values, id) => {
    const { dispatch, employeeProfile, tenantCurrentEmployee = '' } = this.props;
    const { company = '' } = employeeProfile.originData.employmentData;
    const { title, joinDate, location, employeeType, manager, department } = values;
    const payload = {
      id,
      title,
      joinDate,
      location,
      employeeType,
      company: company._id,
      tenantId: tenantCurrentEmployee,
      department,
      manager,
    };
    dispatch({
      type: 'employeeProfile/updateEmployment',
      payload,
    });
  };

  render() {
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };

    const {
      employeeProfile,
      employeeProfile: { employees = [], departments = [], listGrades = [] },
      loadingTitleList,
      loadingLocationsList,
      handleCancel = () => {},
      listLocationsByCompany,
    } = this.props;
    // console.log(employees)
    // const filteredList = employees.filter((item) => item._id !== employeeProfile.idCurrentEmployee);
    const {
      _id = '',
      title = '',
      joinDate = '',
      location = '',
      department = {},
      employeeType = '',
      manager = '',
      compensation = {},
      titleInfo = {},
    } = employeeProfile.originData.employmentData;
    const compensationType = compensation ? compensation.compensationType : '';
    const {
      // compensationType = '',
      currentAnnualCTC = '',
      // timeOffPolicy = ''
    } = employeeProfile.originData.compensationData;

    const dateFormat = 'Do MMMM YYYY';

    if (loadingLocationsList) {
      return (
        <div className={styles.editCurrentInfo}>
          <Skeleton active />
        </div>
      );
    }

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
            department: department?._id,
            manager: (manager && manager._id) || null,
            compensationType,
            currentAnnualCTC,
            grade: titleInfo?.gradeObj,
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
          <Form.Item label="Initial Joining Date" name="initialJoiningDate">
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
              {listLocationsByCompany.map((item) => (
                <Option key={item._id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Employee Type" name="empType">
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
          {/* <Form.Item label="Compensation Type" name="compensationType">
            <Select
              
              showSearch
              optionFilterProp="children"
              placeholder="Select an compensation type"
              // disabled
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {['Salaried', 'Stock options', 'Other non-cash benefits'].map((item, index) => {
                return (
                  <Option key={`${index + 1}`} value={item}>
                    {item}
                  </Option>
                );
              })}
              ]
            </Select>
          </Form.Item> */}
          {/* <Form.Item
            label="Current Annual CTC"
            name="currentAnnualCTC"
            rules={[
              {
                pattern: /^[0-9]*$/,
                message: 'Current Annual CTC is not correct',
              },
            ]}
          >
            <InputNumber
              
              min={0}
              style={{ width: '100%' }}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Enter an amount"
            />
          </Form.Item> */}
          <Form.Item label="Manager" name="manager">
            <Select
              showSearch
              optionFilterProp="children"
              placeholder="Select a manager"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              defaultValue={manager._id}
            >
              {employees.map((item, index) => {
                return (
                  <Option key={`${index + 1}`} value={item._id}>
                    {item?.generalInfo?.legalName}
                  </Option>
                );
              })}
              ]
            </Select>
          </Form.Item>
          {/* <Form.Item label="Time Off Policy" name="timeOffPolicy" rules={[{ required: true }]}>
            Time Off Policy
          </Form.Item> */}
          <div className={styles.spaceFooter}>
            <div className={styles.btnCancel} onClick={handleCancel}>
              Cancel
            </div>
            <Button type="primary" htmlType="submit" className={styles.btnSubmit}>
              Save
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default EditCurrentInfo;
