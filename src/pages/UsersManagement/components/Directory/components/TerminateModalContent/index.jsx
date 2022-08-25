import { DatePicker, Form, Input } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import styles from './index.less';

const { TextArea } = Input;

const TerminateModalContent = (props) => {
  const [form] = Form.useForm();

  const {
    valueReason = '',
    onClose = () => {},
    approvalflow = [],
    employee = '',
    dispatch,
  } = props;

  const handleFinish = (values) => {
    const { reason, lastWorkingDate } = values;
    let approvalFlowID = '';
    approvalflow.forEach((item) => {
      approvalFlowID = item._id;
    });
    const payload = {
      action: 'submit',
      employee,
      reasonForLeaving: reason,
      approvalFlow: approvalFlowID,
      lastWorkingDate,
    };

    dispatch({
      type: 'offboarding/terminateReason',
      payload,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        // refreshList();
        onClose();
      }
    });
  };

  return (
    <div className={styles.TerminateModalContent}>
      <Form
        form={form}
        onFinish={handleFinish}
        preserve={false}
        id="myForm"
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
              message: 'Required field!',
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
              message: 'Required field!',
            },
          ]}
        >
          <DatePicker
            className={styles.datePicker}
            format={DATE_FORMAT_MDY}
            disabledDate={(current) => {
              return current && current > moment().endOf('day');
            }}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(({ loading, usersManagement, offboarding: { approvalflow = [] } = {} }) => ({
  approvalflow,
  usersManagement,
  loading: loading.effects['offboarding/terminateReason'],
}))(TerminateModalContent);
