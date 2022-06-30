import { Form, Input, Select } from 'antd';
import React, { useState } from 'react';
import styles from '@/pages/Onboarding/components/OnboardingOverview/components/OnboardTable/index.less';

export default function UserNameContent(props) {
  const { onFinish = () => {}, validate = {} } = props;
  const [initialValue, setInitalValue] = useState({});

  return (
    <Form
      name="basic"
      id="usernameForm"
      onFinish={onFinish}
      layout="vertical"
      initialValues={initialValue}
    >
      <div className={styles.documentVerification}>
        <Form.Item
          name="userName"
          label="User Name"
          validateStatus={validate.validateStatus}
          help={validate.errorMsg}
          className={styles.inputForm}
        >
          <Input />
        </Form.Item>
        <Form.Item name="domain" label="Domain" className={styles.selectForm}>
          <Select
            placeholder="Domain"
            allowClear
            showSearch
            showArrow
            // loading={loadingEmployeeList}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {/* {employeeList?.map((item) => (
              <Select.Option key={item.id} value={item.generalInfo?.legalName}>
                {item.generalInfo?.legalName}
              </Select.Option>
            ))} */}
          </Select>
        </Form.Item>
      </div>
    </Form>
  );
}
