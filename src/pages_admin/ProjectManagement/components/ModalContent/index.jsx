import React, { useState } from 'react';

import { formatMessage } from 'umi';
import { Table, Select, Form, Button, Row, Col, Input } from 'antd';
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

const MOCK_ROLE = [
  {
    id: '1',
    name: 'Project Manager',
  },
  {
    id: '2',
    name: 'QC',
  },
  {
    id: '3',
    name: 'Developer',
  },
];

const ModalContent = () => {
  const onFinish = (v) => {
    console.log(v);
    console.log('SUBMIT');
  };

  return (
    <div className={s.modalContent}>
      <h3>Project name: Test1</h3>

      <Form name="myForm" onFinish={onFinish}>
        <Row gutter={12}>
          <Col span={12}>
            <Item name="employee" label="Employee">
              <Select allowClear>
                {MOCK_EMPLOYEE.map((employee) => {
                  const { id = '', name = '' } = employee;
                  return <Option value={id}>{name}</Option>;
                })}
              </Select>
            </Item>
          </Col>
          <Col span={7}>
            <Item name="role" label="Role">
              <Select allowClear>
                {MOCK_ROLE.map((role) => {
                  const { id = '', name = '' } = role;
                  return <Option value={id}>{name}</Option>;
                })}
              </Select>
            </Item>
          </Col>

          <Col span={5}>
            <Item name="effort" label="Effort">
              <Input />
            </Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Item name="employee2" label="Employee">
              <Select allowClear>
                {MOCK_EMPLOYEE.map((employee) => {
                  const { id = '', name = '' } = employee;
                  return <Option value={id}>{name}</Option>;
                })}
              </Select>
            </Item>
          </Col>
          <Col span={7}>
            <Item name="role2" label="Role">
              <Select allowClear>
                {MOCK_ROLE.map((role) => {
                  const { id = '', name = '' } = role;
                  return <Option value={id}>{name}</Option>;
                })}
              </Select>
            </Item>
          </Col>

          <Col span={5}>
            <Item name="effort2" label="Effort">
              <Input />
            </Item>
          </Col>
        </Row>

        {/* <Button htmlType="submit">Assign</Button> */}
        <Item>
          <button className={s.add} type="button">
            + Add more
          </button>
        </Item>
        <Item>
          <button className={s.primary} type="submit">
            Assign
          </button>
        </Item>
      </Form>
    </div>
  );
};

export default ModalContent;
