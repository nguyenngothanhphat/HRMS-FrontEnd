import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { getCurrentCompany } from '@/utils/authority';
import { connect } from 'umi';
import styles from './index.less';

const dateFormat = 'MM.DD.YY';
const { Item } = Form;
const { Option } = Select;

const AddProjectModal = (props) => {
  const [form] = Form.useForm();

  const {
    dispatch,
    visible = false,
    companiesOfUser = [],
    listLocationsByCompany = [],
    employeeList = [],
    loadingEmployeeList = false,
    loadingAddProject = false,
    onDone = () => {},
    locationList = [],
    loadingLocation = false,
  } = props;
  const [selectedCompany, setSelectedCompany] = useState('');
  const [beginDate, setBeginDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const renderHeaderModal = () => {
    const { titleModal = 'Add Project' } = props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
      </div>
    );
  };

  useEffect(() => {
    if (selectedCompany) {
      const locationPayload = listLocationsByCompany.map(
        ({ headQuarterAddress: { country: countryItem1 = '' } = {} }) => {
          let stateList = [];
          listLocationsByCompany.forEach(
            ({
              headQuarterAddress: { country: countryItem2 = '', state: stateItem2 = '' } = {},
            }) => {
              if (countryItem1 === countryItem2) {
                stateList = [...stateList, stateItem2];
              }
            },
          );
          return {
            country: countryItem1,
            state: stateList,
          };
        },
      );

      dispatch({
        type: 'projectManagement/getEmployees',
        payload: {
          company: selectedCompany,
          location: locationPayload,
          status: ['ACTIVE'],
        },
      });
    }
    return () => {};
  }, [selectedCompany, companiesOfUser, listLocationsByCompany]);

  // DISABLE DATE OF DATE PICKER
  const disabledBeginDate = (current) => {
    return current >= moment(endDate);
  };

  const disabledEndDate = (current) => {
    return current <= moment(beginDate);
  };

  const onFinish = async (values) => {
    dispatch({
      type: 'projectManagement/addNewProject',
      payload: values,
    }).then((res) => {
      if (res.statusCode === 200) {
        onDone();
        form.resetFields();
      }
    });
  };

  // const layout = {
  //   labelCol: { span: 8 },
  //   wrapperCol: { span: 16 },
  // };

  const companyList = () => {
    return companiesOfUser.filter(
      (comp) => comp?._id === getCurrentCompany() || comp?.childOfCompany === getCurrentCompany(),
    );
  };

  return (
    <>
      <Modal
        className={styles.AddProjectModal}
        onCancel={() => {
          form.resetFields();
          onDone();
        }}
        destroyOnClose
        footer={[
          <Button
            onClick={() => {
              form.resetFields();
              onDone();
            }}
            className={styles.btnCancel}
          >
            Cancel
          </Button>,
          <Button
            className={styles.btnSubmit}
            type="primary"
            form="myForm"
            key="submit"
            loading={loadingAddProject}
            htmlType="submit"
            // loading={loadingReassign}
          >
            Submit
          </Button>,
        ]}
        title={renderHeaderModal()}
        centered
        visible={visible}
      >
        <Form onFinish={onFinish} form={form} name="myForm">
          <Item
            rules={[{ required: true }]}
            labelAlign="left"
            labelCol={{ span: 24 }}
            label="Project Name"
            name="name"
          >
            <Input placeholder="Name" />
          </Item>

          <Item
            rules={[{ required: true }]}
            labelAlign="left"
            labelCol={{ span: 24 }}
            label="Company"
            name="company"
          >
            <Select
              onChange={(value) => {
                setSelectedCompany(value);
                form.setFieldsValue({
                  location: undefined,
                });
                const tenants = companyList().find((val) => val._id === value);
                dispatch({
                  type: 'employeesManagement/fetchLocationList',
                  payload: {
                    tenantId: tenants.tenant,
                    company: value,
                  },
                });
              }}
              placeholder="Select Company"
              allowClear
            >
              {companyList().map((company) => {
                return <Option value={company._id}>{company.name || ''}</Option>;
              })}
            </Select>
          </Item>
          <Item
            rules={[{ required: true }]}
            labelAlign="left"
            labelCol={{ span: 24 }}
            label="Location"
            name="location"
          >
            <Select loading={loadingLocation} placeholder="Select Location" allowClear>
              {locationList.map((location) => {
                return <Option value={location._id}>{location.name || ''}</Option>;
              })}
            </Select>
          </Item>
          <Item
            rules={[{ required: true }]}
            labelAlign="left"
            labelCol={{ span: 24 }}
            label="Manager"
            name="manager"
          >
            <Select
              placeholder="Manager"
              loading={loadingEmployeeList}
              disabled={!selectedCompany || loadingEmployeeList}
              allowClear
            >
              {employeeList.map((emp) => {
                return <Option value={emp.id}>{emp.name || ''}</Option>;
              })}
            </Select>
          </Item>
          <Item
            rules={[{ required: true }]}
            labelAlign="left"
            labelCol={{ span: 24 }}
            label="Project Health"
            name="projectHealth"
          >
            <Input placeholder="Project Health" />
          </Item>
          <Item
            rules={[{ required: true }]}
            labelAlign="left"
            labelCol={{ span: 24 }}
            label="Begin date"
            name="beginDate"
          >
            <DatePicker
              format={dateFormat}
              onChange={(val) => setBeginDate(val)}
              disabledDate={disabledBeginDate}
            />
          </Item>
          <Item
            rules={[{ required: true }]}
            labelAlign="left"
            labelCol={{ span: 24 }}
            label="End date"
            name="endDate"
          >
            <DatePicker
              format={dateFormat}
              onChange={(val) => setEndDate(val)}
              disabledDate={disabledEndDate}
            />
          </Item>
        </Form>
      </Modal>
    </>
  );
};

export default connect(
  ({
    locationSelection: { listLocationsByCompany = [] } = {},
    user: { companiesOfUser = [] } = {},
    projectManagement: { employeeList = [] } = {},
    employeesManagement: { locationList = [] } = {},
    loading,
  }) => ({
    listLocationsByCompany,
    companiesOfUser,
    employeeList,
    locationList,
    loadingEmployeeList: loading.effects['projectManagement/getEmployees'],
    loadingAddProject: loading.effects['projectManagement/addNewProject'],
    loadingLocation: loading.effects['employeesManagement/fetchLocationList'],
  }),
)(AddProjectModal);
