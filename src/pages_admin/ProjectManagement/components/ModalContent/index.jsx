import React, { useState } from 'react';

import { formatMessage } from 'umi';
import { Table, Select, Form, Button } from 'antd';
import CustomModal from '@/components/CustomModal';

import s from './index.less';

const { Item } = Form;
const { Option } = Select;

const MOCK_EMPLOYEE = [
  {
    id: '1',
    name: 'John Doe 1',
  },
  {
    id: '2',
    name: 'John Doe 2',
  },
  {
    id: '3',
    name: 'John Doe 3',
  },
  {
    id: '4',
    name: 'John Doe 4',
  },
];

const ModalContent = () => {
  const onFinish = (v) => {
    console.log(v);
    console.log('SUBMIT');
  };

  return (
    <div className={s.modalContent}>
      <p>Project name: Test1</p>
      <Form name="myForm" onFinish={onFinish}>
        <Item name="employee" label="Employee">
          <Select
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {MOCK_EMPLOYEE.map((employee) => {
              const { id = '', name = '' } = employee;
              return <Option value={id}>{name}</Option>;
            })}
          </Select>
        </Item>

        {/* <Button htmlType="submit">Assign</Button> */}
        <Item>
          <button type="submit">Assign</button>
        </Item>
      </Form>
    </div>
  );
};

export default ModalContent;
