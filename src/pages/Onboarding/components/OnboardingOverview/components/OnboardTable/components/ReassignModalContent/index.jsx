import { Form, Input } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import DebounceSelect from '@/components/DebounceSelect';
import styles from './index.less';

const ReassignModal = (props) => {
  const { dispatch, refreshData = () => {}, onClose = () => {}, item = {} } = props;

  const { ticketID = '', assignTo = {} } = item || {};
  const onEmployeeSearch = (val) => {
    if (!val) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }
    return dispatch({
      type: 'onboarding/fetchEmployeeList',
      payload: {
        name: val,
        status: ['ACTIVE'],
      },
    }).then((res = {}) => {
      const { data = [] } = res;
      return data
        .filter((hr) => hr._id !== assignTo?._id)
        .map((user) => ({
          label: user.generalInfoInfo?.legalName,
          value: user._id,
        }));
    });
  };

  const onFinish = async (values) => {
    const { to = '' } = values;
    if (to) {
      const res = await dispatch({
        type: 'onboarding/reassignTicket',
        payload: {
          id: ticketID,
          tenantId: getCurrentTenant(),
          newAssignee: to,
        },
      });
      if (res?.statusCode === 200) {
        onClose();
        refreshData();
      }
    }
  };

  return (
    <Form
      name="basic"
      id="myForm"
      onFinish={onFinish}
      initialValues={{
        from: assignTo?.generalInfo?.legalName,
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
        <DebounceSelect
          allowClear
          showArrow
          placeholder="Select an employee"
          fetchOptions={onEmployeeSearch}
          showSearch
        />
      </Form.Item>
    </Form>
  );
};

export default connect(({ loading, onboarding: { employeeList = [] } = {} }) => ({
  loadingFetchEmployeeList: loading.effects['onboarding/fetchEmployeeList'],
  employeeList,
}))(ReassignModal);
