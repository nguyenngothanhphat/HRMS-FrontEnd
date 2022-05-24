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
    this.state = {
      isNothingChanged: false,
    };
  }

  compareValues = (newValues) => {
    const {
      companyDetails: {
        company: { hrContactName = '', hrContactEmail = '', hrContactPhone = '' } = {},
      } = {},
    } = this.props;
    const {
      hrContactName: newHrContactName = '',
      hrContactEmail: newHrContactEmail = '',
      hrContactPhone: newHrContactPhone = '',
    } = newValues;

    return (
      hrContactName === newHrContactName &&
      hrContactEmail === newHrContactEmail &&
      hrContactPhone === newHrContactPhone
    );
  };

  onFinish = (values) => {
    const {
      dispatch,
      companyDetails = {},
      companyDetails: { company: { _id: id = '' } = {} } = {},
      handleCancelEdit = () => {},
    } = this.props;
    const tenantId = getCurrentTenant();

    const checkTheSame = this.compareValues(values);

    if (checkTheSame) {
      this.setState({
        isNothingChanged: true,
      });
      setTimeout(() => {
        this.setState({
          isNothingChanged: false,
        });
        handleCancelEdit();
      }, 2500);
    } else if (id) {
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
      handleCancelEdit = () => {},
    } = this.props;
    const { isNothingChanged } = this.state;

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

    return (
      <div className={styles.edit}>
        {isNothingChanged && (
          <div className={styles.nothingChangedBanner}>
            <span>Nothing changed !</span>
          </div>
        )}
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
                // pattern: /^[+]*[\d]{0,10}$/,
                pattern:
                  // eslint-disable-next-line no-useless-escape
                  /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[0-9]\d?)\)?)?[\-\.\ ]?)?((?:\(?\d{1,}\)?[\-\.\ ]?){0,})(?:[\-\.\ ]?(?:#|ext\.?|extension|x)[\-\.\ ]?(\d+))?$/gm,
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
              disabled={isNothingChanged}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.edit_btn_save}
              loading={loadingUpdate || loadingSave}
              disabled={isNothingChanged}
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
