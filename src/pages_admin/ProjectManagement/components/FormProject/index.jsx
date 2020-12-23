import React, { useState, useEffect } from 'react';
import { Row, Col, Select, Form, Input } from 'antd';

import s from './index.less';

const { Option } = Select;

const FormProject = (props) => {
  const { listEmployee = [], listRole = [], index = 0, onFormChange } = props;
  console.log(props);

  const [info, setInfo] = useState({
    employee: {
      id: '1',
      name: 'John Doe 1',
    },
    role: {
      id: '1',
      name: 'Project Manager',
    },
    effort: 0,
  });

  useEffect(() => {
    console.log('info: ', info);
    onFormChange(info, index);
  }, [info]);

  const { employee = {}, role = {}, effort = 0 } = info;

  const updateInfo = (field, value) => {
    setInfo((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <div className={s.formProject}>
      <Row gutter={12}>
        <Col span={12}>
          <span className={s.label}>Employee</span>
          <Select
            allowClear
            defaultValue={employee.id}
            onChange={(_, option) => {
              if (!option) {
                return;
              }
              const { value = '', children = '' } = option;
              updateInfo('employee', {
                id: value,
                name: children,
              });
            }}
          >
            {listEmployee.map((employeeItem) => {
              const { id = '', name = '' } = employeeItem;
              return <Option value={id}>{name}</Option>;
            })}
          </Select>
        </Col>
        <Col span={8}>
          <span className={s.label}>Role</span>

          <Select
            allowClear
            defaultValue={role.id}
            onChange={(_, option) => {
              if (!option) {
                return;
              }
              const { value = '', children = '' } = option;
              updateInfo('role', {
                id: value,
                name: children,
              });
            }}
          >
            {listRole.map((roleItem) => {
              const { id = '', name = '' } = roleItem;
              return <Option value={id}>{name}</Option>;
            })}
          </Select>
        </Col>

        <Col span={4}>
          <span className={s.label}>Effort</span>
          <Input
            defaultValue={effort}
            onChange={(e) => {
              const { value } = e.target;
              updateInfo('effort', value);
            }}
          />
          <span style={{ marginLeft: '5px' }}>%</span>
        </Col>
      </Row>
    </div>
  );
};

export default FormProject;
