/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button, Form, Select } from 'antd';
import { connect } from 'umi';
import _ from 'lodash';
import ImportCSV from '@/components/ImportCSV';
import exportToCsv from '@/utils/exportToCsv';

import styles from './index.less';

const { Option } = Select;

@connect(
  ({
    loading,
    employeesManagement: { companyList = [], statusImportEmployees, returnEmployeesList },
  }) => ({
    loading: loading.effects['employeesManagement/importEmployees'],
    companyList,
    statusImportEmployees,
    returnEmployeesList,
  }),
)
class ModalImportEmployee extends Component {
  static getDerivedStateFromProps(props) {
    if ('statusImportEmployees' in props && props.statusImportEmployees) {
      return { company: '' };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      company: props.company._id,
    };
    this.formRef = React.createRef();
  }

  componentDidUpdate() {
    const { statusImportEmployees, dispatch } = this.props;
    if (statusImportEmployees) {
      this.formRef.current.resetFields();
      dispatch({
        type: 'employeesManagement/save',
        payload: {
          statusImportEmployees: false,
        },
      });
    }
    const { returnEmployeesList } = this.props;
    if (
      statusImportEmployees &&
      !_.isEmpty(returnEmployeesList) &&
      !_.isEmpty(returnEmployeesList.newList)
    ) {
      exportToCsv('Result_Import_Employees.csv', this.processData(returnEmployeesList.newList));
    }
  }

  processData = (array) => {
    // Uppercase first letter
    const capsPopulations = [];
    array.forEach((obj) => {
      const entries = Object.entries(obj);
      const capsEntries = entries.map((entry) => [
        entry[0][0].toUpperCase() + entry[0].slice(1),
        entry[1],
      ]);
      capsPopulations.push(Object.fromEntries(capsEntries));
    });

    // Get keys, header csv
    const keys = Object.keys(capsPopulations[0]);

    const dataExport = [];
    // Build header
    let result = `${keys.join('_')}`;
    result = result.split('_');
    dataExport.push(result);

    // Add the rows
    capsPopulations.forEach((obj) => {
      const value = `${keys.map((k) => obj[k]).join('_')}`.split('_');
      dataExport.push(value);
    });

    return dataExport;
  };

  handleCancel = () => {
    const { handleCancel, dispatch, company } = this.props;
    this.setState({ company: company._id, employees: [] }, () => handleCancel());
    dispatch({
      type: 'employeesManagement/save',
      payload: {
        statusImportEmployees: false,
        returnEmployeesList: {},
      },
    });
  };

  renderHeaderModal = () => {
    const { titleModal = '' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
      </div>
    );
  };

  onChangeSelect = (value) => {
    this.setState({
      company: value,
    });
  };

  handleDataUpload = (data) => {
    const employees = data.map((item) => {
      return {
        location: item.Location,
        department: item.Department,
        employeeId: item['Employee Id'],
        workEmail: item['Work Email'],
        personalEmail: item['Personal Email'],
        managerWorkEmail: item['Manager Work Email'],
        firstName: item['First Name'],
        lastName: item['Last Name'],
        title: item['Job Title'],
        personalNumber: item['Personal Number'],
      };
    });
    data.map((item) => {
      delete item.no;
      return null;
    });
    this.setState({
      employees,
    });
  };

  callAPIImportCSV = () => {
    const { employees, company } = this.state;

    const payload = {
      company,
      employees,
    };

    const { dispatch } = this.props;
    dispatch({
      type: 'employeesManagement/importEmployees',
      payload,
    });
  };

  render() {
    const { visible = false, companyList, loading, company: companyProps } = this.props;
    const { company = '', employees } = this.state;
    return (
      <div>
        <Modal
          style={{ top: 40 }}
          className={styles.modalUpload}
          visible={visible}
          title={this.renderHeaderModal()}
          onCancel={this.handleCancel}
          destroyOnClose
          footer={[
            <div key="cancel" className={styles.btnCancel} onClick={this.handleCancel}>
              Cancel
            </div>,
            <Button
              key="submit"
              htmlType="submit"
              type="primary"
              form="addEmployeeForm"
              disabled={employees.length === 0 || company === ''}
              loading={loading}
              className={styles.btnSubmit}
              onClick={this.callAPIImportCSV}
            >
              Submit
            </Button>,
          ]}
        >
          <Form ref={this.formRef}>
            <Form.Item label="Company" name="company" rules={[{ required: true }]}>
              {companyProps ? (
                <Select defaultValue={companyProps._id} disabled>
                  <Option value={companyProps._id}>{companyProps.name}</Option>
                </Select>
              ) : (
                <Select
                  placeholder="Select Company"
                  showArrow
                  showSearch
                  onChange={(value) => this.onChangeSelect(value)}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {companyList.map((item) => (
                    <Option key={item._id}>{item.name}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Form>
          <div className={styles.FileUploadForm}>
            <ImportCSV
              disabled={company === '' && companyProps === ''}
              onDrop={(result) => {
                this.handleDataUpload(result);
              }}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default ModalImportEmployee;
