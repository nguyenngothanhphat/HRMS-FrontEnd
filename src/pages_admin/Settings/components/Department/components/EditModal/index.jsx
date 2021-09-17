import { Button, Form, Input, Modal, Select, Skeleton } from 'antd';

import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;

@connect(
  ({
    loading,
    adminSetting: { viewingDepartment = {}, tempData: { listDepartments = [] } = {} } = {},
  }) => ({
    listDepartments,
    viewingDepartment,
    loadingFetchDepartmentList: loading.effects['adminSetting/fetchDepartmentList'],
    loadingFetchDepartmentByID: loading.effects['adminSetting/fetchDepartmentByID'],
    loadingAddDepartment: loading.effects['adminSetting/addDepartment'],
    loadingUpdateDepartment: loading.effects['adminSetting/updateDepartment'],
  }),
)
class EditModal extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  fetchDepartmentList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminSetting/fetchDepartmentList',
    });
  };

  componentDidMount = async () => {
    // this.fetchDepartmentList();
  };

  componentDidUpdate = (prevProps) => {
    const { selectedDepartmentID = '' } = this.props;

    if (selectedDepartmentID && selectedDepartmentID !== prevProps.selectedDepartmentID) {
      this.fetchDepartmentByID(selectedDepartmentID);
    }
  };

  fetchDepartmentByID = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminSetting/fetchDepartmentByID',
      payload: {
        id,
      },
    });
  };

  renderHeaderModal = () => {
    const { action = 'add' } = this.props;
    let title = 'Add New Department';
    if (action === 'edit') {
      title = 'Edit Department';
    }
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  onFinish = async (values) => {
    const { dispatch, selectedDepartmentID = '', onRefresh = () => {} } = this.props;
    const { name = '', departmentParentName = '', hrPOC = '', financePOC = '' } = values;

    const addDepartment = async () => {
      const res = await dispatch({
        type: 'adminSetting/addDepartment',
        payload: {
          name,
          departmentParentName,
          hrPOC,
          financePOC,
        },
      });
      if (res.statusCode === 200) {
        onRefresh();
        this.handleCancel();
      }
    };
    const editDepartment = async () => {
      const res = await dispatch({
        type: 'adminSetting/updateDepartment',
        payload: {
          id: selectedDepartmentID,
          name,
          departmentParentName,
          hrPOC,
          financePOC,
        },
      });
      if (res.statusCode === 200) {
        onRefresh();
        this.handleCancel();
      }
    };

    const { action = '' } = this.props;
    if (action === 'add') {
      addDepartment();
    }
    if (action === 'edit') {
      editDepartment();
    }
  };

  handleCancel = () => {
    const { dispatch, onClose = () => {} } = this.props;
    this.formRef.current.resetFields();
    dispatch({
      type: 'adminSetting/save',
      payload: {
        viewingDepartment: {},
      },
    });

    onClose(false);
  };

  render() {
    const {
      visible = false,
      action = '',
      // listDepartments = [],
      // loadingFetchDepartmentList = false,
      loadingFetchDepartmentByID = false,
      loadingUpdateDepartment = false,
      loadingAddDepartment = false,
      viewingDepartment: {
        name: nameProp = '',
        departmentParentName: departmentParentNameProp = '',
        hrPOC: hrPOCProp = '',
        financePOC = '',
      } = {},
    } = this.props;

    return (
      <>
        <Modal
          className={styles.EditModal}
          onCancel={this.handleCancel}
          destroyOnClose
          footer={[
            <Button onClick={this.handleCancel} className={styles.btnCancel}>
              Cancel
            </Button>,
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
              // disabled={!nameState || !descriptionState || selectedList.length === 0}
              loading={loadingUpdateDepartment || loadingAddDepartment}
            >
              {action === 'add' ? 'Add' : 'Update'}
            </Button>,
          ]}
          title={this.renderHeaderModal()}
          centered
          visible={visible}
        >
          {loadingFetchDepartmentByID ? (
            <Skeleton />
          ) : (
            <Form
              name="basic"
              ref={this.formRef}
              id="myForm"
              onFinish={this.onFinish}
              initialValues={{
                name: nameProp,
                departmentParentName: departmentParentNameProp,
                hrPOC: hrPOCProp,
                financePOC,
              }}
            >
              <Form.Item
                rules={[{ required: true, message: 'Please enter department name!' }]}
                label="Department Name"
                name="name"
                labelCol={{ span: 24 }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                rules={[{ required: true, message: 'Please enter parent department name!' }]}
                label="Parent Department Name"
                name="departmentParentName"
                labelCol={{ span: 24 }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="HR Point of Contact"
                name="hrPOC"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Please select HR Point of Contact' }]}
              >
                <Select showSearch>
                  <Option value="A">A</Option>
                  <Option value="B">B</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Finance Point of Contact"
                name="financePOC"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Please select Finance Point of Contact' }]}
              >
                <Select showSearch>
                  <Option value="A">A</Option>
                  <Option value="B">B</Option>
                </Select>
              </Form.Item>
            </Form>
          )}
        </Modal>
      </>
    );
  }
}

export default EditModal;
