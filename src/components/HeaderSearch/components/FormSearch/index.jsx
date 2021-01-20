/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { Form, Button, Select, DatePicker } from 'antd';
import styles from './index.less';

const { Option } = Select;

const listType = ['doc', 'csv', 'xsxl', 'jpeg', 'mp4'];
const listAssigned = [
  'Krithi Priyadarshini',
  'Shipra Purohit',
  'Aditya Venkatesan',
  'Manasi Sanghani',
];

// const listLocation = [
//   'Employee Directory',
//   'Reports',
//   'Company Profile',
//   'Payroll',
//   'Hiring',
//   'PM',
//   'Timesheet',
//   'Performance ',
// ];

class FormSearch extends Component {
  formRef = React.createRef();

  onFinish = (values) => {
    const { handleSearch = () => {} } = this.props;
    handleSearch(values);
  };

  onReset = () => {
    this.formRef.current.resetFields();
  };

  renderButton = (getFieldsValue) => {
    const arrValues = Object.values(getFieldsValue());
    const check = arrValues.filter((item) => item);
    return (
      <div className={styles.viewBtn}>
        <Button
          className={styles.btnReset}
          htmlType="button"
          onClick={this.onReset}
          disabled={check.length === 0}
        >
          Reset
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          className={styles.btnSubmit}
          disabled={check.length === 0}
        >
          Submit
        </Button>
      </div>
    );
  };

  render() {
    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 8,
      },
    };

    return (
      <div className={styles.root}>
        <Form
          {...layout}
          colon={false}
          ref={this.formRef}
          name="control-ref"
          onFinish={this.onFinish}
          labelAlign="left"
        >
          <div className={styles.formField}>
            <Form.Item name="type" label="Type">
              <Select placeholder="Event, .doc, .xlsx, csv" allowClear>
                {listType.map((item) => (
                  <Option key={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="assigned" label="Assigned">
              <Select placeholder="Enter name of assignee" allowClear>
                {listAssigned.map((item) => (
                  <Option key={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
            {/* <Form.Item name="location" label="Location">
              <Select placeholder="Select location" allowClear>
                {listLocation.map((item) => (
                  <Option key={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item> */}
            <Form.Item name="dateModified" label="Date Modified">
              <DatePicker />
            </Form.Item>
            {/* <Form.Item name="includesTheWords" label="Includes the words">
              <Input.TextArea />
            </Form.Item> */}
          </div>
          <Form.Item noStyle shouldUpdate>
            {({ getFieldsValue }) => this.renderButton(getFieldsValue)}
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default FormSearch;
