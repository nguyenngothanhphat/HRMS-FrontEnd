/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button, Form, Select } from 'antd';
import { connect } from 'umi';
import ImportCSV from '@/components/ImportCSV';

import styles from './index.less';

const { Option } = Select;

@connect(({ loading, employeesManagement: { companyList = [] } }) => ({
  loading: loading.effects['employeesManagement/importEmployees'],
  companyList,
}))
class ModalImportEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      importData: {},
      employees: [],
      company: '',
      initImport: null,
    };
    this.formRef = React.createRef();
  }

  handleCancel = () => {
    const { handleCancel } = this.props;
    this.setState({}, () => handleCancel());
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
    const { company } = this.state;
    const parseData = {
      company,
      employees: data,
    };
    this.setState({
      importData: parseData,
      employees: data,
    });
  };

  callAPIImportCSV = () => {
    // const { importData } = this.state;
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'employeesManagement/importEmployees',
    //   payload: importData,
    // });
    this.formRef.current.resetFields();
    this.setState({
      importData: '',
      company: '',
      //   initImport: true,
    });
  };

  render() {
    const { visible = false, companyList, loading } = this.props;
    const { company = '', employees, initImport } = this.state;
    return (
      <div>
        <Modal
          style={{ top: 40 }}
          className={styles.modalUpload}
          visible={visible}
          title={this.renderHeaderModal()}
          onOk={this.handleRemoveToServer}
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
