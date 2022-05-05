import React from 'react';
import { Form, Select } from 'antd';
import { debounce } from 'lodash';
import style from './index.less';

const MenuFilter = (props) => {
  const [form] = Form.useForm();

  const { listStatus = [], companyList = [], onSubmit = () => {} } = props;
  const yesNo = [
    <Select.Option key="yes">Yes</Select.Option>,
    <Select.Option key="no">No</Select.Option>,
  ];
  const onFinishDebounce = debounce((values) => {
    onSubmit(values);
  }, 700);

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    onFinishDebounce(values);
  };

  return (
    <div className={style.menuFilter}>
      <Form form={form} layout="vertical" name="filter" onValuesChange={onValuesChange}>
        <Form.Item label="By Status" name="byStatus">
          <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="Please select">
            {listStatus}
          </Select>
        </Form.Item>
        <Form.Item label="By Company" name="byDba">
          <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="Please select">
            {companyList.map((company) => (
              <Select.Option value={company.dba}>{company.dba}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="By Open Leads" name="byOpenLeads">
          <Select allowClear style={{ width: '100%' }} placeholder="Please select">
            {yesNo}
          </Select>
        </Form.Item>
        <Form.Item label="By Pending Tickets" name="byPendingTickets">
          <Select allowClear style={{ width: '100%' }} placeholder="Please select">
            {yesNo}
          </Select>
        </Form.Item>
        <Form.Item label="By Pending Tasks" name="byPendingTasks">
          <Select allowClear style={{ width: '100%' }} placeholder="Please select">
            {yesNo}
          </Select>
        </Form.Item>
        <Form.Item label="By Active Projects" name="byActiveProjects">
          <Select allowClear style={{ width: '100%' }} placeholder="Please select">
            {yesNo}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MenuFilter;
