import React, { useState } from 'react';
import { Modal, Input, Form, Button, DatePicker, notification } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import styles from './index.less';

const dateFormat = 'MM.DD.YY';

const { TextArea } = Input;

const TerminateModal = (props) => {
  const [form] = Form.useForm();
  const [date, setDate] = useState('');

  const {
    visible = false,
    valueReason = '',
    // onChange = () => {},
    handleCandelModal = () => {},
    loading,
    approvalflow = [],
    userProfile: { workEmail = '', firstName = '', lastName = '', roles = [], status = '' } = {},
    employeeDetail: { _id = '', tenant = '', generalInfo: { _id: generalInfoId = '' } = {} } = {},
    locationId,
    companyId,
    usersManagement: { currentPayload = {} } = {},
    dispatch,
  } = props;

  const refreshList = () => {
    dispatch({
      type: 'usersManagement/fetchEmployeesList',
      payload: currentPayload,
    });
  };

  const handleFinish = (values) => {
    const { reason, lastWorkingDate } = values;
    let approvalFlowID = '';
    approvalflow.forEach((item) => {
      approvalFlowID = item._id;
    });
    const payload = {
      action: 'submit',
      employee: _id,
      reasonForLeaving: reason,
      approvalFlow: approvalFlowID,
      lastWorkingDate,
    };

    dispatch({
      type: 'usersManagement/updateRolesByEmployee',
      payload: {
        employee: _id,
        roles,
        tenantId: tenant,
      },
    });

    dispatch({
      type: 'usersManagement/updateGeneralInfo',
      payload: {
        id: generalInfoId,
        workEmail,
        firstName,
        lastName,
        tenantId: tenant,
      },
    });

    dispatch({
      type: 'usersManagement/updateEmployee',
      payload: {
        id: _id,
        location: locationId,
        company: companyId,
        status,
        tenantId: tenant,
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        notification.success({
          message: 'Update user successfully',
        });
      }
    });

    dispatch({
      type: 'offboarding/terminateReason',
      payload,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        refreshList();
        handleCandelModal();
      }
    });
  };

  const changeDate = (_, dateValue) => {
    setDate(dateValue);
  };

  return (
    <Modal
      visible={visible}
      className={styles.terminateModal}
      title={false}
      onCancel={handleCandelModal}
      destroyOnClose
      footer={false}
    >
      <div className={styles.contentModal}>
        <div className={styles.titleModal}>Terminate employee</div>
        <Form
          form={form}
          onFinish={handleFinish}
          preserve={false}
          initialValues={{ reason: valueReason }}
        >
          <Form.Item
            label="Reason"
            name="reason"
            className={styles.formModal}
            rules={[
              {
                pattern: /^[\W\S_]{0,1000}$/,
                message: 'Only fill up to 1000 characters !',
              },
              {
                required: true,
                message: 'Please input field !',
              },
            ]}
          >
            <TextArea
              className={styles.fieldModal}
              placeholder="Fill in the box..."
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </Form.Item>
          <Form.Item
            label="Last Working Date"
            name="lastWorkingDate"
            className={styles.datePickerForm}
            rules={[
              {
                required: true,
                message: 'Please choose date !',
              },
            ]}
          >
            <DatePicker
              className={styles.datePicker}
              format={dateFormat}
              onChange={changeDate}
              disabledDate={(current) => {
                return current && current > moment().endOf('day');
              }}
            />
          </Form.Item>
          <Form.Item className={styles.flexContent}>
            <Button
              className={`${styles.btnGroup} ${styles.btnCancel}`}
              onClick={handleCandelModal}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className={`${styles.btnGroup} ${styles.btnSubmit}`}
              htmlType="submit"
              loading={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default connect(({ loading, usersManagement, offboarding: { approvalflow = [] } = {} }) => ({
  approvalflow,
  usersManagement,
  loading: loading.effects['offboarding/terminateReason'],
}))(TerminateModal);
