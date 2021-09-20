import React from 'react';
import { Input, Form, Button } from 'antd';
import { connect, history } from 'umi';
import styles from '../../index.less';

const AdvancedSearchTicket = (props) => {
  const { ticketAdvance, dispatch } = props;
  const [form] = Form.useForm();

  const onFinish = (obj) => {
    console.log('obj', obj);
    dispatch({
      type: 'searchAdvance/save',
      payload: {
        isSearch: true,
        ticketAdvance: { ...obj },
        keySearch: '',
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
      <div className={styles.resultContent}>
        <div className={styles.headerFilter}>
          <div className={styles.headerFilter__title}>Tickets</div>
          <div className={styles.headerFilter__description}>
            Search ID, employee name, created by, assigned to...
          </div>
        </div>
        <div className={styles.containFilter}>
          <div className={styles.filterItem}>
            <Form.Item name="ticketId" label="Ticket ID">
              <Input placeholder="Enter ticket ID" />
            </Form.Item>
            <Form.Item name="assignedTo" label="Assigned To">
              <Input placeholder="Enter assigned to" />
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Input placeholder="Enter Status" />
            </Form.Item>
          </div>

          <div className={styles.filterItem}>
            <Form.Item name="employeeName" label="Employee Name">
              <Input placeholder="Enter employee name" />
            </Form.Item>
            <Form.Item name="ticketType" label="Ticket Type">
              <Input placeholder="Enter ticket type" />
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
              <Input placeholder="Enter created On" />
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
