import { Checkbox, Form, Input, Select, Spin } from 'antd';
import { isEmpty } from 'lodash';

import React, { useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;

const EditModalContent = (props) => {
  const [form] = Form.useForm();

  const {
    visible = false,
    action = '',
    listDepartments = [],
    // loadingFetchDepartmentList = false,
    loadingFetchDepartmentByID = false,
    loadingFetchEmployeeList = false,
    viewingDepartment: {
      name: nameProp = '',
      departmentParentId: departmentParentIdProp = '',
      hrPOC: hrPOCProp = '',
      financePOC: financePOCProp = '',
      isDivision: isDivisionProp = '',
      _id: _idProp = '',
    } = {},
    viewingDepartment = {},
    listEmployees = [],
    dispatch,
    onClose = () => {},
    selectedDepartmentID = '',
    onRefresh = () => {},
  } = props;

  const fetchEmployeeList = (name = '') => {
    dispatch({
      type: 'adminSetting/fetchEmployeeList',
      payload: { name },
    });
  };

  const fetchDepartmentByID = (id) => {
    dispatch({
      type: 'adminSetting/fetchDepartmentByID',
      payload: {
        id,
      },
    });
  };
  useEffect(() => {
    if (selectedDepartmentID && visible) {
      fetchDepartmentByID(selectedDepartmentID);
    }
  }, [selectedDepartmentID]);

  useEffect(() => {
    if (visible && isEmpty(listEmployees)) {
      fetchEmployeeList();
    }
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      name: nameProp,
      departmentParentId: departmentParentIdProp,
      hrPOC: hrPOCProp,
      financePOC: financePOCProp,
      isDivision: isDivisionProp,
    });
  }, [JSON.stringify(viewingDepartment)]);

  const renderPOC = () => {
    return listEmployees.map((employee) => {
      return <Option value={employee._id}>{employee.generalInfo?.legalName || ''}</Option>;
    });
  };

  const handleDone = () => {
    form.resetFields();
    onClose(false);
  };

  const onFinish = async (values) => {
    const {
      name = '',
      departmentParentId = '',
      hrPOC = '',
      financePOC = '',
      isDivision = false,
    } = values;

    const addDepartment = async () => {
      const res = await dispatch({
        type: 'adminSetting/addDepartment',
        payload: {
          name,
          departmentParentId,
          hrPOC,
          financePOC,
          isDivision,
        },
      });
      if (res.statusCode === 200) {
        onRefresh();
        handleDone();
      }
    };
    const editDepartment = async () => {
      const res = await dispatch({
        type: 'adminSetting/updateDepartment',
        payload: {
          id: selectedDepartmentID,
          name,
          departmentParentId,
          hrPOC,
          financePOC,
          isDivision,
        },
      });
      if (res.statusCode === 200) {
        onRefresh();
        handleDone();
      }
    };

    if (action === 'add') {
      addDepartment();
    }
    if (action === 'edit') {
      editDepartment();
    }
  };

  const onEmployeeSearch = (value) => {
    fetchEmployeeList(value);
  };

  return (
    <>
      <div className={styles.EditModalContent}>
        <Spin spinning={loadingFetchDepartmentByID}>
          <Form name="basic" form={form} id="myForm" onFinish={onFinish}>
            <Form.Item
              label="Department Name"
              name="name"
              labelCol={{ span: 24 }}
              rules={[
                { required: true, message: 'Please enter department name!' },
                () => ({
                  validator(_, value) {
                    if (
                      listDepartments.filter((obj) => obj.name === value && obj._id !== _idProp)
                        .length > 0
                    ) {
                      // eslint-disable-next-line prefer-promise-reject-errors
                      return Promise.reject(`Department name is exist.`);
                    }
                    // eslint-disable-next-line compat/compat
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input placeholder="Enter the department name" />
            </Form.Item>
            <Form.Item
              // rules={[{ required: true, message: 'Please enter parent department name!' }]}
              label="Parent Department Name"
              name="departmentParentId"
              labelCol={{ span: 24 }}
            >
              <Select
                showSearch
                allowClear
                placeholder="Select the parent department"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {listDepartments.map((d) => (
                  <Select.Option key={d.departmentId} value={d.departmentId}>
                    {d.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="HR Point of Contact"
              name="hrPOC"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Please select HR Point of Contact' }]}
            >
              <Select
                loading={loadingFetchEmployeeList}
                disabled={loadingFetchEmployeeList}
                showSearch
                allowClear
                filterOption={false}
                onSearch={onEmployeeSearch}
                placeholder="Select the HR Point of Contact"
              >
                {renderPOC()}
              </Select>
            </Form.Item>
            <Form.Item
              label="Finance Point of Contact"
              name="financePOC"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Please select Finance Point of Contact' }]}
            >
              <Select
                loading={loadingFetchEmployeeList}
                disabled={loadingFetchEmployeeList}
                showSearch
                allowClear
                filterOption={false}
                onSearch={onEmployeeSearch}
                placeholder="Select the Finance Point of Contact"
              >
                {renderPOC()}
              </Select>
            </Form.Item>
            <Form.Item name="isDivision" labelCol={{ span: 24 }} valuePropName="checked">
              <Checkbox defaultChecked={isDivisionProp}>Add as Division</Checkbox>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </>
  );
};

export default connect(
  ({
    loading,
    adminSetting: {
      listEmployees = [],
      viewingDepartment = {},
      tempData: { listDepartments = [] } = {},
    } = {},
  }) => ({
    listDepartments,
    listEmployees,
    viewingDepartment,
    loadingFetchDepartmentList: loading.effects['adminSetting/fetchDepartmentList'],
    loadingFetchDepartmentByID: loading.effects['adminSetting/fetchDepartmentByID'],
    loadingFetchEmployeeList: loading.effects['adminSetting/fetchEmployeeList'],
  }),
)(EditModalContent);
