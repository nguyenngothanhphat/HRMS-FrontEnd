import React, { Component } from 'react';
import { Form, Button, Input, Select, DatePicker, Modal } from 'antd';
import moment from 'moment';

import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;

@connect(
  ({
    employeeProfile: {
      idCurrentEmployee = '',
      tenantCurrentEmployee = '',
      originData: { dependentDetails = [] } = {},
    } = {},
    loading,
  }) => ({
    dependentDetails,
    idCurrentEmployee,
    tenantCurrentEmployee,
    loadingUpdate: loading.effects['employeeProfile/updateEmployeeDependentDetails'],
    loadingAdd: loading.effects['employeeProfile/addDependentsOfEmployee'],
    loadingRemove: loading.effects['employeeProfile/removeEmployeeDependentDetails'],
  }),
)
class ModalAddDependant extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {};
  }

  disabledDate = (current) => {
    // Can not select days after today and today
    return current && current > moment().endOf('day');
  };

  formatData = () => {
    const { data = [] } = this.props;
    if (data.length > 0) {
      return data[0].dependents.map((value) => {
        const {
          firstName = '',
          lastName = '',
          gender = '',
          relationship = '',
          dob = '',
          _id = '',
        } = value;
        return {
          firstName,
          lastName,
          gender,
          relationship,
          dob: moment(dob).locale('en'),
          _id,
        };
      });
    }
    return [
      {
        firstName: '',
        lastName: '',
        gender: '',
        relationship: '',
        dob: null,
      },
    ];
  };

  handleSave = (values) => {
    const { onClose = () => {} } = this.props;
    let payload = {};
    const {
      dispatch,
      dependentDetails = [],
      data = [],
      idCurrentEmployee = '',
      tenantCurrentEmployee = '',
    } = this.props;
    let type = 'employeeProfile/addDependentsOfEmployee';
    if (data.length > 0) {
      payload.dependents = [...this.formatData(), values];
      payload.id = dependentDetails[0]._id;
      payload.tenantId = tenantCurrentEmployee;
      payload.employee = idCurrentEmployee;
      type = 'employeeProfile/updateEmployeeDependentDetails';
    } else {
      payload = {
        employee: idCurrentEmployee,
        dependents: values,
        tenantId: tenantCurrentEmployee,
      };
    }
    dispatch({
      type,
      payload,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        onClose();
      }
    });
  };

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    onClose();
  };

  renderEditForm = () => {
    return (
      <Form className={styles.Form} ref={this.formRef} id="myForm" onFinish={this.handleSave}>
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[
            {
              required: true,
              whitespace: true,
              message: 'Please type first name!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[
            {
              required: true,
              whitespace: true,
              message: 'Please type last name!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Gender"
          name="gender"
          rules={[
            {
              required: true,
              message: 'Please select gender!',
            },
          ]}
        >
          <Select className={styles.selectForm}>
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Relationship"
          name="relationship"
          rules={[
            {
              required: true,
              message: 'Please select the relationship!',
            },
          ]}
        >
          <Select className={styles.selectForm}>
            <Option value="Father">Father</Option>
            <Option value="Mother">Mother</Option>
            <Option value="Spouse">Spouse</Option>
            <Option value="Child">Child</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Date of Birth"
          name="dob"
          rules={[
            {
              required: true,
              message: 'Please choose date of birth!',
            },
          ]}
        >
          <DatePicker
            className={styles.dateForm}
            format="DD/MM/YYYY"
            disabledDate={this.disabledDate}
          />
        </Form.Item>
      </Form>
    );
  };

  render() {
    const { visible, loadingAdd } = this.props;
    const renderModalHeader = () => {
      return (
        <div className={styles.header}>
          <p className={styles.header__text}>Add Dependant</p>
        </div>
      );
    };
    const renderModalContent = () => {
      return <div className={styles.content}>{this.renderEditForm()}</div>;
    };

    return (
      <>
        <Modal
          className={`${styles.AddDependant} ${styles.noPadding}`}
          onCancel={this.handleCancel}
          destroyOnClose
          width={450}
          footer={
            <>
              <Button className={styles.btnCancel} onClick={this.handleCancel}>
                Cancel
              </Button>
              <Button
                className={styles.btnSubmit}
                type="primary"
                htmlType="submit"
                form="myForm"
                loading={loadingAdd}
              >
                Add
              </Button>
            </>
          }
          title={renderModalHeader()}
          centered
          visible={visible}
        >
          {renderModalContent()}
        </Modal>
      </>
    );
  }
}

export default ModalAddDependant;
