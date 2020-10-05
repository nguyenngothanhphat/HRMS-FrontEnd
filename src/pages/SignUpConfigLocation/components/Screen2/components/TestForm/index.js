import React, { useEffect } from 'react';
import { Form, Input } from 'antd';

const TestForm = () => {
  const [form] = Form.useForm();

  useEffect(() => {
    console.log(form.getFieldsValue());
  }, []);

  return (
    <Form
      form={form}
      initialValues={{ remember: true }}
      rules={[{ required: true, message: 'Please input your address!' }]}
    >
      <Form.Item name="address1" label="Address">
        <Input />
      </Form.Item>
    </Form>
  );
};

export default TestForm;
