import { Form, Input, Select } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import DefaultAvatar from '@/assets/avtDefault.jpg';
import styles from './index.less';

const { Option } = Select;

const ReassignModal = (props) => {
  const {
    dispatch,
    reassignTicketId = '',
    processStatus = '',
    type = '',
    page = '',
    limit = '',
    onClose = () => {},
    employeeList = [],
    currentEmpId = '',
    currentEmpName = '',
    visible = false,
    loadingFetchEmployeeList = false,
  } = props;

  const fetchListEmployee = () => {
    dispatch({
      type: 'onboarding/fetchEmployeeList',
    });
  };

  useEffect(() => {
    if (employeeList.length === 0 && visible) {
      fetchListEmployee();
    }
  }, []);

  const onFinish = async (values) => {
    const { to = '' } = values;
    if (to) {
      const res = await dispatch({
        type: 'onboarding/reassignTicket',
        payload: {
          id: reassignTicketId,
          tenantId: getCurrentTenant(),
          newAssignee: to,
          processStatus,
          isAll: type === 'ALL',
          page,
          limit,
        },
      });
      if (res?.statusCode === 200) {
        onClose();
      }
    }
  };

  const renderHR = (hr) => {
    const {
      generalInfo: {
        avatar = '',
        // workEmail = '',
        legalName = '',
      } = {},
    } = hr;

    return (
      <Option key={hr._id} value={hr._id} style={{ padding: '10px' }}>
        <div
          style={{
            display: 'inline-block',
            marginRight: '10px',
            width: 25,
            height: 25,
          }}
        >
          <img
            style={{
              width: 25,
              height: 25,
              objectFit: 'cover',
              borderRadius: '50%',
            }}
            src={avatar}
            alt="user"
            onError={(e) => {
              e.target.src = DefaultAvatar;
            }}
          />
        </div>
        <span style={{ fontSize: '13px', color: '#161C29' }} className={styles.ccEmail}>
          {legalName}
        </span>
      </Option>
    );
  };

  const hrListFormat = employeeList.filter((hr) => hr._id !== currentEmpId);

  return (
    <Form
      name="basic"
      id="myForm"
      onFinish={onFinish}
      initialValues={{
        from: currentEmpName,
      }}
      className={styles.ReassignModal}
    >
      <Form.Item label="From" name="from" labelCol={{ span: 24 }}>
        <Input disabled />
      </Form.Item>
      <Form.Item
        label="To"
        name="to"
        labelCol={{ span: 24 }}
        rules={[
          {
            required: true,
            message: 'Please select a employee',
          },
        ]}
      >
        <Select
          filterOption={(input, option) => {
            return (
              option.children[1].props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
          }}
          showSearch
          allowClear
          placeholder="Select an employee"
          loading={loadingFetchEmployeeList}
        >
          {hrListFormat.map((hr) => {
            return renderHR(hr);
          })}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default connect(({ loading, onboarding: { employeeList = [] } = {} }) => ({
  loadingFetchEmployeeList: loading.effects['onboarding/fetchEmployeeList'],
  employeeList,
}))(ReassignModal);
