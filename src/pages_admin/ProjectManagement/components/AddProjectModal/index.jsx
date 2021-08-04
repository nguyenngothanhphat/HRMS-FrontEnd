import React, { useState, useEffect } from 'react';

import { connect } from 'umi';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';

import moment from 'moment';
import s from './index.less';

const dateFormat = 'MM.DD.YY';
const { Item } = Form;
const { Option } = Select;

const AddProjectModal = (props) => {
  const {
    dispatch,
    visible = false,
    companiesOfUser = [],
    listLocationsByCompany = [],
    employeeList = [],
    loadingEmployeeList = false,
    loadingAddProject = false,
    onDone = () => {},
  } = props;
  const [selectedCompany, setSelectedCompany] = useState('');
  const [beginDate, setBeginDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [form] = Form.useForm();

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

  const onFinish = (values) => {
    dispatch({
      type: 'projectManagement/addNewProject',
      payload: values,
    }).then((res) => {
      if (res.statusCode === 200) {
        onDone();
      }
    });
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <Modal onCancel={() => onDone()} className={s.AddProjectModal} visible={visible} footer={null}>
      <h3>Add new project</h3>
      <Form {...layout} onFinish={onFinish} form={form} name="myForm">
        <Item rules={[{ required: true }]} label="Project Name" name="name">
          <Input placeholder="Name" />
        </Item>
        <Item rules={[{ required: true }]} label="Location" name="location">
          <Select placeholder="Select Location" allowClear>
            {listLocationsByCompany.map((location) => {
              return <Option value={location._id}>{location.name || ''}</Option>;
            })}
          </Select>
        </Item>
        <Item rules={[{ required: true }]} label="Company" name="company">
          <Select
            onChange={(value) => {
              setSelectedCompany(value);
            }}
            placeholder="Select Company"
            allowClear
          >
            {companiesOfUser.map((company) => {
              return <Option value={company._id}>{company.name || ''}</Option>;
            })}
          </Select>
        </Item>
        <Item rules={[{ required: true }]} label="Manager" name="manager">
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
        <Item rules={[{ required: true }]} label="Project Health" name="projectHealth">
          <Input placeholder="Project Health" />
        </Item>
        <Item rules={[{ required: true }]} label="Begin date" name="beginDate">
          <DatePicker
            format={dateFormat}
            onChange={(val) => setBeginDate(val)}
            disabledDate={disabledBeginDate}
          />
        </Item>
        <Item rules={[{ required: true }]} label="End date" name="endDate">
          <DatePicker
            format={dateFormat}
            onChange={(val) => setEndDate(val)}
            disabledDate={disabledEndDate}
          />
        </Item>
      </Form>
      <div className={s.footer}>
        <Button className={s.cancelButton} type="link" htmlType="button" onClick={() => onDone()}>
          <span>Cancel</span>
        </Button>
        <Button
          loading={loadingAddProject}
          type="submit"
          htmlType="submit"
          key="submit"
          form="myForm"
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
};

export default connect(
  ({
    locationSelection: { listLocationsByCompany = [] } = {},
    user: { companiesOfUser = [] } = {},
    projectManagement: { employeeList = [] } = {},
    loading,
  }) => ({
    listLocationsByCompany,
    companiesOfUser,
    employeeList,
    loadingEmployeeList: loading.effects['projectManagement/getEmployees'],
    loadingAddProject: loading.effects['projectManagement/addNewProject'],
  }),
)(AddProjectModal);
