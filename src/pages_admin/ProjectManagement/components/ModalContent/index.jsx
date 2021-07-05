import React, { useState, useEffect } from 'react';

// import { formatMessage } from 'umi';
import { Form, Button } from 'antd';
import FormProject from '../FormProject';

import s from './index.less';

const { Item } = Form;

const ModalContent = (props) => {
  const {
    projectInfo: { projectName = '', projectId = '', company = '' } = {},
    roleList: roleListProp = [],
    employeeList: employeeListProp = [],
    dispatch,
    user,
    loading,
    closeModal,
  } = props;
  // console.log(props);
  const [form] = Form.useForm();
  const [formInfo, setFormInfo] = useState([
    {
      employee: {
        id: '1',
        name: 'John Doe 1',
      },
      role: {
        id: '1',
        name: 'Project Manager',
      },
      effort: 0,
    },
  ]);
  const [temp, setTemp] = useState([{ id: 0 }]); // to render map function
  const [roleList, setRoleList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);

  useEffect(() => {
    setEmployeeList(employeeListProp);
  }, [employeeListProp]);

  useEffect(() => {
    setRoleList(roleListProp);
  }, [roleListProp]);

  useEffect(() => {
    // Check to validate not assign the same person twice to the project
    if (formInfo.length > 0) {
      const filteredEmployeeList = employeeListProp.filter((item) => {
        const { id = '' } = item;
        return !formInfo.some((formItem) => formItem.employee.id === id);
      });
      setEmployeeList(filteredEmployeeList);
    }

    // Check to validate 1 project lead per project
    const existPM = formInfo.find((item) => {
      const { role } = item;
      return role === 'Project Manager';
    });

    if (existPM) {
      const filteredRoleList = roleListProp.filter((item) => {
        // const { id = '' } = item;
        // return id !== 'MANAGER';
        return item !== 'Project Manager';
      });
      setRoleList(filteredRoleList);
    } else {
      setRoleList(roleListProp);
    }
  }, [formInfo]);

  const initialValues = [
    {
      employee: {
        id: '1',
        name: 'John Doe 1',
      },
      role: {
        id: '11',
        name: 'PM',
      },
      effort: 100,
    },
  ];

  const add = () => {
    setTemp((prevState) => {
      const newState = [...prevState];
      const id = prevState[prevState.length - 1].id + 1;
      newState.push({ id });
      return newState;
    });
  };

  const assign = async () => {
    const members = formInfo.map((item) => {
      return { id: item.employee.id, role: item.role, effort: item.effort };
    });
    if (members.length === 0) {
      return;
    }
    const response = await dispatch({
      type: 'projectManagement/addMember',
      payload: {
        company,
        project: projectId,
        members,
      },
    });
    const { statusCode } = response;
    if (statusCode === 200) {
      closeModal();
    }
  };

  const onFormChange = (values, index) => {
    setFormInfo((prevState) => {
      const newState = [...prevState];
      newState[index] = values;
      return newState;
    });
  };

  return (
    <div className={s.modalContent}>
      <h3>Project name: {projectName} </h3>

      <Form form={form} name="myForm" initialValues={initialValues}>
        <Item name="project">
          {temp.map((item) => (
            <FormProject
              key={item.id}
              listEmployee={employeeList}
              listRole={roleList}
              index={item.id}
              onFormChange={onFormChange}
              formInfo={formInfo}
            />
          ))}
        </Item>
        {/* <Button htmlType="submit">Assign</Button> */}
        <Item>
          <button className={s.add} type="button" onClick={add}>
            + Add more
          </button>
        </Item>
        <Item>
          <Button className={s.primary} type="submit" onClick={assign} loading={loading}>
            Assign
          </Button>
        </Item>
      </Form>
    </div>
  );
};

export default ModalContent;
