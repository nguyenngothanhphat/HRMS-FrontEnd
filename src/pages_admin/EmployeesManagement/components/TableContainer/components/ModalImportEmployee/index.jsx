/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button, Form, Select, notification } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import _ from 'lodash';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import ImportCSV from '@/components/ImportCSV';
import exportToCsv from '@/utils/exportToCsv';

import styles from './index.less';

const { Option } = Select;

@connect(
  ({
    loading,
    employeesManagement: {
      companyList = [],
      statusImportEmployees,
      returnEmployeesList,
      listEmployeesTenant = {},
    },
  }) => ({
    // loading: loading.effects['employeesManagement/importEmployees'],
    loading: loading.effects['employeesManagement/importEmployeesTenant'],
    companyList,
    statusImportEmployees,
    returnEmployeesList,
    listEmployeesTenant,
  }),
)
class ModalImportEmployee extends Component {
  static getDerivedStateFromProps(props) {
    const { company = [] } = props;
    if ('statusImportEmployees' in props && props.statusImportEmployees) {
      if (company.length > 0) {
        const companyIDs = company.map((item) => {
          return { company: item?._id };
        });

        return companyIDs;
      }
      return { company: '' };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      company: '',
      isValidateFile: false,
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    const currentCompany = getCurrentCompany();
    const { company = [] } = this.props;
    const currentFirm = company.filter((comp) => comp?._id === currentCompany);
    this.setState({ company: currentFirm[0]._id });
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

    const { listEmployeesTenant } = this.props;
    if (
      statusImportEmployees &&
      !_.isEmpty(listEmployeesTenant) &&
      (!_.isEmpty(listEmployeesTenant.newList) || !_.isEmpty(listEmployeesTenant.existList))
    ) {
      const existList = listEmployeesTenant.existList.map((item) => {
        return {
          ...item,
          isAdded: false,
          status: '[FAILED] - Work Email existed!',
        };
      });
      const exportData = [...listEmployeesTenant.newList, ...existList];
      exportToCsv('Result_Import_Employees.csv', this.processData(exportData));
    }
  }

  processData = (array) => {
    // Uppercase first letter
    let capsPopulations = [];
    capsPopulations = array.map((item) => {
      return {
        'Employee Id': item.employeeId,
        'First Name': item.firstName,
        'Last Name': item.lastName,
        'Joined Date': item.joinDate,
        Location: item.location,
        Department: item.department,
        'Work Email': item.workEmail,
        'Employment Type': item.employeeType,
        'Personal Email': item.personalEmail,
        'Manager Work Email': item.managerWorkEmail,
        Title: item.title,
        'Personal Number': item.personalNumber,
        'Is Added': item.isAdded,
        Status: item.status,
      };
    });

    // Get keys, header csv
    const keys = Object.keys(capsPopulations[0]);
    const dataExport = [];
    dataExport.push(keys);

    // Add the rows
    capsPopulations.forEach((obj) => {
      const value = `${keys.map((k) => obj[k]).join('~')}`.split('~');
      dataExport.push(value);
    });

    return dataExport;
  };

  handleCancel = () => {
    const { handleCancel, dispatch } = this.props;
    this.setState({ employees: [], company: '' }, () => handleCancel());
    dispatch({
      type: 'employeesManagement/save',
      payload: {
        statusImportEmployees: false,
        // returnEmployeesList: {},
        listEmployeesTenant: {},
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
        employeeId: item['Employee Id'],
        firstName: item['First Name'],
        lastName: item['Last Name'],
        joinDate: item['Joined Date'] && moment(new Date(item['Joined Date'])).format('YYYY-MM-DD'),
        workEmail: item['Work Email'],
        location: item.Location,
        department: item.Department,
        personalEmail: item['Personal Email'],
        employeeType: item['Employment Type'],
        managerWorkEmail: item['Manager Work Email'],
        title: item.Title,
        personalNumber: item['Personal Number'],
      };
    });

    let isEmpty = false;
    employees.map((item) => {
      if (
        item.joinDate === '' ||
        item.title === '' ||
        item.personalEmail === '' ||
        item.employeeType === '' ||
        item.location === '' ||
        item.department === ''
      ) {
        isEmpty = true;
      }
      return isEmpty;
    });
    this.setState({
      employees,
      isValidateFile: isEmpty,
    });
  };

  callAPIImportCSV = () => {
    const { employees, company, isValidateFile } = this.state;
    const { handleCancel = () => {}, handleRefresh = () => {} } = this.props;
    const tenantId = getCurrentTenant();

    const payload = {
      company,
      tenantId,
      employees,
    };

    const { dispatch } = this.props;

    if (!isValidateFile) {
      dispatch({
        type: 'employeesManagement/importEmployeesTenant',
        payload,
      }).then(() => {
        this.setState({ company: '', employees: [] });
        handleCancel();
        handleRefresh();
      });
    } else {
      notification.error({ message: 'Submit failed. Please make sure your file is validated !' });
    }
  };

  renderFormImport = (companyProps) => {
    const currentCompany = getCurrentCompany();
    const currentLocation = getCurrentLocation();
    let renderList = [];
    const childCompanyList = companyProps.filter(
      (comp) => comp?.childOfCompany === currentCompany || comp?._id === currentCompany,
    );

    const currentFirm = companyProps.filter((comp) => comp?._id === currentCompany);

    if (!currentLocation) {
      renderList = [...childCompanyList];
    } else {
      const list = childCompanyList.filter((item) => item._id === currentCompany);
      renderList = [...list];
    }

    return (
      <Form
        ref={this.formRef}
        // initialValues={{
        //   company: companyProps._id,
        // }}
      >
        <Form.Item label="Company" name="company" rules={[{ required: true }]}>
          <Select
            placeholder="Select Company"
            showArrow
            showSearch
            defaultValue={currentFirm[0]?.name}
            onChange={(value) => this.onChangeSelect(value)}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {renderList.map((item) => (
              <Option key={item._id} value={item._id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    );
  };

  render() {
    const { visible = false, loading, company: companyProps } = this.props;
    const { employees } = this.state;
    return (
      <div>
        <Modal
          style={{ top: 40 }}
          className={styles.modalUpload}
          visible={visible}
          title={this.renderHeaderModal()}
          onCancel={this.handleCancel}
          destroyOnClose
          maskClosable={false}
          footer={[
            <div key="cancel" className={styles.btnCancel} onClick={this.handleCancel}>
              Cancel
            </div>,
            <Button
              key="submit"
              htmlType="submit"
              type="primary"
              form="addEmployeeForm"
              disabled={employees.length === 0}
              loading={loading}
              className={styles.btnSubmit}
              onClick={this.callAPIImportCSV}
            >
              Submit
            </Button>,
          ]}
        >
          {this.renderFormImport(companyProps)}
          <div className={styles.FileUploadForm}>
            <ImportCSV
              // disabled={company === ''}
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
