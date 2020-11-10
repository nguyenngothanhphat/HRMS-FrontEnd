/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-curly-newline */
import React, { PureComponent } from 'react';
import { Form, Select, Button, DatePicker, InputNumber } from 'antd';
import { formatMessage, connect } from 'umi';
import moment from 'moment';
import styles from './index.less';

const { Option } = Select;

@connect(({ employeeProfile, loading }) => ({
  employeeProfile,
  loadingLocationsList: loading.effects['employeeProfile/fetchLocationsByCompany'],
  loadingTitleList: loading.effects['employeeProfile/fetchTitleByDepartment'],
}))
class EditCurrentInfo extends PureComponent {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/save',
      payload: {
        isUpdateEmployment: false,
      },
    });
  }

  handleSave = (values, id) => {
    const { dispatch } = this.props;
    const { title, joinDate, location, employeeType } = values;
    const payload = {
      id,
      title,
      joinDate,
      location,
      employeeType,
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

    const dateFormat = 'Do MMMM YYYY';

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
            joinDate: moment(joinDate).locale('en'),
            location: location._id,
            employeeType: employeeType._id,
            manager: manager.generalInfo.firstName
              ? `${manager.generalInfo.firstName} ${manager.generalInfo.lastName}`
              : '',
            compensationType,
            currentAnnualCTC,
            // timeOffPolicy,
          }}
          onFinish={(values) => this.handleSave(values, _id)}
        >
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Select
              placeholder="Title"
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
          <Form.Item
            label={formatMessage({ id: 'pages_admin.employees.table.joinedDate' })}
            name="joinDate"
            rules={[{ required: true }]}
          >
            <DatePicker format={dateFormat} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'addEmployee.location' })}
            name="location"
            rules={[{ required: true }]}
          >
            <Select
              placeholder={formatMessage({ id: 'addEmployee.placeholder.location' })}
              showArrow
              showSearch
              loading={loadingLocationsList}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {employeeProfile.listLocationsByCompany.map((item) => (
                <Option key={item._id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Employment Type" name="employeeType" rules={[{ required: true }]}>
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
          <Form.Item label="Compensation Type" name="compensationType" rules={[{ required: true }]}>
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
              { required: true },
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
              // onChange={(value) => onChange(value, 'salary')}
            />
          </Form.Item>
          <Form.Item label="Manager" name="manager" rules={[{ required: true }]}>
            <Select
              disabled
              showSearch
              placeholder="Select a manager"
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
