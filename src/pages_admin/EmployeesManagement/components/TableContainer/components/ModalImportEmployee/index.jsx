/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button, Form, Select } from 'antd';
import { connect } from 'umi';
import ImportCSV from '@/components/ImportCSV';

import styles from './index.less';

const { Option } = Select;

@connect(({ loading, employeesManagement: { companyList = [], statusImportEmployees } }) => ({
  loading: loading.effects['employeesManagement/importEmployees'],
  companyList,
  statusImportEmployees,
}))
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
      company: '',
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
  }

  handleCancel = () => {
    const { handleCancel, dispatch } = this.props;
    this.setState({ company: '', employees: [] }, () => handleCancel());
    dispatch({
      type: 'employeesManagement/save',
      payload: {
        statusImportEmployees: false,
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
    data.map((item) => {
      delete item.no;
      return null;
    });
    this.setState({
      employees: data,
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
    const { visible = false, companyList, loading } = this.props;
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
