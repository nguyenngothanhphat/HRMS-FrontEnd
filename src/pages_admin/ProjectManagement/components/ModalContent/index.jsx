import React, { useState, useEffect } from 'react';

// import { formatMessage } from 'umi';
import { Form } from 'antd';
import FormProject from '../FormProject';

import s from './index.less';

const { Item } = Form;

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

const ModalContent = (props) => {
  const {
    projectInfo: { projectName = '' },
  } = props;
  console.log(props);
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
  const onFinish = (v) => {
    console.log(v);
    console.log('SUBMIT');
  };

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

  useEffect(() => {
    console.log('FORM');
    console.log(formInfo);
  }, [formInfo]);

  const onFormChange = (values, index) => {
    // formInfo
    setFormInfo((prevState) => {
      const newState = [...prevState];
      newState[index] = values;
      return newState;
    });
    // console.log(formInfo);
    // console.log(values, index);
  };

  return (
    <div className={s.modalContent}>
      <h3>Project name: {projectName} </h3>

      <Form form={form} name="myForm" onFinish={onFinish} initialValues={initialValues}>
        <Item name="project">
          {temp.map((item) => (
            <FormProject
              key={item.id}
              listEmployee={MOCK_EMPLOYEE}
              listRole={MOCK_ROLE}
              index={item.id}
              onFormChange={onFormChange}
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
          <button className={s.primary} type="submit">
            Assign
          </button>
        </Item>
      </Form>
    </div>
  );
};

export default ModalContent;
