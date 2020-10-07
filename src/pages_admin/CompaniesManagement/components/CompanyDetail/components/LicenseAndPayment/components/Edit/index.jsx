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
      companyName: 'Terralogic',
      DBA: 'DBA',
      EIN: 'EIN',
      headQuaterAdd: 'Head Quarter Add',
      value: 'Work Location',
      employeeNumber: 'Employee Number',
      license: 'License',
      payment: 'Payment',
    };
    const { companyName, DBA, EIN, headQuaterAdd, employeeNumber } = companyDetail;
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
            companyName,
            DBA,
            EIN,
            headQuaterAdd,
            employeeNumber,
          }}
        >
          <Form.Item
            label="Company Name"
            name="companyName"
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
            label="DBA"
            name="DBA"
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
            label="EIN"
            name="EIN"
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
            label="Head Quarter Add"
            name="headQuaterAdd"
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
