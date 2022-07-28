import { DatePicker, Form, Input, Select } from 'antd';
import React from 'react';
import { connect, history } from 'umi';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import { LIST_STATUS_TICKET, LIST_TYPE_TICKET } from '@/constants/globalSearch';
import styles from '../../index.less';

const AdvancedSearchTicket = (props) => {
  const { ticketAdvance, dispatch } = props;
  const [form] = Form.useForm();

  const onFinish = (obj) => {
    dispatch({
      type: 'searchAdvance/save',
      payload: {
        isSearch: true,
        isSearchAdvance: true,
        ticketAdvance: { ...obj },
      },
    });
    history.push('/search-result/tickets');
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="advancedSearch"
      onFinish={onFinish}
      initialValues={ticketAdvance}
    >
      <div className={styles.ResultContent}>
        <div className={styles.headerFilter}>
          <div className={styles.headerFilter__title}>Tickets</div>
          <div className={styles.headerFilter__description}>
            Search ID, employee name, created by, assigned to...
          </div>
        </div>
        <div className={styles.containFilter}>
          <div className={styles.filterItem}>
            <Form.Item name="ticketID" label="Ticket ID">
              <Input placeholder="Enter ticket ID" />
            </Form.Item>
            <Form.Item name="assignedTo" label="Assigned To">
              <Input placeholder="Enter assigned to" />
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Select placeholder="Enter Status">
                {LIST_STATUS_TICKET.map((item) => (
                  <Select.Option value={item.key} key={item.key}>
                    {item.value}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className={styles.filterItem}>
            <Form.Item name="employeeName" label="Employee Name">
              <Input placeholder="Enter employee name" />
            </Form.Item>
            <Form.Item name="ticketType" label="Ticket Type">
              <Select placeholder="Enter Status">
                {LIST_TYPE_TICKET.map((item) => (
                  <Select.Option value={item.key} key={item.key}>
                    {item.value}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="resolvedBy" label="Resolved By">
              <Input placeholder="Enter resolved by" />
            </Form.Item>
          </div>
          <div className={styles.filterItem}>
            <Form.Item name="createdBy" label="Created By">
              <Input placeholder="Enter created by" />
            </Form.Item>
            <Form.Item name="createdOn" label="Created On">
              <DatePicker placeholder="Enter created On" format={DATE_FORMAT_MDY} />
            </Form.Item>
          </div>
        </div>
      </div>
      <div className={styles.filterFooter}>
        <CustomSecondaryButton onClick={() => form.resetFields()}>Reset</CustomSecondaryButton>
        <CustomPrimaryButton htmlType="submit">Search</CustomPrimaryButton>
      </div>
    </Form>
  );
};
export default connect(({ searchAdvance: { ticketAdvance = {} } }) => ({ ticketAdvance }))(
  AdvancedSearchTicket,
);
