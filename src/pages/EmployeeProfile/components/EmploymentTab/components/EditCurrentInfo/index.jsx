/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-curly-newline */
import React, { PureComponent } from 'react';
import { Form, Select, Button, DatePicker, InputNumber, Skeleton } from 'antd';
import { formatMessage, connect } from 'umi';
import moment from 'moment';
import styles from './index.less';

const { Option } = Select;

@connect(({ employeeProfile, loading, employeeProfile: { tenantCurrentEmployee = '' } = {} }) => ({
  employeeProfile,
  tenantCurrentEmployee,
  loadingLocationsList: loading.effects['employeeProfile/fetchLocationsByCompany'],
  loadingTitleList: loading.effects['employeeProfile/fetchTitleByDepartment'],
  // loadingEmployeeTypes: loading.effects['employeeProfile/fetchEmployeeTypes'],
}))
class EditCurrentInfo extends PureComponent {
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

  handleSave = (values, id) => {
    const { dispatch, employeeProfile, tenantCurrentEmployee = '' } = this.props;
    const { company = '' } = employeeProfile.originData.employmentData;
    const { title, joinDate, location, employeeType } = values;
    const payload = {
      id,
      title,
      joinDate,
      location,
      employeeType,
      company: company._id,
      tenantId: tenantCurrentEmployee,
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
      loadingTitleList,
      loadingLocationsList,
      handleCancel = () => {},
    } = this.props;

    const {
      _id = '',
      title = '',
      joinDate = '',
      location = '',
      employeeType = '',
      manager = '',
    } = employeeProfile.originData.employmentData;
    const {
      compensationType = '',
      currentAnnualCTC = '',
      // timeOffPolicy = ''
    } = employeeProfile.originData.compensationData;

    const dateFormat = 'MM.DD.YY';

    if (loadingLocationsList || loadingTitleList) {
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
          layout="horizontal"
          {...formLayout}
          initialValues={{
            title: title._id,
            joinDate: joinDate && moment(joinDate).locale('en'),
            location: location._id,
            employeeType: employeeType._id,
            manager: (manager && manager._id) || null,
            compensationType,
            currentAnnualCTC,
            // timeOffPolicy,
          }}
          onFinish={(values) => this.handleSave(values, _id)}
        >
          <Form.Item label="Title" name="title">
            <Select
              placeholder="Title"
              showArrow
              showSearch
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {employeeProfile.listTitleByDepartment.map((item) => (
                <Option key={item._id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'pages_admin.employees.table.joinedDate' })}
            name="joinDate"
          >
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
              {employeeProfile.listLocationsByCompany.map((item) => (
                <Option key={item._id}>{item.name}</Option>
              ))}
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
          <Form.Item label="Compensation Type" name="compensationType">
            <Select
              showSearch
              placeholder="Select an compensation type"
              optionFilterProp="children"
              disabled
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
          </Form.Item>
          <Form.Item
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
              disabled
              min={0}
              style={{ width: '100%' }}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Enter an amount"
            />
          </Form.Item>
          <Form.Item label="Manager" name="manager">
            <Select
              disabled
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {employeeProfile.employees.map((item, index) => {
                return (
                  <Option key={`${index + 1}`} value={item._id}>
                    {item.generalInfo.firstName || item.generalInfo.legalName || null}
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
