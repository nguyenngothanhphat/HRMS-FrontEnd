import React from 'react';
import { Input, Form, Button } from 'antd';
import { connect, history } from 'umi';
import styles from '../../index.less';

const AdvancedSearchEmployee = (props) => {
  const { employeeAdvance, dispatch } = props;
  const [form] = Form.useForm();

  const onFinish = (obj) => {
    dispatch({
      type: 'searchAdvance/save',
      payload: {
        isSearch: true,
        employeeAdvance: { ...obj },
        keySearch: '',
      },
    });
    history.push('/search-result/employees');
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="advancedSearch"
      onFinish={onFinish}
      initialValues={employeeAdvance}
    >
      <div className={styles.resultContent}>
        <div className={styles.headerFilter}>
          <div className={styles.headerFilter__title}>Personal Details</div>
          <div className={styles.headerFilter__description}>
            Search for personal details such as name, phone number...
          </div>
        </div>
        <div className={styles.containFilter}>
          <div className={styles.filterItem}>
            <Form.Item name="firstName" label="First Name">
              <Input placeholder="Enter first name" />
            </Form.Item>
            <Form.Item name="userId" label="User ID">
              <Input placeholder="Enter user ID" />
            </Form.Item>
            <Form.Item name="state" label="State">
              <Input placeholder="Enter state" />
            </Form.Item>
          </div>

          <div className={styles.filterItem}>
            <Form.Item name="middleName" label="Middle Name">
              <Input placeholder="Enter middle name" />
            </Form.Item>
            <Form.Item name="phoneNumber" label="Phone Number">
              <Input placeholder="Enter phone number" />
            </Form.Item>
            <Form.Item name="country" label="Country">
              <Input placeholder="Enter country" />
            </Form.Item>
          </div>
          <div className={styles.filterItem}>
            <Form.Item name="lastName" label="Last Name">
              <Input placeholder="Enter first name" />
            </Form.Item>
            <Form.Item name="city" label="City">
              <Input placeholder="Enter city" />
            </Form.Item>
          </div>
        </div>
        <div className={styles.headerFilter2}>
          <div className={styles.containFilter__title}>Job Details</div>
          <div className={styles.containFilter__description}>
            Search for job details such as job title, department...
          </div>
        </div>
        <div className={styles.containFilter}>
          <div className={styles.filterItem2}>
            <Form.Item name="employeeId" label="Employee ID">
              <Input placeholder="Enter employee ID" />
            </Form.Item>
            <Form.Item name="skill" label="Skills">
              <Input placeholder="Enter skills" />
            </Form.Item>
            <Form.Item name="building" label="Building">
              <Input placeholder="Enter Building" />
            </Form.Item>
            <Form.Item name="reportingManager" label="Reporting Manager">
              <Input placeholder="Enter reporting manager" />
            </Form.Item>
          </div>

          <div className={styles.filterItem2}>
            <Form.Item name="jobTitle" label="Job Title">
              <Input placeholder="Select job title" />
            </Form.Item>
            <Form.Item name="certification" label="Certifications">
              <Input placeholder="Enter Certifications" />
            </Form.Item>
            <Form.Item name="floor" label="Floor">
              <Input placeholder="Select floor" />
            </Form.Item>
            <Form.Item name="employeeType" label="Employee Type (Regular or Contingent)">
              <Input placeholder="Select employee type" />
            </Form.Item>
          </div>
          <div className={styles.filterItem2}>
            <Form.Item name="department" label="Department">
              <Input placeholder="Enter Department" />
            </Form.Item>
            <Form.Item name="location" label="Location">
              <Input placeholder="Enter city" />
            </Form.Item>
            <Form.Item name="codeNumber" label="Code number">
              <Input placeholder="Enter code number" />
            </Form.Item>
            <Form.Item name="classifications" label="Classification (Intern/Part Time/Full Time)">
              <Input placeholder="Enter Classification " />
            </Form.Item>
          </div>
        </div>
      </div>
      <div className={styles.filterFooter}>
        <Button
          type="link"
          htmlType="button"
          className={styles.btnReset}
          onClick={() => form.resetFields()}
        >
          Reset
        </Button>
        <Button type="primary" htmlType="submit" className={styles.btnSubmit}>
          Search
        </Button>
      </div>
    </Form>
  );
};
export default connect(({ searchAdvance: { employeeAdvance = {} } }) => ({ employeeAdvance }))(
  AdvancedSearchEmployee,
);
// export default AdvancedSearchEmployee;
