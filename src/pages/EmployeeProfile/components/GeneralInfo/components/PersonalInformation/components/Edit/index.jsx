import React, { PureComponent } from 'react';
import { Row, Input, Form, Select } from 'antd';
import { connect, formatMessage } from 'umi';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import styles from './index.less';

@connect(({ employeeProfile }) => ({
  employeeProfile,
}))
class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { dropdown: false };
  }

  handleDropdown = (open) => {
    this.setState({ dropdown: open });
  };

  handleChange = (changedValues) => {
    const {
      dispatch,
      employeeProfile: { tempData: { generalData = {} } = {} },
    } = this.props;
    const generalInfo = {
      ...generalData,
      ...changedValues,
    };
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { generalData: generalInfo },
    });
  };

  render() {
    const { Option } = Select;
    const { TextArea } = Input;
    const { dropdown } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 10 },
      },
    };
    const {
      employeeProfile: { tempData: { generalData = {} } = {} },
    } = this.props;
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        <Form
          className={styles.Form}
          {...formItemLayout}
          initialValues={generalData}
          onValuesChange={(changedValues) => this.handleChange(changedValues)}
        >
          <Form.Item
            label="Personal Number"
            name="personalNumber"
            rules={[
              {
                pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item
            label="Personal Email"
            name="personalEmail"
            rules={[
              {
                pattern: /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateEmail' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item label="Blood Group" name="Blood">
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item label="Marital Status" name="maritalStatus">
            <Select
              allowClear
              className={styles.selectForm}
              onDropdownVisibleChange={this.handleDropdown}
              suffixIcon={
                dropdown ? (
                  <UpOutlined className={styles.arrowUP} />
                ) : (
                  <DownOutlined className={styles.arrowDown} />
                )
              }
            >
              <Option value="Single">Single</Option>
              <Option value="Married">Married</Option>
              <Option value="Rather not mention">Rather not mention</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Linkedin"
            name="Linkedin"
            rules={[
              {
                pattern: /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateEmail' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item label="Residence Address" name="residenceAddress">
            <TextArea autoSize={{ minRows: 2, maxRows: 6 }} className={styles.areaForm} />
          </Form.Item>
          <Form.Item label="Current Address" name="currentAddress">
            <TextArea autoSize={{ minRows: 2, maxRows: 6 }} className={styles.areaForm} />
          </Form.Item>
        </Form>
        {/* Custom Col Here */}
      </Row>
    );
  }
}

export default Edit;
