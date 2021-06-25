import React, { useState, useEffect } from 'react';
import { Row, Col, Select, InputNumber } from 'antd';

import s from './index.less';

const { Option } = Select;

const FormProject = (props) => {
  const { listEmployee = [], listRole = [], index = 0, onFormChange } = props;

  const [info, setInfo] = useState({
    employee: {
      id: '',
      name: '',
    },
    role: '',
    effort: '',
  });

  useEffect(() => {
    onFormChange(info, index);
  }, [info]);

  const { employee = {}, role = '', effort = 0 } = info;

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
            // defaultValue={role.id}
            defaultValue={role[0]}
            onChange={(_, option) => {
              if (!option) {
                return;
              }
              const { value = '', children = '' } = option;
              // console.log(option);
              updateInfo('role', children);
            }}
          >
            {listRole.map((roleItem) => {
              return <Option value={roleItem}>{roleItem}</Option>;
            })}
          </Select>
        </Col>

        <Col span={4}>
          <span className={s.label}>Effort</span>
          <InputNumber
            defaultValue={effort}
            min={0}
            max={100}
            onChange={(value) => {
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
