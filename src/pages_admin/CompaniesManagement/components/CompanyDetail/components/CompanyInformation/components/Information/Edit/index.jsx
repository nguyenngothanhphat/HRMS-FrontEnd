/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import { Button, Form, Input } from 'antd';
import { connect, formatMessage } from 'umi';
import styles from './index.less';

@connect(
  ({
    companiesManagement: {
      originData: { companyDetails: { company: companyDetailsOrigin = {} } = {} },
      tempData: { companyDetails = {} },
      tenantCurrentCompany = '',
    } = {},
    loading,
  }) => ({
    companyDetailsOrigin,
    companyDetails,
    tenantCurrentCompany,
    loadingUpdate: loading.effects['companiesManagement/updateCompany'],
  }),
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

  handleUpdate = (changedValues) => {
    const {
      dispatch,
      companyDetailsOrigin,
      handleCancelEdit = () => {},
      tenantCurrentCompany,
    } = this.props;
    const payload = {
      ...companyDetailsOrigin,
      id: companyDetailsOrigin._id,
      ...changedValues,
      tenantId: tenantCurrentCompany,
    };
    delete payload._id;

    dispatch({
      type: 'companiesManagement/updateCompany',
      payload,
    }).then((resp) => {
      const { statusCode } = resp;
      if (statusCode === 200) {
        handleCancelEdit();
      }
    });
  };

  render() {
    const { companyDetails, loadingUpdate } = this.props;
    const {
      name = '',
      dba = '',
      ein = '',
      employeeNumber = '',
      website = '',
      phone = '',
      contactEmail = '',
    } = companyDetails.company;

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
            phone,
            contactEmail,
            website,
          }}
          onValuesChange={this.handleChangeValues}
          onFinish={this.handleUpdate}
        >
          <Form.Item
            label={formatMessage({ id: 'pages_admin.companies.table.companyName' })}
            name="name"
            {...formItemLayout}
            rules={[
              {
                required: true,
                // pattern: /^[a-zA-Z ]*$/,
                // message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
              },
              {
                pattern: /^([a-zA-Z0-9]((?!__|--)[a-zA-Z0-9_\-\s])+[a-zA-Z0-9])$/,
                message: 'Company name is not a validate name!',
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'pages_admin.company.dba' })}
            name="dba"
            {...formItemLayout}
            rules={[
              {
                required: true,
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
                required: true,
              },
              {
                pattern: /^[0-9]\d?-\d{7}$/,
                message: 'EIN is not a validate EIN. Ex: 01-0901446',
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'pages_admin.company.employeeNumber' })}
            name="employeeNumber"
            {...formItemLayout}
            rules={[
              {
                type: 'number',
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'pages_admin.company.phone' })}
            name="phone"
            {...formItemLayout}
            rules={[
              {
                // pattern: /^[a-zA-Z ]*$/,
                // message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
                pattern:
                  // eslint-disable-next-line no-useless-escape
                  /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[0-9]\d?)\)?)?[\-\.\ ]?)?((?:\(?\d{1,}\)?[\-\.\ ]?){0,})(?:[\-\.\ ]?(?:#|ext\.?|extension|x)[\-\.\ ]?(\d+))?$/gm,
                message: 'The phone number is invalid!',
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'pages_admin.company.contactEmail' })}
            name="contactEmail"
            {...formItemLayout}
            rules={[
              {
                type: 'email',
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'pages_admin.company.website' })}
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
              loading={loadingUpdate}
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
