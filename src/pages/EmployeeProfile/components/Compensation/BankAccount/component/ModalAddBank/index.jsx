import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';
import { DeleteOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { connect, formatMessage } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import styles from './index.less';

const ModalAddBank = (props) => {
  const [form] = Form.useForm();
  const { bankData, locationEmpl: { headQuarterAddress: { country = '' } = {} } = {} } = props;
  const checkIndiaLocation = country === 'IN';
  const checkVietNamLocation = country === 'VN';
  const checkUSALocation = country === 'US';

  const { onClose = () => {}, visible } = props;

  const onFinishBank = (value) => {
    const {
      accountName,
      accountNumber,
      accountType,
      bankName,
      branchName,
      micrCode,
      ifscCode,
      uanNumber,
      swiftcode,
    } = value;
    console.log('values modal', value);
  };

  const renderContent = () => {
    return (
      <Form
        form={form}
        id="BankAccount"
        onFinish={onFinishBank}
        autoComplete="off"
        layout="vertical"
      >
        <div className={styles.form__block}>
          <Form.Item
            name="bankName"
            label="Bank Name"
            rules={[
              {
                required: true,
                message: 'Please enter the bank name!',
              },
            ]}
          >
            <Input placeholder="Bank Name" />
          </Form.Item>

          <Form.Item
            label="Branch Name"
            name="branchName"
            rules={[
              {
                required: true,
                message: 'Please enter the branch name!',
              },
            ]}
          >
            <Input placeholder="Branch Name" />
          </Form.Item>

          <Form.Item
            label="Account Type"
            name="accountType"
            rules={[
              {
                required: true,
                message: 'Please enter the account type!',
              },
            ]}
          >
            <Select placeholder="Please select a choice" showArrow className={styles.inputForm}>
              <Select.Option value="Salary Account">Salary Account</Select.Option>
              <Select.Option value="Personal Account">Personal Account</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Account Number"
            name="accountNumber"
            rules={[
              {
                required: true,
                message: 'Please enter the account number!',
              },
              {
                pattern: /^[\d]{0,16}$/,
                message: 'Input numbers only and a max of 16 digits',
              },
            ]}
          >
            <Input placeholder="Account Number" />
          </Form.Item>
          {checkIndiaLocation && (
            <>
              <Form.Item
                label="MICR Code"
                name="micrCode"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the MICR code!',
                  },
                ]}
              >
                <Input placeholder="MICR Code" />
              </Form.Item>
              <Form.Item label="IFSC Code" name="ifscCode">
                <Input placeholder="IFSC Code" />
              </Form.Item>
              <Form.Item
                label="UAN Number"
                name="uanNumber"
                rules={[
                  {
                    pattern: /^[\d]{0,16}$/,
                    message: 'Input numbers only and a max of 16 digits',
                  },
                ]}
              >
                <Input placeholder="UAN Number" />
              </Form.Item>
            </>
          )}
          {checkUSALocation && (
            <Form.Item
              label="Routing Number"
              name="routingNumber"
              rules={[
                {
                  required: true,
                  message: 'Please enter the routing number!',
                },
                {
                  pattern: /^[\d]{0,9}$/,
                  message: 'Input numbers only and a max of 9 digits',
                },
              ]}
            >
              <Input placeholder="Routing Number" />
            </Form.Item>
          )}
          {checkVietNamLocation && (
            <Form.Item
              label="Swift Code"
              name="swiftcode"
              rules={[
                {
                  required: true,
                  message: 'Please enter the swift code!',
                },
              ]}
            >
              <Input placeholder="Swift Code" />
            </Form.Item>
          )}
          {checkVietNamLocation && (
            <Form.Item
              label="Account Name"
              name="accountName"
              rules={[
                {
                  required: true,
                  message: 'Please enter the account name!',
                },
              ]}
            >
              <Input placeholder="Account Name" />
            </Form.Item>
          )}
        </div>
      </Form>
    );
  };
  const renderFooter = () => {
    return (
      <div className={styles.footer}>
        <Button className={styles.btnCancel} onClick={onClose}>
          Cancel
        </Button>
        <Button
          className={styles.btnSubmit}
          htmlType="submit"
          form="BankAccount"
          onClick={onFinishBank}
        >
          Add
        </Button>
      </div>
    );
  };
  return (
    <div>
      <Modal
        className={styles.modalCustom}
        onCancel={() => onClose()}
        maskClosable={false}
        footer={renderFooter()}
        title="Add Bank Account"
        style={{ top: 40 }}
        visible={visible}
      >
        <div className={styles.main}>
          <div className={styles.mainContent}>{renderContent()}</div>
        </div>
      </Modal>
    </div>
  );
};

export default connect(
  ({
    employeeProfile: {
      originData: { employmentData: { location: locationEmpl = {} } = {} } = {},
    } = {},
  }) => ({
    locationEmpl,
  }),
)(ModalAddBank);
