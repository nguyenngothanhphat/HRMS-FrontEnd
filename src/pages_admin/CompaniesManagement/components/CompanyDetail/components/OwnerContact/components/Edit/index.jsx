/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import { Button, Form, Input } from 'antd';
import { formatMessage } from 'umi';
import styles from './index.less';

// @connect(({ companiesManagement: { editCompany: { isOpenEditDetail = false } } = {} }) => ({
//   isOpenEditDetail,
// }))
class Edit extends PureComponent {
  render() {
    const companyDetail = {
      name: 'Nguyen Van A',
      email: 'terralogic@terralogic.com',
      phoneNumber: '0123456789',
    };
    const { name, email, phoneNumber } = companyDetail;
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
            email,
            phoneNumber,
          }}
        >
          <Form.Item
            label={formatMessage({ id: 'pages_admin.owner.fullName' })}
            name="name"
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
            name="email"
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
            name="phoneNumber"
            {...formItemLayout}
            // rules={[
            //   {
            //     pattern: /^[+]*[\d]{0,10}$/,
            //     message: formatMessage({ id: 'pages.employeeProfile.validateWorkNumber' }),
            //   },
            // ]}
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
