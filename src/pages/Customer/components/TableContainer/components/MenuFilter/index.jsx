import React, { useEffect } from 'react';
import { Form, Select, Tooltip } from 'antd';
import { debounce } from 'lodash';
import style from './index.less';
import HelpIcon from '@/assets/projectManagement/help.svg';

const MenuFilter = (props) => {
  const [form] = Form.useForm();

  const { listStatus = [], companyList = [], onSubmit = () => {}, setForm = () => {} } = props;
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

  useEffect(() => {
    setForm(form);
  }, []);

  return (
    <div className={style.menuFilter}>
      <Form form={form} layout="vertical" name="filter" onValuesChange={onValuesChange}>
        <Form.Item label="By Status" name="status">
          <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="Please select">
            {listStatus}
          </Select>
        </Form.Item>
        <Form.Item label="By Company" name="companyName">
          <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="Please select">
            {companyList.map((company) => (
              <Select.Option value={company.dba}>{company.dba}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={
            <span>
              BY OPEN LEADS{' '}
              <Tooltip placement="rightBottom" title="Work in Progress">
                <img src={HelpIcon} alt="" />
              </Tooltip>
            </span>
          }
          name="byOpenLeads"
        >
          <Select allowClear disabled style={{ width: '100%' }} placeholder="Please select">
            {yesNo}
          </Select>
        </Form.Item>
        <Form.Item
          label={
            <span>
              BY PENDING TICKETS{' '}
              <Tooltip placement="rightBottom" title="Work in Progress">
                <img src={HelpIcon} alt="" />
              </Tooltip>
            </span>
          }
          name="byPendingTickets"
        >
          <Select allowClear disabled style={{ width: '100%' }} placeholder="Please select">
            {yesNo}
          </Select>
        </Form.Item>
        <Form.Item
          label={
            <span>
              BY PENDING TASKS{' '}
              <Tooltip placement="rightBottom" title="Work in Progress">
                <img src={HelpIcon} alt="" />
              </Tooltip>
            </span>
          }
          name="byPendingTasks"
        >
          <Select allowClear disabled style={{ width: '100%' }} placeholder="Please select">
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
