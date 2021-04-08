/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button, Form, Select, Result } from 'antd';
import { connect } from 'umi';
import _ from 'lodash';
import { getCurrentTenant } from '@/utils/authority';
import moment from 'moment';
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
  // static getDerivedStateFromProps(props) {
  //   if ('statusImportEmployees' in props && props.statusImportEmployees) {
  //     if (props.company !== '') {
  //       console.log('props.company: ', props.company);
  //       return { company: props.company?._id };
  //     }
  //     return { company: '' };
  //   }
  //   return null;
  // }

  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      company: '',
      // objectEmployee: {
      //   location: 'Location',
      //   department: 'Department',
      //   employeeId: 'Employee Id',
      //   workEmail: 'Work Email',
      //   personalEmail: 'Personal Email',
      //   managerWorkEmail: 'Manager Work Email',
      //   firstName: 'First Name',
      //   lastName: 'Last Name',
      //   title: 'Job Title',
      //   personalNumber: 'Personal Number',
      // },
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
      const value = `${keys.map((k) => obj[k]).join('_')}`.split('_');
      dataExport.push(value);
    });

    return dataExport;
  };

  handleCancel = () => {
    const { handleCancel, dispatch } = this.props;
    this.setState({ employees: [] }, () => handleCancel());
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
        managerWorkEmail: item['Manager Work Email'],
        title: item['Job Title'],
        personalNumber: item['Personal Number'],
      };
    });
    this.setState({
      employees,
    });
  };

  callAPIImportCSV = () => {
    const { employees, company } = this.state;
    const { handleCancel = () => {} } = this.props;
    const tenantId = getCurrentTenant();

    const payload = {
      company,
      tenantId,
      employees,
    };

    const { dispatch } = this.props;
    dispatch({
      type: 'employeesManagement/importEmployeesTenant',
      payload,
    }).then(() => {
      this.setState({ company: '', employees: [] });
      handleCancel();
      this.modalNotification();
    });
  };

  modalNotification = () => {
    const { listEmployeesTenant } = this.props;
    const { newList = [], existList = [] } = listEmployeesTenant;
    if (!_.isEmpty(existList)) {
      Modal.error({
        icon: <div style={{ display: 'none' }} />,
        content: (
          <Result
            status="error"
            style={{ padding: 0, height: '200px' }}
            title="Added employees failed !"
            subTitle="[FAILED] - Work Email existed!"
            extra="Please check Result_Import_Employees.csv below !"
          />
        ),
      });
    }

    let notiErr = [];
    let notiSuccess = [];

    newList.forEach((item) => {
      const { isAdded, status = '' } = item;
      if (!isAdded && status.includes('[FAILED]')) {
        notiErr.push(status);
      }

      if (isAdded && status.includes('[SUCCESS]')) {
        notiSuccess.push('[SUCCESS]');
      }
    });

    notiErr = [...new Set(notiErr)];
    notiSuccess = [...new Set(notiSuccess)];

    if (notiSuccess.length > 0) {
      Modal.success({
        icon: <div style={{ display: 'none' }} />,
        content: (
          <Result
            style={{ padding: 0, height: '200px' }}
            status="success"
            title="Added employees successfully !"
          />
        ),
      });
    }

    if (notiErr.length > 0) {
      Modal.error({
        icon: <div style={{ display: 'none' }} />,
        content: (
          <Result
            status="error"
            style={{ padding: 0, height: '200px' }}
            title="Added employees failed !"
            subTitle={notiErr.map((item) => item)}
            extra="Please check Result_Import_Employees.csv below !"
          />
        ),
      });
    }
  };

  renderFormImport = (companyProps) => {
    const { companyList } = this.props;
    const currentTenant = getCurrentTenant();

    const renderList = () => {
      return companyProps.filter((item) => item.tenant === currentTenant);
    };

    if (companyProps) {
      return (
        <Form
          ref={this.formRef}
          initialValues={{
            company: companyProps._id,
          }}
        >
          <Form.Item label="Company" name="company" rules={[{ required: true }]}>
            <Select
              placeholder="Select Current Company"
              showArrow
              showSearch
              onChange={(value) => this.onChangeSelect(value)}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {renderList().map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      );
    }
    return (
      <Form ref={this.formRef}>
        <Form.Item label="Company" name="company" rules={[{ required: true }]}>
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
        </Form.Item>
      </Form>
    );
  };

  render() {
    const { visible = false, loading, company: companyProps } = this.props;
    const { company = '', employees } = this.state;
    console.log(employees);
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
              disabled={employees.length === 0 || company === ''}
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
              disabled={company === ''}
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
