import React from 'react';
import { Input, Form, Button, Select, DatePicker } from 'antd';
import { connect, history } from 'umi';
import { LIST_TYPE_TICKET, LIST_STATUS_TICKET } from '@/utils/globalSearch';
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
  const dateFormat = 'DD/MM/YYYY';
  return (
    <Form
      form={form}
      layout="vertical"
      name="advancedSearch"
      onFinish={onFinish}
      initialValues={ticketAdvance}
    >
      <div className={styles.resultContent}>
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
              <DatePicker placeholder="Enter created On" format={dateFormat} />
            </Form.Item>
          </div>
        </div>
      </div>
      <div className={styles.filterFooter}>
        <Button
          type="link"
          htmlType="button"
          className={styles.btnReset}
          onClick={() => form.resetFields()}
        >
          Reset
        </Button>
        <Button type="primary" htmlType="submit" className={styles.btnSubmit}>
          Search
        </Button>
      </div>
    </Form>
  );
};
export default connect(({ searchAdvance: { ticketAdvance = {} } }) => ({ ticketAdvance }))(
  AdvancedSearchTicket,
);
