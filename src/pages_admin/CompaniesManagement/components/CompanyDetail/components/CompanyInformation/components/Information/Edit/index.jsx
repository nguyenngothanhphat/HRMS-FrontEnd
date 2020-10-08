/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import { Button, Form, Input } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(
  ({
    companiesManagement: {
      originData: { companyDetails: companyDetailsOrigin = {} },
      tempData: { companyDetails = {} },
    } = {},
  }) => ({ companyDetailsOrigin, companyDetails }),
)
class Edit extends PureComponent {
  handleChangeValues = (changedValues) => {
    const { dispatch, companyDetails, companyDetailsOrigin } = this.props;
    const companyDetailsChange = {
      ...companyDetails,
      ...changedValues,
    };
    const isModified =
      JSON.stringify(companyDetailsChange) !== JSON.stringify(companyDetailsOrigin);
    dispatch({
      type: 'companiesManagement/saveTemp',
      payload: { companyDetails: companyDetailsChange },
    });
    dispatch({
      type: 'companiesManagement/save',
      payload: { isModified },
    });
  };

  render() {
    const { companyDetails } = this.props;
    const { name = '', dba = '', ein = '', employeeNumber = '', website = '' } = companyDetails;

    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 9 },
        sm: { span: 9 },
      },
    };
    const { handleCancelEdit = () => {} } = this.props;
    return (
      <div className={styles.edit}>
        <Form
          className={styles.Form}
          initialValues={{
            name,
            dba,
            ein,
            employeeNumber,
            website,
          }}
          onValuesChange={this.handleChangeValues}
        >
          <Form.Item
            label="Company Name"
            name="name"
            {...formItemLayout}
            rules={[
              {
                // pattern: /^[a-zA-Z ]*$/,
                // message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item
            label="Doing Business As (DBA)"
            name="dba"
            {...formItemLayout}
            rules={[
              {
                // pattern: /^[a-zA-Z ]*$/,
                // message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item
            label="EIN"
            name="ein"
            {...formItemLayout}
            rules={[
              {
                // pattern: /^[a-zA-Z ]*$/,
                // message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item
            label="Employee Number"
            name="employeeNumber"
            {...formItemLayout}
            rules={[
              {
                pattern: /^\d+$/,
                message: 'Employee number is not validate number!',
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item
            label="Website"
            name="website"
            {...formItemLayout}
            rules={[
              {
                // pattern: /^[a-zA-Z ]*$/,
                // message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <div className={styles.edit_btn}>
            <Button
              type="text"
              className={styles.edit_btn_cancel}
              onClick={handleCancelEdit}
              // loading={loading}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.edit_btn_save}
              // loading={loading}
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default Edit;
