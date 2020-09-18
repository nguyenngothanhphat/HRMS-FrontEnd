import React, { PureComponent } from 'react';
import { Row, Input, Form, DatePicker, Select } from 'antd';
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
    const {
      employeeProfile: { tempData: { generalData = {} } = {} },
    } = this.props;
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
    const dateFormat = 'Do MMM YYYY';
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        <Form
          className={styles.Form}
          {...formItemLayout}
          initialValues={generalData}
          onValuesChange={(changedValues) => this.handleChange(changedValues)}
        >
          <Form.Item
            label="Passport Number"
            name="passportNo"
            rules={[
              {
                pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item label="Issued Country" name="passportIssueCountry">
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
              <Option value="India">India</Option>
              <Option value="USA">USA</Option>
              <Option value="VietNam">Viet Nam</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Issued On" name="issuedOnPassPort">
            <DatePicker
              format={dateFormat}
              onChange={this.handleChangeDate}
              className={styles.dateForm}
            />
          </Form.Item>
          <Form.Item label="Valid Till" name="validTillPassPort">
            <DatePicker
              format={dateFormat}
              onChange={this.handleChangeDate}
              className={styles.dateForm}
            />
          </Form.Item>

          <div className={styles.line} />

          <Form.Item
            label="Visa Number"
            name="visaNumber"
            rules={[
              {
                pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g,
                message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item label="Visa Type" name="visaType">
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
              <Option value="India">B1</Option>
              <Option value="nothing">nothing...</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Country" name="country">
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
              <Option value="India">India</Option>
              <Option value="USA">USA</Option>
              <Option value="VietNam">Viet Nam</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Entry Type" name="entryType">
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
              <Option value="India">Single Entry</Option>
              <Option value="nothing">nothing....</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Issued On" name="issuedOnVisa">
            <DatePicker
              format={dateFormat}
              onChange={this.handleChangeDate}
              className={styles.dateForm}
            />
          </Form.Item>
          <Form.Item label="Valid Till" name="validTillVisa">
            <DatePicker
              format={dateFormat}
              onChange={this.handleChangeDate}
              className={styles.dateForm}
            />
          </Form.Item>
        </Form>
        {/* Custom Col Here */}
      </Row>
    );
  }
}

export default Edit;
