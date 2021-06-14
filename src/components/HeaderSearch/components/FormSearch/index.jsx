/* eslint-disable react/jsx-props-no-spreading */
import { AutoComplete, Button, DatePicker, Form, Input } from 'antd';
import React, { Component } from 'react';
import styles from './index.less';

// const { Option } = Select;

const listType = [
  { value: 'doc' },
  { value: 'csv' },
  { value: 'xsxl' },
  { value: 'jpeg' },
  { value: 'mp4' },
];
const listAssigned = [
  { value: 'Krithi Priyadarshini' },
  { value: 'Shipra Purohit' },
  { value: 'Aditya Venkatesan' },
  { value: 'Manasi Sanghani' },
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

const CustomInput = (props) => {
  return (
    <Input.Group compact>
      <AutoComplete style={{ width: '100%' }} {...props} />
    </Input.Group>
  );
};

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
          type="text"
        >
          <p>Reset</p>
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
        span: 12,
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
              {/* <Select placeholder="Event, .doc, .xlsx, csv" allowClear>
                {listType.map((item) => (
                  <Option key={item}>{item}</Option>
                ))}
              </Select> */}
              <CustomInput placeholder="Event, .doc, .xlsx, csv" options={listType} />
            </Form.Item>
            <Form.Item name="assigned" defaultValue="haha" label="Assignee">
              {/* <Select placeholder="Enter name of assignee" allowClear>
                {listAssigned.map((item) => (
                  <Option key={item.value}>{item.value}</Option>
                ))}
              </Select> */}
              <CustomInput placeholder="Enter name of assignee" options={listAssigned} />
            </Form.Item>
            <Form.Item name="dateModified" label="Date Modified">
              <DatePicker />
            </Form.Item>
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
