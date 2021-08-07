/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import { Button, Form, Input } from 'antd';
import { formatMessage, connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import styles from '../../../CompanyInformation/components/Information/Edit/index.less';

@connect(({ companiesManagement: { originData: { companyDetails = {} } = {} } = {}, loading }) => ({
  companyDetails,
  loadingUpdate: loading.effects['companiesManagement/updateCompany'],
  loadingSave: loading.effects['companiesManagement/saveCompanyDetails'],
}))
class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onFinish = (values) => {
    const {
      dispatch,
      companyDetails = {},
      companyDetails: { company: { _id: id = '' } = {} } = {},
      handleCancelEdit = () => {},
    } = this.props;
    const tenantId = getCurrentTenant();

    if (id) {
      dispatch({
        type: 'companiesManagement/updateCompany',
        payload: { id, ...values, tenantId },
      }).then(({ statusCode: check }) => {
        if (check === 200) {
          handleCancelEdit();
        }
      });
    } else {
      dispatch({
        type: 'companiesManagement/saveCompanyDetails',
        payload: { ...companyDetails?.company, ...values },
      });
      handleCancelEdit();
    }
  };

  render() {
    const {
      companyDetails: {
        company: { hrContactName = '', hrContactEmail = '', hrContactPhone = '' } = {},
      } = {},
      loadingUpdate,
      loadingSave,
    } = this.props;

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
            hrContactName,
            hrContactEmail,
            hrContactPhone,
          }}
          onFinish={this.onFinish}
        >
          <Form.Item
            label={formatMessage({ id: 'pages_admin.owner.fullName' })}
            name="hrContactName"
            {...formItemLayout}
            rules={[
              {
                pattern: /^[a-zA-Z ]*$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
              },
            ]}
          >
            <Input className={styles.inputForm} />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'pages_admin.owner.email' })}
            name="hrContactEmail"
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
            label={formatMessage({ id: 'pages_admin.owner.phone' })}
            name="hrContactPhone"
            {...formItemLayout}
            rules={[
              {
                pattern: /^[+]*[\d]{0,10}$/,
                message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
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
              loading={loadingUpdate || loadingSave}
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
