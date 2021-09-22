/* eslint-disable react/jsx-curly-newline */
import React, { useEffect } from 'react';
import { Input, Form, Button, Select } from 'antd';
import { connect, history } from 'umi';
import styles from '../../index.less';

const AdvancedSearchEmployee = (props) => {
  const { employeeAdvance, dispatch, listTitle, listDepartment, listLocation, listEmployeeType } =
    props;
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({ type: 'searchAdvance/getListEmployeeType' });
    dispatch({ type: 'searchAdvance/getListLocation' });
    dispatch({ type: 'searchAdvance/getListDepartment' });
    dispatch({ type: 'searchAdvance/getTitleByCompany' });
  }, []);

  const onFinish = (obj) => {
    dispatch({
      type: 'searchAdvance/save',
      payload: {
        isSearch: true,
        isSearchAdvance: true,
        employeeAdvance: { ...obj },
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
          <div className={styles.headerFilter2__title}>Job Details</div>
          <div className={styles.headerFilter2__description}>
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
              <Select
                placeholder="Enter building"
                mode="multiple"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Select.Option key="1" value="1">
                  1
                </Select.Option>
                <Select.Option key="2" value="2">
                  2
                </Select.Option>
                <Select.Option key="3" value="3">
                  3
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="reportingManager" label="Reporting Manager">
              <Input placeholder="Enter reporting manager" />
            </Form.Item>
          </div>

          <div className={styles.filterItem2}>
            <Form.Item name="jobTitle" label="Job Title">
              <Select
                mode="multiple"
                maxTagCount="responsive"
                placeholder="Select job title"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {listTitle.map((item) => (
                  <Select.Option key={item._id} value={item._id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="certification" label="Certifications">
              <Input placeholder="Enter Certifications" />
            </Form.Item>
            <Form.Item name="floor" label="Floor">
              <Select
                placeholder="Enter floor"
                mode="multiple"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Select.Option key="A" value="A">
                  A
                </Select.Option>
                <Select.Option key="B" value="B">
                  B
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="employeeType" label="Employee Type (Regular or Contingent)">
              <Select
                placeholder="Select employee type"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {listEmployeeType.map((item) => (
                  <Select.Option key={item._id} value={item._id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className={styles.filterItem2}>
            <Form.Item name="department" label="Department">
              <Select
                placeholder="Select department"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {listDepartment.map((item) => (
                  <Select.Option key={item._id} value={item._id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="location" label="Location">
              <Select
                placeholder="Enter location"
                mode="multiple"
                maxTagCount="responsive"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {listLocation.map((item) => (
                  <Select.Option key={item._id} value={item._id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="codeNumber" label="Code number">
              <Input placeholder="Enter code number" />
            </Form.Item>
            <Form.Item name="classifications" label="Classification (Intern/Part Time/Full Time)">
              <Select
                placeholder="Enter classification"
                mode="multiple"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {listEmployeeType.map((item) => (
                  <Select.Option key={item._id} value={item._id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
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
export default connect(
  ({
    searchAdvance: {
      employeeAdvance = {},
      defaultList: { listTitle, listDepartment, listLocation, listEmployeeType },
    },
  }) => ({ employeeAdvance, listTitle, listDepartment, listLocation, listEmployeeType }),
)(AdvancedSearchEmployee);
// export default AdvancedSearchEmployee;
