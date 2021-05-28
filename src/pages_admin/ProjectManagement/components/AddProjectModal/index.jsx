import React, { useState, useEffect } from 'react';

// import { formatMessage } from 'umi';
import { Form, Button, Input, Select, DatePicker } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import FormProject from '../FormProject';

import s from './index.less';

const { Item } = Form;
const { Option } = Select;

const AddProjectModal = (props) => {
  const { visible = false } = props;
  // console.log(props);
  const [form] = Form.useForm();

  return (
    <Modal className={s.AddProjectModal} visible={visible}>
      <h3>Add new project</h3>
      <Form form={form} name="myForm">
        <Item label="Project name" name="name">
          <Input placeholder="Name" />
        </Item>
        <Item label="Location" name="location">
          <Select allowClear>
            <Option>A</Option>
          </Select>
        </Item>
        <Item label="Company" name="company">
          <Select allowClear>
            <Option>A</Option>
          </Select>
        </Item>
        <Item label="Manager" name="manager">
          <Select allowClear>
            <Option>A</Option>
          </Select>
        </Item>
        <Item label="Project Health" name="projectHealth">
          <Input placeholder="Project Health" />
        </Item>
        <Item label="Begin date" name="projectHealth">
          <DatePicker />
        </Item>
      </Form>
    </Modal>
  );
};

export default AddProjectModal;
