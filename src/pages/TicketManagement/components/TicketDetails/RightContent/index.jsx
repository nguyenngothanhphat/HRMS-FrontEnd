/* eslint-disable react/jsx-curly-newline */
import { Card, Empty, Form, Input, notification, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import styles from './index.less';

const { Option } = Select;

const RightContent = (props) => {
  const [form] = Form.useForm();

  const { dispatch, loadingUpdateTicket = false, data = {}, employee: { _id = '' } = {} } = props;

  const {
    id = '',
    status: statusProps = '',
    time_taken: timeTakenProps = 0,
    employee_assignee: employeeAssignee = '',
    employee_raise: employeeRaise = '',
    query_type: queryType = '',
    subject = '',
    description = '',
    priority = '',
    cc_list: ccList = [],
    attachments = [],
    department_assign: departmentAssign = '',
  } = data;

  const [status, setStatus] = useState('');
  const [timeTaken, setTimeTaken] = useState(0);

  useEffect(() => {
    setStatus(statusProps);
    form.setFieldsValue({
      status: statusProps,
      timeTaken: timeTakenProps,
    });
  }, [statusProps]);

  const renderOption = () => {
    if (status) {
      return (
        <Select
          value={status}
          style={{ width: 100 }}
          onChange={(value) => setStatus(value)}
          disabled={!employeeAssignee}
        >
          <Option value="Assigned">Assigned</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Client Pending">Client Pending</Option>
          <Option value="Resolved">Resolved</Option>
          <Option value="Closed">Closed</Option>
        </Select>
      );
    }
    return (
      <Select style={{ width: 100 }} disabled={!employeeAssignee}>
        <Option disabled>
          <Empty />
        </Option>
      </Select>
    );
  };

  const getTimeTaken = () => {
    return timeTaken !== 0 ? timeTaken : timeTakenProps;
  };

  const onSubmitUpdate = (values) => {
    const { status: status1 = '' } = values;

    const payload = {
      id,
      status,
      employeeRaise,
      employeeAssignee,
      priority,
      description,
      subject,
      ccList,
      queryType,
      attachments,
      departmentAssign,
      employee: _id,
      timeTaken: getTimeTaken(),
    };

    if (status1 !== 'New') {
      if (status1 === 'Resolved' && !timeTaken) {
        notification.error({
          message: 'Please input time taken',
        });
      } else {
        dispatch({
          type: 'ticketManagement/updateTicket',
          payload,
        }).then((res) => {
          const { statusCode = '' } = res;
          if (statusCode === 200) {
            dispatch({
              type: 'ticketManagement/fetchTicketByID',
              payload: {
                id,
              },
            });
          }
        });
      }
    }
  };

  return (
    <div className={styles.RightContent}>
      <Card title="Action">
        <Form
          name="updateForm"
          form={form}
          id="updateForm"
          onFinish={onSubmitUpdate}
          initialValues={{ timeTaken: timeTakenProps || 0, status: statusProps }}
          className={styles.container}
        >
          <Form.Item
            name="timeTaken"
            labelCol={{ span: 24 }}
            label="Time taken"
            rules={[
              {
                pattern: /^[0-9]*([.][0-9]{1})?$/,
                message: 'Time taken must be a number or float number',
              },
            ]}
          >
            <Input
              defaultValue={timeTakenProps}
              addonAfter="Hours"
              disabled={!employeeAssignee}
              onChange={(e) => setTimeTaken(e.target.value)}
            />
          </Form.Item>

          <Form.Item labelCol={{ span: 24 }} label="Status" name="status">
            {renderOption()}
          </Form.Item>
        </Form>
        <div className={styles.buttonContainer}>
          <CustomPrimaryButton
            disabled={
              (status === 'Resolved' && !timeTaken) || status === 'New' || !employeeAssignee
            }
            htmlType="submit"
            form="updateForm"
            key="submit"
            loading={loadingUpdateTicket}
          >
            Update
          </CustomPrimaryButton>
        </div>
      </Card>
    </div>
  );
};

export default connect(({ loading, user: { currentUser: { employee = {} } = {} } = {} }) => ({
  employee,
  loadingUpdateTicket: loading.effects['ticketManagement/updateTicket'],
}))(RightContent);
